import React from 'react';

export default function Player({ playerHook }){
  const { tracks, index, isPlaying, progress, play, pause, next, prev } = playerHook;
  const t = tracks[index] || {};
  return (
    <div className="card">
      <img className="artwork" src={t.cover || ''} alt={t.title || 'cover'} />
      <div className="track-info">
        <div style={{fontWeight:600}}>{t.title || '—'}</div>
        <div style={{color:'var(--muted)'}}>{t.artist || ''}</div>
      </div>
      <div className="progress" role="progressbar" aria-valuenow={Math.round(progress)}>
        <i style={{width: `${progress}%`}}></i>
      </div>
      <div className="controls">
        <button className="btn" onClick={prev}>Prev</button>
        {!isPlaying ? <button className="btn" onClick={play}>Play</button> : <button className="btn" onClick={pause}>Pause</button>}
        <button className="btn" onClick={next}>Next</button>
      </div>
    </div>
  );
}
