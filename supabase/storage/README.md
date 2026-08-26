# Storage setup and policies

This file contains instructions to create the required Supabase Storage buckets and example policies.

Buckets to create:
- avatars (private)
- note-files (private)
- research-files (private)

Recommended CLI steps (Supabase CLI installed and authenticated):

1) Create buckets

supabase storage create-bucket avatars --public false
supabase storage create-bucket note-files --public false
supabase storage create-bucket research-files --public false

2) Example policy for restricting access to user-owned paths

-- The following is an example RLS-style policy for storage objects. Apply via the Supabase SQL editor under Storage -> Policies.

-- Allow uploads only when the authenticated user's id matches the path prefix
-- Note: Supabase Storage policies use request.auth.uid() and bucket/object metadata. Example policy:

-- allow insert
-- (This is a conceptual example; adapt in Supabase dashboard.)

-- For private buckets, ensure the files are stored under paths like avatars/{user_id}/...

