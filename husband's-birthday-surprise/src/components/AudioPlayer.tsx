import { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const currentNoteRef = useRef(0);

  // Sweet melody: Happy Birthday / Sweet Love Tune
  // Notes: [freq, duration in seconds, delay from start of note]
  const melody = [
    // Happy birthday tune: G4 G4 A4 G4 C5 B4
    [392.00, 0.4], [392.00, 0.4], [440.00, 0.8], [392.00, 0.8], [523.25, 0.8], [493.88, 1.2],
    // Pause
    [0, 0.4],
    // G4 G4 A4 G4 D5 C5
    [392.00, 0.4], [392.00, 0.4], [440.00, 0.8], [392.00, 0.8], [587.33, 0.8], [523.25, 1.2],
    // Pause
    [0, 0.4],
    // G4 G4 G5 E5 C5 B4 A4
    [392.00, 0.4], [392.00, 0.4], [783.99, 0.8], [659.25, 0.8], [523.25, 0.8], [493.88, 0.8], [440.00, 1.2],
    // Pause
    [0, 0.4],
    // F5 F5 E5 C5 D5 C5
    [698.46, 0.4], [698.46, 0.4], [659.25, 0.8], [523.25, 0.8], [587.33, 0.8], [523.25, 1.6]
  ];

  const playNote = (ctx: AudioContext, frequency: number, duration: number, time: number) => {
    if (frequency === 0) return; // Rest note

    // Synthesize a beautiful soft bell sound using a Sine oscillator and short triangle
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, time);

    // Warm, lush chime envelope
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.12, time + 0.05); // quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.05); // elegant decay

    // Subtly enrich sound with a tiny harmonic overtone
    const overtone = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(frequency * 2, time);
    overtoneGain.gain.setValueAtTime(0, time);
    overtoneGain.gain.linearRampToValueAtTime(0.04, time + 0.05);
    overtoneGain.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.05);

    // Connect nodes
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    overtone.connect(overtoneGain);
    overtoneGain.connect(ctx.destination);

    // Start & Stop
    osc.start(time);
    osc.stop(time + duration);

    overtone.start(time);
    overtone.stop(time + duration);
  };

  const scheduleNextNote = () => {
    if (!isPlaying || !audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const currentNote = currentNoteRef.current;
    const [freq, duration] = melody[currentNote];

    // Play current note immediately
    playNote(ctx, freq, duration, ctx.currentTime);

    // Schedule next trigger
    const nextTriggerMs = duration * 1000;
    timerRef.current = window.setTimeout(() => {
      currentNoteRef.current = (currentNote + 1) % melody.length;
      scheduleNextNote();
    }, nextTriggerMs);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // Play
      if (!audioCtxRef.current) {
        // Create context on user gesture
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      scheduleNextNote();
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-3 bg-pink-50/70 backdrop-blur-md border border-pink-100 p-3 rounded-2xl shadow-sm" id="ambient-audio-player">
      <button
        onClick={toggleMusic}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          isPlaying
            ? 'bg-pink-500 text-white animate-pulse shadow-md shadow-pink-500/20'
            : 'bg-white hover:bg-pink-50 text-pink-600 border border-pink-200'
        }`}
        title={isPlaying ? 'Mute romantic tune' : 'Play romantic tune'}
        id="btn-music-toggle"
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
      <div className="flex flex-col select-none">
        <span className="text-xs font-semibold text-pink-950 flex items-center gap-1">
          <Music className="w-3.5 h-3.5 text-pink-500" />
          Background Music
          {isPlaying && <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
        </span>
        <span className="text-[10px] text-pink-800/80 font-medium">
          {isPlaying ? 'Playing soft chimes ♫' : 'Click play for cute audio chimes!'}
        </span>
      </div>
    </div>
  );
}
