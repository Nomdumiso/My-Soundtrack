import React, { useMemo, useState } from 'react';
import useAudio from '../hooks/useAudio';
import Player from '../components/Player';
import UploadForm from '../components/UploadForm';
import sampleData from '../data/soundtracks.json';

export default function Home(){
  const [moodFilter, setMoodFilter] = useState('all');
  const [tracksState, setTracksState] = useState(sampleData.tracks || []);
  const player = useAudio(tracksState, { crossfadeMs: 900 });

  function handleUpload(track){
    const newTracks = [...tracksState, track];
    setTracksState(newTracks);
    player.setTracks(newTracks);
  }

  const moods = useMemo(()=>{
    const s = new Set();
    tracksState.forEach(t=> (t.mood || []).forEach(m=>s.add(m)));
    return ['all', ...Array.from(s)];
  },[tracksState]);

  const filtered = useMemo(()=>{
    if (moodFilter === 'all') return tracksState;
    return tracksState.filter(t => (t.mood||[]).includes(moodFilter));
  },[tracksState,moodFilter]);

  return (
    <div className="app-shell">
      <div className="container">
        <div className="header">
          <div className="title">My Soundtrack — calm player</div>
          <div style={{color:'var(--muted)'}}>Peaceful listening</div>
        </div>
        <div className="layout">
          <div>
            <Player playerHook={player} />
            <div className="card" style={{marginTop:12}}>
              <div style={{fontWeight:600, marginBottom:8}}>Filters</div>
              <div className="filter-row">
                {moods.map(m=> (
                  <div key={m} className="mood-pill" onClick={()=>setMoodFilter(m)} style={{background: m===moodFilter? 'var(--accent)':'#f4f6f6'}}>{m}</div>
                ))}
              </div>
              <div style={{marginTop:10}}>
                <div style={{fontWeight:600}}>Playlist</div>
                <div className="list">
                  {filtered.map((t, i)=> (
                    <div key={t.id} style={{padding:8, borderBottom:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div>
                        <div style={{fontWeight:600}}>{t.title}</div>
                        <div style={{color:'var(--muted)',fontSize:13}}>{t.artist} • { (t.mood||[]).join(', ') }</div>
                      </div>
                      <div>
                        <button className="btn" onClick={()=>{ player.setTracks(filtered); player.play(); player.createHowl(i); player.playAt ? player.playAt(i) : player.play(); }}>Play</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <UploadForm onUpload={handleUpload} />
            <div className="card" style={{marginTop:12}}>
              <div style={{fontWeight:600}}>About</div>
              <p style={{color:'var(--muted)'}}>This starter app uses Supabase Storage for uploads, Howler for playback and a small IndexedDB helper for offline caching of user-downloaded tracks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
