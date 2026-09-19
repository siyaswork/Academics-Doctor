-- Apply the manual duplicate cleanup documented in the PR before this migration
-- when upgrading a database that already contains duplicate note block positions.
alter table note_blocks
  add constraint note_blocks_note_id_position_key unique (note_id, position);
