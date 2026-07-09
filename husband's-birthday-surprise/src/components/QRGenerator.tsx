import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Heart, Copy, Check, ExternalLink } from 'lucide-react';

interface QRGeneratorProps {
  url: string;
}

export default function QRGenerator({ url }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      url,
      {
        width: 256,
        margin: 2,
        color: {
          dark: '#4c0519', // rose-950
          light: '#fff1f2', // rose-50
        },
      },
      (err) => {
        if (err) {
          console.error(err);
          setError('Failed to generate QR code');
        }
      }
    );
  }, [url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="flex flex-col items-center bg-rose-50/50 p-6 rounded-3xl border border-rose-100 shadow-sm max-w-sm w-full mx-auto" id="qr-generator-container">
      <div className="relative p-4 bg-rose-100/50 rounded-2xl border border-rose-200/60 mb-4">
        <canvas ref={canvasRef} className="rounded-xl shadow-inner max-w-full" id="qr-canvas" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-50 p-2 rounded-full border border-rose-200 shadow-md flex items-center justify-center">
          <Heart className="w-5 h-5 text-rose-600 fill-rose-600 animate-pulse" />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      ) : (
        <div className="text-center">
          <span className="inline-block text-xs font-mono bg-rose-100 text-rose-900 px-3 py-1 rounded-full mb-3">
            Scan to Open Surprise
          </span>
          <p className="text-xs text-rose-800/80 mb-4 max-w-xs leading-relaxed">
            Scan this with your phone to open the special birthday surprise screen, or copy the direct link below!
          </p>
        </div>
      )}

      <div className="flex gap-2 w-full">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-rose-950 font-medium py-2.5 px-4 rounded-xl border border-rose-200 text-sm transition-all shadow-sm"
          id="btn-copy-link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-rose-700" />
              <span>Copy Link</span>
            </>
          )}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all shadow-md shadow-rose-600/10"
          id="btn-open-preview"
        >
          <span>Open</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
