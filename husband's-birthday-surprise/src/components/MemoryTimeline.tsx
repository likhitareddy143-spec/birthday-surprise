import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Heart, Camera, MapPin, Trash2 } from 'lucide-react';
import { MemoryItem } from '../types';

interface MemoryTimelineProps {
  memories: MemoryItem[];
  onDeleteMemory?: (id: string) => void;
  isCustomizable?: boolean;
}

export default function MemoryTimeline({ memories, onDeleteMemory, isCustomizable = false }: MemoryTimelineProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'gallery'>('timeline');

  return (
    <div className="w-full flex flex-col gap-6" id="memory-timeline-section">
      {/* View Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex bg-pink-100/50 p-1 rounded-xl border border-pink-200">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'timeline'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-pink-800 hover:text-pink-950'
            }`}
            id="tab-view-timeline"
          >
            Our Story Timeline
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'gallery'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-pink-800 hover:text-pink-950'
            }`}
            id="tab-view-gallery"
          >
            Polaroid Gallery
          </button>
        </div>
      </div>

      {activeTab === 'timeline' ? (
        /* Vertical Elegant Timeline */
        <div className="relative border-l-2 border-pink-200 ml-4 md:ml-32 pl-6 md:pl-10 py-4 flex flex-col gap-10">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
              id={`timeline-item-${memory.id}`}
            >
              {/* Dot indicator */}
              <div className="absolute -left-[32px] md:-left-[48px] top-1 bg-pink-500 text-white p-1 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10">
                <Heart className="w-3 h-3 fill-current" />
              </div>

              {/* Date Label on Left for Desktop */}
              <div className="hidden md:block absolute -left-36 top-1.5 w-28 text-right pr-4 select-none">
                <span className="font-mono text-xs font-bold text-pink-700/90 uppercase tracking-wider">
                  {memory.date}
                </span>
              </div>

              {/* Card Body */}
              <div className="bg-white rounded-3xl border-2 border-pink-100 shadow-md hover:shadow-xl transition-all p-5 max-w-2xl flex flex-col md:flex-row gap-5 relative group">
                {memory.image && (
                  <div className="w-full md:w-44 h-32 md:h-28 rounded-2xl overflow-hidden bg-pink-50 flex-shrink-0 relative">
                    <img
                      src={memory.image}
                      alt={memory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1 rounded-lg border border-pink-100 shadow-2xs">
                      <Camera className="w-3.5 h-3.5 text-pink-600" />
                    </div>
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="md:hidden inline-flex items-center gap-1 font-mono text-[10px] font-bold text-pink-700 uppercase tracking-wider mb-1.5 bg-pink-50 px-2.5 py-0.5 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {memory.date}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-stone-900 leading-snug group-hover:text-pink-950 transition-colors">
                      {memory.title}
                    </h4>
                    <p className="text-stone-500 text-xs leading-relaxed mt-1.5">
                      {memory.description}
                    </p>
                  </div>

                  {isCustomizable && onDeleteMemory && (
                    <button
                      onClick={() => onDeleteMemory(memory.id)}
                      className="absolute top-4 right-4 md:relative md:top-auto md:right-auto md:self-end mt-3 text-stone-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Memory"
                      id={`btn-delete-memory-${memory.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Polaroid Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, scale: 0.95, rotate: (index % 2 === 0 ? -1.5 : 1.5) }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
              viewport={{ once: true }}
              className="bg-white p-4 pb-6 rounded-xl border-4 border-white shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between h-80 relative group"
              id={`polaroid-${memory.id}`}
            >
              {/* Image box */}
              <div className="w-full h-48 bg-pink-50/50 rounded-xs overflow-hidden relative border border-pink-100">
                {memory.image ? (
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-pink-300">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
                {/* Heart overlay */}
                <div className="absolute inset-0 bg-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white fill-white/80 animate-ping" />
                </div>
              </div>

              {/* Polaroid Bottom Label */}
              <div className="mt-4 text-center px-1">
                <h5 className="font-serif text-sm font-bold text-stone-850 leading-snug line-clamp-1">
                  {memory.title}
                </h5>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-pink-700 font-bold mt-1 font-mono uppercase tracking-wide">
                  <Calendar className="w-3 h-3 text-pink-500" />
                  <span>{memory.date}</span>
                </div>
              </div>

              {isCustomizable && onDeleteMemory && (
                <button
                  onClick={() => onDeleteMemory(memory.id)}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur text-stone-400 hover:text-red-500 p-1 rounded-full border border-stone-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Memory"
                  id={`btn-delete-polaroid-${memory.id}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
