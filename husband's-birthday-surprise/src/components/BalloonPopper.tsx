import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface Balloon {
  id: number;
  left: number; // percentage
  speed: number; // seconds to float up
  color: string;
  size: number;
  label: string;
}

const BalloonColors = [
  '#f43f5e', // rose-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#8b5cf6', // violet-500
];

const SweetLabels = [
  'Kindest Soul',
  'My Handsome Guy',
  'Best Friend',
  'Amazing Dad',
  'My Safe Haven',
  'My Rock',
  'Laughter Maker',
  'Endless Love',
];

export default function BalloonPopper() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [revealedWords, setRevealedWords] = useState<string[]>([]);
  const [showGrandMessage, setShowGrandMessage] = useState(false);

  // Spawn balloons periodically
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      if (showGrandMessage) return;

      const newBalloon: Balloon = {
        id: Date.now() + Math.random(),
        left: 10 + Math.random() * 80, // stay away from edges
        speed: 5 + Math.random() * 4, // 5 to 9 seconds
        color: BalloonColors[Math.floor(Math.random() * BalloonColors.length)],
        size: 50 + Math.random() * 25, // 50px to 75px
        label: SweetLabels[Math.floor(Math.random() * SweetLabels.length)],
      };

      setBalloons((prev) => [...prev, newBalloon].slice(-15)); // max 15 on screen
    }, 1500);

    return () => clearInterval(spawnTimer);
  }, [showGrandMessage]);

  const popBalloon = (id: number, label: string) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setPoppedCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setShowGrandMessage(true);
      }
      return next;
    });
    setRevealedWords((prev) => [label, ...prev].slice(0, 4));
  };

  const resetGame = () => {
    setBalloons([]);
    setPoppedCount(0);
    setRevealedWords([]);
    setShowGrandMessage(false);
  };

  return (
    <div className="flex flex-col items-center bg-pink-100/40 border-4 border-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden h-96 w-full max-w-sm mx-auto" id="balloon-popper-widget">
      <div className="text-center mb-4 z-10 select-none">
        <h3 className="font-serif text-lg font-black text-pink-600 flex items-center justify-center gap-1.5 uppercase tracking-wide">
          🎈 Pop My Love Balloons!
        </h3>
        <p className="text-pink-900/80 font-medium text-[11px]">
          Pop 5 floating balloons to unlock my main secret message! ({poppedCount}/5)
        </p>
      </div>

      {/* Floating Canvas Area */}
      <div className="relative flex-1 w-full bg-white/70 border border-pink-100/30 rounded-3xl overflow-hidden z-10">
        <AnimatePresence>
          {balloons.map((balloon) => (
            <motion.button
              key={balloon.id}
              initial={{ y: '110%', opacity: 1, left: `${balloon.left}%` }}
              animate={{ y: '-120%' }}
              exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: balloon.speed, ease: 'linear' }}
              onClick={() => popBalloon(balloon.id, balloon.label)}
              className={`absolute rounded-full cursor-pointer flex flex-col items-center justify-center border border-white/40 shadow-sm focus:outline-none select-none`}
              style={{
                width: `${balloon.size}px`,
                height: `${balloon.size * 1.25}px`,
                backgroundColor: balloon.color,
              }}
              id={`balloon-${balloon.id}`}
            >
              {/* Balloon knot */}
              <div className="absolute -bottom-1.5 w-2 h-2 bg-inherit border-b border-r border-white/20 transform rotate-45" />
              {/* Balloon string */}
              <div className="absolute -bottom-10 w-0.5 h-10 bg-pink-300/60" />
              
              {/* Heart decoration on balloon */}
              <Heart className="w-4 h-4 text-white/50 fill-white/30" />
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Grand Message Pop-up */}
        <AnimatePresence>
          {showGrandMessage && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 bg-pink-50/95 flex flex-col items-center justify-center p-6 text-center z-20"
              id="balloon-grand-message-popup"
            >
              <Heart className="w-10 h-10 text-pink-500 fill-pink-300 animate-bounce mb-3" />
              <h4 className="font-serif text-lg font-black text-pink-600 mb-2">
                ♥ HAPPY BIRTHDAY TO MY WORLD! ♥
              </h4>
              <p className="text-xs text-pink-950 font-medium leading-relaxed mb-4 max-w-[240px]">
                "Every single balloon carries a piece of my heart. You make my life so colorful, sweet, and incredibly happy. Thank you for being the perfect partner, husband, and friend. I cherish you!"
              </p>
              <button
                onClick={resetGame}
                className="text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 transition-colors px-4 py-2 rounded-full shadow-md"
                id="btn-balloon-reset"
              >
                Pop Balloons Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recente Word Drops */}
      <div className="mt-3 flex gap-1.5 flex-wrap justify-center min-h-[24px] z-10">
        <AnimatePresence>
          {revealedWords.map((word, idx) => (
            <motion.span
              key={word + idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-bold bg-pink-100 text-pink-900 px-2.5 py-0.5 rounded-full border border-pink-200 shadow-2xs flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-pink-500" />
              {word}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
