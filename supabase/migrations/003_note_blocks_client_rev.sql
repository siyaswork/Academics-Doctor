-- Add a client-supplied revision counter to note_blocks and drop stale writes.
--
-- The frontend maintains a monotonically increasing counter per block
-- (note_id + position) and sends it as client_rev with every upsert. If an
-- older save request resolves after a newer one (out-of-order network
-- responses), this trigger silently discards the stale write so it can never
-- overwrite newer content.

alter table note_blocks
  add column if not exists client_rev int not null default 0;

create or replace function note_blocks_reject_stale_client_rev()
returns trigger
language plpgsql
as $$
begin
  if new.client_rev is null then
    new.client_rev := 0;
  end if;
  if exists (
    select 1
    from note_blocks existing
    where existing.note_id = new.note_id
      and existing.position = new.position
      and existing.client_rev > new.client_rev
  ) then
    -- A newer revision is already stored; drop this stale write.
    return null;
  end if;
  return new;
end;
$$;

drop trigger if exists note_blocks_client_rev_guard on note_blocks;
create trigger note_blocks_client_rev_guard
  before insert or update on note_blocks
  for each row
  execute function note_blocks_reject_stale_client_rev();
