import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Gift } from 'lucide-react';

interface Candle {
  id: number;
  x: number; // percentage from left
  isLit: boolean;
}

interface CandleBlowerProps {
  husbandName: string;
}

export default function CandleBlower({ husbandName }: CandleBlowerProps) {
  const [candles, setCandles] = useState<Candle[]>([
    { id: 1, x: 20, isLit: true },
    { id: 2, x: 35, isLit: true },
    { id: 3, x: 50, isLit: true },
    { id: 4, x: 65, isLit: true },
    { id: 5, x: 80, isLit: true },
  ]);
  const [celebrate, setCelebrate] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; left: number; delay: number; color: string; scale: number }[]>([]);

  useEffect(() => {
    const allBlownOut = candles.every((c) => !c.isLit);
    if (allBlownOut) {
      setCelebrate(true);
      // Generate custom romantic confetti
      const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#fbbf24'];
      const newConfetti = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: Math.random() * 0.8 + 0.4,
      }));
      setConfetti(newConfetti);
    } else {
      setCelebrate(false);
    }
  }, [candles]);

  const blowCandle = (id: number) => {
    setCandles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLit: false } : c))
    );
  };

  const relightAll = () => {
    setCandles((prev) => prev.map((c) => ({ ...c, isLit: true })));
    setCelebrate(false);
    setConfetti([]);
  };

  return (
    <div className="flex flex-col items-center bg-white border-4 border-white p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-xl relative overflow-hidden" id="candle-blower-section">
      {/* Floating Heart Confetti on Win */}
      <AnimatePresence>
        {celebrate && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden bg-pink-500/10">
            {confetti.map((dot) => (
              <motion.div
                key={dot.id}
                initial={{ top: '-10%', left: `${dot.left}%`, opacity: 0, rotate: 0 }}
                animate={{
                  top: '110%',
                  opacity: [0, 1, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 2.5 + Math.random() * 1.5,
                  delay: dot.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute"
                style={{ scale: dot.scale }}
              >
                <Heart className="w-5 h-5 fill-current" style={{ color: dot.color }} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl font-black text-pink-600 mb-1 flex items-center justify-center gap-1.5 uppercase tracking-wide">
          <Gift className="w-5 h-5 text-pink-500 animate-bounce" />
          Make a Wish, Blow the Candles!
        </h3>
        <p className="text-pink-950 font-medium text-xs">
          {celebrate
            ? 'Yay! Your wish is on its way!'
            : 'Click on each candle flame to blow it out and unlock your surprise message.'}
        </p>
      </div>

      {/* Interactive Birthday Cake Graphic */}
      <div className="relative w-64 h-64 flex items-end justify-center mb-4 select-none">
        
        {/* Cake Stand */}
        <div className="absolute bottom-0 w-60 h-4 bg-stone-200 border border-stone-300 rounded-full z-10" />

        {/* Cake Base Tier */}
        <div className="absolute bottom-4 w-52 h-20 bg-rose-100 rounded-t-2xl border-x border-t border-rose-200 shadow-sm z-20 flex flex-col justify-between overflow-hidden">
          {/* Vanilla dripping decoration */}
          <div className="w-full h-5 bg-pink-200/80 rounded-b-lg flex gap-1 justify-around">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-4 h-6 bg-pink-200/80 rounded-b-full shadow-inner" />
            ))}
          </div>
          {/* Strawberries / sprinkles */}
          <div className="flex justify-around items-center px-4 pb-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-rose-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Cake Top Tier */}
        <div className="absolute bottom-24 w-40 h-16 bg-pink-50 rounded-t-2xl border-x border-t border-rose-100/80 shadow-sm z-30 flex flex-col justify-between overflow-hidden">
          {/* Icing drip */}
          <div className="w-full h-4 bg-white rounded-b-lg flex gap-1 justify-around">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-3 h-5 bg-white rounded-b-full" />
            ))}
          </div>
          {/* Sprinkles on top tier */}
          <div className="flex justify-center gap-3 pb-3">
            <span className="text-pink-500">♥</span>
            <span className="text-amber-400 font-bold">★</span>
            <span className="text-pink-500">♥</span>
          </div>
        </div>

        {/* Candles Container */}
        <div className="absolute bottom-40 w-40 h-20 z-40 flex justify-between px-4">
          {candles.map((candle) => (
            <div
              key={candle.id}
              className="relative flex flex-col items-center justify-end h-full w-4"
              style={{ left: `${candle.x - 20}%` }}
            >
              {/* Flame */}
              <AnimatePresence>
                {candle.isLit ? (
                  <motion.button
                    onClick={() => blowCandle(candle.id)}
                    whileHover={{ scale: 1.2 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute bottom-11 w-3 h-6 bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 rounded-full cursor-pointer animate-pulse flex items-center justify-center focus:outline-none"
                    title="Blow out candle"
                    id={`candle-flame-${candle.id}`}
                  >
                    <div className="w-1.5 h-3 bg-yellow-100 rounded-full animate-ping opacity-60" />
                  </motion.button>
                ) : (
                  <div className="absolute bottom-11 text-stone-400 text-xs animate-bounce pointer-events-none">
                    💨
                  </div>
                )}
              </AnimatePresence>

              {/* Candle Body */}
              <div className="w-2.5 h-12 bg-gradient-to-b from-teal-200 to-teal-400 rounded-sm border-x border-t border-teal-500/30 flex flex-col justify-between">
                {/* Spirals */}
                <div className="w-full h-1.5 bg-teal-300 transform rotate-12" />
                <div className="w-full h-1.5 bg-teal-300 transform rotate-12" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Celebration box / action */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-col items-center bg-pink-50 border border-pink-100 p-5 rounded-[2rem] w-full text-center z-20 shadow-inner"
            id="surprise-letter-unlock-card"
          >
            <Sparkles className="w-6 h-6 text-pink-500 fill-pink-100 mb-2 animate-spin" />
            <h4 className="font-serif text-xl font-bold text-pink-950 mb-1">
              Happy Birthday, {husbandName}! 🎉
            </h4>
            <p className="text-xs text-pink-900/90 font-medium leading-relaxed mb-4 max-w-sm">
              "To the person who holds my heart, who fills every day with love and laughter. May this birthday bring you as much endless joy as you have brought into my life. I love you to the moon and back!"
            </p>
            <button
              onClick={relightAll}
              className="text-xs font-bold uppercase tracking-wider text-pink-700 bg-white hover:bg-pink-100/60 transition-colors px-4 py-2 rounded-full border border-pink-200 shadow-sm"
              id="btn-relight-candles"
            >
              Blow Candles Again 🎂
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
