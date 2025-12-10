This is a starter Next.js app for the My-Soundtrack project.

Setup:
1. Copy .env.local.example to .env.local and fill in your Supabase project values.
2. Create a public bucket named "tracks" in Supabase Storage (or set your chosen bucket) and allow public access for quick testing.
3. npm install && npm run dev

Notes:
- Uploaded tracks are stored in Supabase Storage and added to the client playlist.
- Offline download stores audio blobs in IndexedDB using localforage.
