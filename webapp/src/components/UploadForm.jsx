import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function UploadForm({ onUpload }){
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('calm');
  const [loading, setLoading] = useState(false);

  async function handleUpload(e){
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try{
      const filePath = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('tracks').upload(filePath, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('tracks').getPublicUrl(filePath);
      const track = {
        id: 'sup-' + Date.now(),
        title: title || file.name,
        artist: 'Uploaded',
        mood: [mood],
        cover: '',
        src: urlData.publicUrl
      };
      onUpload(track);
    }catch(err){
      console.error('Upload error', err.message || err);
      alert('Upload failed: ' + (err.message || err));
    }finally{ setLoading(false); }
  }

  return (
    <form className="card" onSubmit={handleUpload}>
      <div style={{marginBottom:8}}>Upload a track to Supabase Storage</div>
      <input type="text" placeholder="Title (optional)" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',marginBottom:8}} />
      <select value={mood} onChange={e=>setMood(e.target.value)} style={{width:'100%',marginBottom:8}}>
        <option value="calm">calm</option>
        <option value="chill">chill</option>
        <option value="introspective">introspective</option>
      </select>
      <input type="file" accept="audio/*" onChange={e=>setFile(e.target.files && e.target.files[0])} style={{marginBottom:8}} />
      <div style={{display:'flex',gap:8}}>
        <button className="btn" type="submit" disabled={loading}>{loading? 'Uploading...':'Upload'}</button>
      </div>
    </form>
  );
}
