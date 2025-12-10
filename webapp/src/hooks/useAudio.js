import { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';

export default function useAudio(initialTracks = [], opts = { crossfadeMs: 800 }){
  const [tracks, setTracks] = useState(initialTracks);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const howls = useRef({});
  const progressTimer = useRef(null);
  const crossfadeMs = opts.crossfadeMs || 800;

  useEffect(()=>{
    // cleanup on unmount
    return () => {
      Object.values(howls.current).forEach(h => h && h.unload && h.unload());
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  },[]);

  useEffect(()=>{
    setTracks(initialTracks);
  },[initialTracks]);

  function createHowl(i){
    const t = tracks[i];
    if (!t) return null;
    if (howls.current[t.id]) return howls.current[t.id];
    const h = new Howl({ src: [t.src], html5: true, volume: 1.0 });
    h.on('end', () => { next(); });
    howls.current[t.id] = h;
    return h;
  }

  function playAt(i){
    if (i < 0 || i >= tracks.length) return;
    const curr = howls.current[tracks[index]?.id];
    const nextH = createHowl(i);
    if (curr && curr.playing() && nextH && curr !== nextH){
      // crossfade
      nextH.volume(0);
      nextH.play();
      curr.fade(curr.volume(), 0, crossfadeMs);
      nextH.fade(0, 1, crossfadeMs);
      setTimeout(()=>{ try{ curr.stop(); }catch(e){} }, crossfadeMs + 120);
    } else {
      if (nextH) nextH.play();
    }
    setIndex(i);
    setIsPlaying(true);
    startProgressTimer();
  }

  function play(){ playAt(index); }
  function pause(){
    const h = howls.current[tracks[index]?.id];
    if (h) { h.pause(); setIsPlaying(false); stopProgressTimer(); }
  }
  function next(){ playAt((index + 1) % tracks.length); }
  function prev(){ playAt((index - 1 + tracks.length) % tracks.length); }
  function seekTo(sec){
    const h = howls.current[tracks[index]?.id];
    if (h) h.seek(sec);
  }

  function startProgressTimer(){
    stopProgressTimer();
    progressTimer.current = setInterval(()=>{
      const h = howls.current[tracks[index]?.id];
      if (h) {
        const d = h.duration() || tracks[index]?.duration || 0;
        const s = h.seek() || 0;
        setProgress(d ? (s / d) * 100 : 0);
      }
    }, 500);
  }
  function stopProgressTimer(){ if (progressTimer.current) clearInterval(progressTimer.current); }

  return { tracks, setTracks, index, isPlaying, progress, play, pause, next, prev, seekTo, createHowl };
}
