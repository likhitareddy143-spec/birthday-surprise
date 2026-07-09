import { useEffect, useRef, useState, MouseEvent, TouchEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface ScratchCardProps {
  text: string;
  index: number;
}

export default function ScratchCard({ text, index }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get exact bounding size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 280;
    canvas.height = rect.height || 140;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create silver gradient for scratch layer
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#d1d5db'); // gray-300
    gradient.addColorStop(0.5, '#9ca3af'); // gray-400
    gradient.addColorStop(1, '#6b7280'); // gray-500
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some glitter speckles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 60; i++) {
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1.5,
        1.5
      );
    }

    // Add text overlay on the scratch layer
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#db2777'; // vibrant pink
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch to Reveal Reason #' + (index + 1), canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#4b5563'; // gray-600
    ctx.fillText('✨ Drag your mouse or finger ✨', canvas.width / 2, canvas.height / 2 + 15);

    setIsScratched(false);
    setScratchedPercent(0);
  };

  useEffect(() => {
    // Small timeout to allow element sizes to stabilize in DOM
    const timer = setTimeout(() => {
      initCanvas();
    }, 100);

    // Resize observer to handle canvas resizing
    const resizeObserver = new ResizeObserver(() => {
      initCanvas();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [text, index]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Debounced check for scratched percentage
    checkScratchedPercent();
  };

  const checkScratchedPercent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 4;
    const percent = Math.round((transparentPixels / totalPixels) * 100);
    setScratchedPercent(percent);

    if (percent > 45 && !isScratched) {
      setIsScratched(true);
      // Fade out the rest of the canvas cover
      const fadeInterval = setInterval(() => {
        if (!canvas) {
          clearInterval(fadeInterval);
          return;
        }
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }, 50);
      setTimeout(() => clearInterval(fadeInterval), 500);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDrawing(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUpOrLeave = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setIsDrawing(true);
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDrawing) return;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-36 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-4 flex flex-col justify-center items-center text-center overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      id={`scratch-card-${index}`}
    >
      {/* Background content (revealed message) */}
      <div className="w-full h-full flex flex-col justify-center items-center px-2 z-0">
        <Sparkles className="w-5 h-5 text-pink-500 fill-pink-100 mb-1.5 animate-bounce" />
        <p className="text-pink-950 font-bold font-serif leading-relaxed text-sm max-w-[240px]">
          {text}
        </p>
      </div>

      {/* Canvas scratch layer */}
      <AnimatePresence>
        {!isScratched && (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            className="absolute inset-0 w-full h-full rounded-2xl cursor-pointer z-10 touch-none transition-opacity duration-300"
            style={{ imageRendering: 'auto' }}
          />
        )}
      </AnimatePresence>

      {/* Scratched indicator reset button */}
      {isScratched && (
        <button
          onClick={initCanvas}
          className="absolute top-2 right-2 text-pink-500 hover:text-pink-700 p-1 bg-white/80 backdrop-blur rounded-full shadow-sm border border-pink-100 transition-colors z-20"
          title="Reset scratch card"
          id={`btn-reset-scratch-${index}`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
