/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Calendar, 
  Gift, 
  Camera, 
  Settings, 
  Send, 
  QrCode, 
  PartyPopper, 
  Plus, 
  User, 
  RotateCcw,
  BookOpen,
  ChevronRight
} from 'lucide-react';

import { SurpriseConfig, MemoryItem } from './types';
import QRGenerator from './components/QRGenerator';
import ScratchCard from './components/ScratchCard';
import CandleBlower from './components/CandleBlower';
import BalloonPopper from './components/BalloonPopper';
import MemoryTimeline from './components/MemoryTimeline';
import AudioPlayer from './components/AudioPlayer';

// Import default generated memory illustrations
// @ts-ignore
import cozyCouple from './assets/images/cozy_couple_illustration_1783589555444.jpg';
// @ts-ignore
import sunsetCouple from './assets/images/couple_sunset_view_1783589571528.jpg';
// @ts-ignore
import stargazingCouple from './assets/images/couple_stargazing_1783589585882.jpg';

const DEFAULT_CONFIG: SurpriseConfig = {
  husbandName: 'My Sweet Husband',
  wifeName: 'Likhita',
  anniversaryDate: '2022-10-24',
  customLetter: `To my amazing partner in life,\n\nHappy Birthday! Today is all about celebrating the wonderful person you are. From our late-night talks to our quiet morning coffees, every moment with you is a gift.\n\nYou inspire me with your kindness, your laughter, and your beautiful heart. Thank you for being my rock, my safe place, and my greatest adventure.\n\nI wish you a year ahead filled with laughter, dreams fulfilled, and endless love. I am so blessed to walk this beautiful path of life beside you.\n\nAlways and forever yours,\nLikhita`,
  loveReasons: [
    'How safe and cherished I feel when you hold my hand.',
    'Your beautiful laughter that brightens up my darkest days.',
    'The endless kindness and patience you show to everyone around you.',
    'How you support my dreams and believe in me, even when I forget to.'
  ],
  memories: [
    {
      id: 'default-1',
      title: 'Our Cozy Coffee Dates',
      date: 'Autumn Afternoon',
      description: 'Losing track of time in our favorite little cafe, sharing laughs, warm coffee, and whispering sweet plans for the future.',
      image: cozyCouple,
      isDefault: true
    },
    {
      id: 'default-2',
      title: 'Chasing Sunsets Together',
      date: 'Summer Escape',
      description: 'Standing side by side as the sky turned to gold, holding hands and realizing that being together is my absolute favorite place to be.',
      image: sunsetCouple,
      isDefault: true
    },
    {
      id: 'default-3',
      title: 'Stargazing in Each Other’s Arms',
      date: 'Midnight Magic',
      description: 'Counting constellations on a cool evening, covered in blankets, talking about the vastness of the universe and the beauty of our love.',
      image: stargazingCouple,
      isDefault: true
    }
  ]
};

export default function App() {
  const [config, setConfig] = useState<SurpriseConfig>(DEFAULT_CONFIG);
  const [isHusbandView, setIsHusbandView] = useState(false);
  const [newMemoryTitle, setNewMemoryTitle] = useState('');
  const [newMemoryDate, setNewMemoryDate] = useState('');
  const [newMemoryDesc, setNewMemoryDesc] = useState('');
  const [newMemoryImage, setNewMemoryImage] = useState<string>('');
  
  // Customization active sub-tabs
  const [activeConfigTab, setActiveConfigTab] = useState<'general' | 'memories' | 'scratch'>('general');

  // Load configuration from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('birthday_surprise_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure missing properties are filled
        setConfig({
          ...DEFAULT_CONFIG,
          ...parsed,
          // Retain default images if needed, convert loaded base64 memories correctly
          memories: parsed.memories && parsed.memories.length > 0 
            ? parsed.memories.map((m: any) => {
                if (m.isDefault) {
                  const matchedDefault = DEFAULT_CONFIG.memories.find(dm => dm.id === m.id);
                  return matchedDefault ? { ...m, image: matchedDefault.image } : m;
                }
                return m;
              })
            : DEFAULT_CONFIG.memories
        });
      } catch (e) {
        console.error('Failed to parse saved config', e);
      }
    }

    // Check query params for instant unlock/husband view
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlock') === 'true') {
      setIsHusbandView(true);
    }
  }, []);

  // Save config helper
  const saveConfig = (newConfig: SurpriseConfig) => {
    setConfig(newConfig);
    // Strip default image data references before saving to stay lightweight
    const simplifiedMemories = newConfig.memories.map(m => m.isDefault ? { ...m, image: '' } : m);
    localStorage.setItem(
      'birthday_surprise_config', 
      JSON.stringify({ ...newConfig, memories: simplifiedMemories })
    );
  };

  // Reset to default
  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset everything back to the original default setup?')) {
      setConfig(DEFAULT_CONFIG);
      localStorage.removeItem('birthday_surprise_config');
    }
  };

  // Handle local photo uploads
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setNewMemoryImage(uploadEvent.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add memory memory timeline
  const handleAddMemory = (e: FormEvent) => {
    e.preventDefault();
    if (!newMemoryTitle || !newMemoryDate || !newMemoryDesc) {
      alert('Please fill out all memory fields!');
      return;
    }

    const newItem: MemoryItem = {
      id: 'custom-' + Date.now(),
      title: newMemoryTitle,
      date: newMemoryDate,
      description: newMemoryDesc,
      image: newMemoryImage || ''
    };

    const updated = {
      ...config,
      memories: [newItem, ...config.memories]
    };

    saveConfig(updated);
    
    // Reset fields
    setNewMemoryTitle('');
    setNewMemoryDate('');
    setNewMemoryDesc('');
    setNewMemoryImage('');
  };

  // Delete memory
  const handleDeleteMemory = (id: string) => {
    const updatedMemories = config.memories.filter(m => m.id !== id);
    saveConfig({ ...config, memories: updatedMemories });
  };

  // Update reason scratch off text
  const handleUpdateReason = (index: number, val: string) => {
    const updatedReasons = [...config.loveReasons];
    updatedReasons[index] = val;
    saveConfig({ ...config, loveReasons: updatedReasons });
  };

  // Dynamic QR Code link builder
  const getSurpriseURL = () => {
    return `${window.location.origin}${window.location.pathname}?unlock=true`;
  };

  return (
    <div className="min-h-screen bg-pink-50 text-stone-850 font-sans antialiased selection:bg-pink-200" id="main-application-container">
      
      {/* Floating Love Audio Player & Brand Badge (Sticky header) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-pink-500 text-white p-1.5 rounded-full shadow-inner animate-pulse">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <span className="font-serif font-bold text-stone-900 text-sm md:text-base">
            {isHusbandView ? `Surprise for ${config.husbandName}` : "Surprise Builder Suite"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Background Audio bells toggle */}
          {isHusbandView && <AudioPlayer />}

          <button
            onClick={() => {
              if (isHusbandView) {
                // Return to setup
                setIsHusbandView(false);
                // Clean URL params to keep standard editor interface clean
                window.history.pushState({}, '', window.location.pathname);
              } else {
                // Enter live preview
                setIsHusbandView(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isHusbandView
                ? 'bg-pink-100 hover:bg-pink-200 text-pink-950 border border-pink-200'
                : 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/10'
            }`}
            id="btn-view-toggle"
          >
            {isHusbandView ? (
              <>
                <Settings className="w-3.5 h-3.5" />
                <span>Return to Editor</span>
              </>
            ) : (
              <>
                <PartyPopper className="w-3.5 h-3.5" />
                <span>Launch Preview</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <AnimatePresence mode="wait">
          {!isHusbandView ? (
            /* ========================================== */
            /* WIFE SETUP / CONFIGURATION SUITE           */
            /* ========================================== */
            <motion.div
              key="editor-suite"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              id="editor-suite-grid"
            >
              
              {/* LEFT & CENTER: CUSTOMIZATION CONTROLS */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                                {/* Intro welcome card */}
                <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex flex-col md:flex-row gap-5 items-center">
                  <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 flex-shrink-0 text-pink-500">
                    <Gift className="w-8 h-8 fill-pink-100 animate-bounce" />
                  </div>
                  <div>
                    <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                      Create a Romantic Surprise Website for Your Husband!
                    </h1>
                    <p className="text-stone-500 text-xs mt-1.5 leading-relaxed">
                      Customise his name, upload your photos, write a heart-warming love letter, and add interactive games like balloon-popping and canvas scratch cards. Once ready, print or display the **Surprise QR Code** for him to scan!
                    </p>
                  </div>
                </div>

                {/* Sub-tab navigation */}
                <div className="flex border-b border-pink-100 gap-6 text-sm font-semibold">
                  <button
                    onClick={() => setActiveConfigTab('general')}
                    className={`pb-3 relative transition-all ${
                      activeConfigTab === 'general'
                        ? 'text-pink-600 font-bold'
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                    id="tab-config-general"
                  >
                    1. General Info
                    {activeConfigTab === 'general' && (
                      <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-pink-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveConfigTab('memories')}
                    className={`pb-3 relative transition-all ${
                      activeConfigTab === 'memories'
                        ? 'text-pink-600 font-bold'
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                    id="tab-config-memories"
                  >
                    2. Memories & Photo Album
                    {activeConfigTab === 'memories' && (
                      <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-pink-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveConfigTab('scratch')}
                    className={`pb-3 relative transition-all ${
                      activeConfigTab === 'scratch'
                        ? 'text-pink-600 font-bold'
                        : 'text-stone-400 hover:text-stone-700'
                    }`}
                    id="tab-config-scratch"
                  >
                    3. Scratch Cards
                    {activeConfigTab === 'scratch' && (
                      <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-pink-500" />
                    )}
                  </button>
                </div>

                {/* Sub-tab: General Config */}
                {activeConfigTab === 'general' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm flex flex-col gap-5"
                    id="config-general-panel"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider mb-1.5 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-pink-500" />
                          Husband's Name / Pet Name
                        </label>
                        <input
                          type="text"
                          value={config.husbandName}
                          onChange={(e) => saveConfig({ ...config, husbandName: e.target.value })}
                          className="w-full bg-pink-50/30 border border-pink-100 hover:border-pink-200 focus:border-pink-400 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all outline-none"
                          placeholder="e.g. My Dear Husband, Sunny, etc."
                          id="input-husband-name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-pink-500" />
                          Your Name (Wife)
                        </label>
                        <input
                          type="text"
                          value={config.wifeName}
                          onChange={(e) => saveConfig({ ...config, wifeName: e.target.value })}
                          className="w-full bg-pink-50/30 border border-pink-100 hover:border-pink-200 focus:border-pink-400 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all outline-none"
                          placeholder="Likhita"
                          id="input-wife-name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-500" />
                        Anniversary or Special Relationship Date
                      </label>
                      <input
                        type="date"
                        value={config.anniversaryDate}
                        onChange={(e) => saveConfig({ ...config, anniversaryDate: e.target.value })}
                        className="w-full bg-pink-50/30 border border-pink-100 hover:border-pink-200 focus:border-pink-400 focus:bg-white rounded-xl px-4 py-2.5 text-sm transition-all outline-none"
                        id="input-anniversary-date"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 tracking-wider mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-pink-500" />
                        Your Secret Birthday Letter
                      </label>
                      <textarea
                        value={config.customLetter}
                        onChange={(e) => saveConfig({ ...config, customLetter: e.target.value })}
                        rows={7}
                        className="w-full bg-pink-50/30 border border-pink-100 hover:border-pink-200 focus:border-pink-400 focus:bg-white rounded-xl p-4 text-sm transition-all outline-none font-sans leading-relaxed resize-none"
                        placeholder="Write a sweet love letter to him..."
                        id="input-love-letter"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Sub-tab: Memories & Photo Upload */}
                {activeConfigTab === 'memories' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                    id="config-memories-panel"
                  >
                    {/* Add new memory form */}
                    <form onSubmit={handleAddMemory} className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm flex flex-col gap-4">
                      <div className="flex items-center gap-2 border-b border-pink-100 pb-3">
                        <Camera className="w-5 h-5 text-pink-500" />
                        <h3 className="font-serif font-bold text-stone-900">Add a New Photo & Memory</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">Memory Title</label>
                          <input
                            type="text"
                            value={newMemoryTitle}
                            onChange={(e) => setNewMemoryTitle(e.target.value)}
                            className="w-full bg-pink-50/30 border border-pink-100 hover:border-pink-200 focus:border-pink-400 focus:bg-white rounded-xl px-4 py-2 text-xs outline-none transition-all"
                            placeholder="e.g. Our First Trip Together"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1">When / Where</label>
                          <input
                            type="text"
                            value={newMemoryDate}
                            onChange={(e) => setNewMemoryDate(e.target.value)}
                            className="w-full bg-pink-50/30 border border-pink-100 hover:border-pink-200 focus:border-pink-400 focus:bg-white rounded-xl px-4 py-2 text-xs outline-none transition-all"
                            placeholder="e.g. Paris - May 2024"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1">Brief Description</label>
                        <textarea
                          value={newMemoryDesc}
                          onChange={(e) => setNewMemoryDesc(e.target.value)}
                          rows={2}
                          className="w-full bg-pink-50/30 border border-pink-100 hover:border-pink-200 focus:border-pink-400 focus:bg-white rounded-xl p-3 text-xs outline-none transition-all resize-none"
                          placeholder="Describe this sweet moment in 1 or 2 lines..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-500 mb-1">Select Photo</label>
                        <div className="flex items-center gap-4">
                          <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 hover:border-rose-300 rounded-xl p-4 cursor-pointer transition-colors bg-stone-50 hover:bg-rose-50/20">
                            <Plus className="w-5 h-5 text-stone-400 mb-1" />
                            <span className="text-xs font-medium text-stone-600">Choose custom image file...</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>
                          {newMemoryImage && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                              <img src={newMemoryImage} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-stone-900 hover:bg-stone-850 text-white font-semibold py-2 rounded-xl text-xs transition-colors mt-2"
                      >
                        Add to Memory Album
                      </button>
                    </form>

                    {/* Timeline Preview */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm">
                      <h3 className="font-serif font-bold text-stone-950 mb-4 flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
                        Current Album Preview ({config.memories.length})
                      </h3>
                      <MemoryTimeline 
                        memories={config.memories} 
                        onDeleteMemory={handleDeleteMemory} 
                        isCustomizable={true}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Sub-tab: Love Reasons (Scratch Cards) */}
                {activeConfigTab === 'scratch' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm flex flex-col gap-5"
                    id="config-scratch-panel"
                  >
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 mb-1">Our Scratch-off Love Notes</h3>
                      <p className="text-stone-500 text-xs leading-relaxed">
                        Edit the sweet reasons why you love your husband. On his surprise screen, these reasons will be covered in silver scratch-off coatings, waiting for him to scratch them away!
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      {config.loveReasons.map((reason, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 font-bold flex items-center justify-center text-xs border border-rose-100/60">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={reason}
                            onChange={(e) => handleUpdateReason(idx, e.target.value)}
                            className="flex-1 bg-stone-50 border border-stone-200 hover:border-stone-300 focus:border-rose-300 focus:bg-white rounded-xl px-4 py-2 text-xs outline-none transition-all"
                            placeholder={`Love reason #${idx + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Factory Reset controls */}
                <div className="flex justify-start">
                  <button
                    onClick={resetToDefault}
                    className="flex items-center gap-1 text-[11px] font-medium text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Default Blueprint Setup
                  </button>
                </div>

              </div>

              {/* RIGHT: SURPRISE LAUNCHER & QR CODE DISPLAY */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                
                {/* QR Code Presentation Box */}
                <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm flex flex-col items-center text-center">
                  <QrCode className="w-8 h-8 text-rose-600 mb-2 animate-pulse" />
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                    Scan or Share the Surprise!
                  </h3>
                  <p className="text-stone-500 text-xs mb-6 leading-relaxed max-w-xs">
                    Your changes save automatically inside this browser's state. Scan this QR code with his phone to reveal his birthday wish portal!
                  </p>

                  {/* QR Code component */}
                  <QRGenerator url={getSurpriseURL()} />
                </div>

                {/* Live Preview Prompt Card */}
                <div className="bg-gradient-to-br from-rose-900 to-rose-950 text-rose-50 p-6 rounded-3xl border border-rose-900 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
                  <Heart className="w-8 h-8 text-rose-400 fill-rose-500/20 mb-3" />
                  <h4 className="font-serif text-base font-bold text-white mb-2 leading-snug">
                    Want to see what he will see?
                  </h4>
                  <p className="text-rose-200/90 text-xs leading-relaxed mb-4">
                    Take a look at the live birthday portal now! Check the interactive candles, memory timeline, scratch cards, and beautiful layout.
                  </p>
                  <button
                    onClick={() => setIsHusbandView(true)}
                    className="inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                    id="btn-preview-bottom"
                  >
                    <span>Test Husband's View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </motion.div>
          ) : (
            /* ========================================== */
            /* HUSBAND PORTAL / THE BIRTHDAY SURPRISE     */
            /* ========================================== */
            <motion.div
              key="husband-portal"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col gap-10 max-w-4xl mx-auto pb-12 animate-fade-in"
              id="husband-portal-wrapper"
            >
              
              {/* Grand romantic display cover */}
              <div className="text-center relative py-12 px-4 select-none">
                {/* Floating hearts particles */}
                <div className="absolute inset-0 pointer-events-none flex justify-center items-center overflow-hidden">
                  <span className="text-pink-500/15 text-9xl absolute -top-10 -left-10 transform -rotate-12 select-none">♥</span>
                  <span className="text-pink-500/15 text-9xl absolute -bottom-10 -right-10 transform rotate-12 select-none">♥</span>
                </div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center bg-white border-4 border-pink-200 text-pink-600 p-4 rounded-full mb-6 shadow-md"
                >
                  <Heart className="w-10 h-10 fill-pink-500 text-pink-500 animate-pulse" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-serif text-5xl sm:text-7xl font-black text-pink-500 tracking-tight leading-none mb-4 uppercase"
                >
                  HAPPY <span className="text-rose-600">BIRTHDAY</span>, MY LOVE!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-pink-950 font-semibold max-w-xl mx-auto text-xs sm:text-sm leading-relaxed"
                >
                  A special, interactive wish portal crafted with love by <strong className="text-pink-600">{config.wifeName}</strong> just for you. Blow the candles, pop the balloons, scratch the cards, and travel back in memory lane!
                </motion.p>
              </div>

              {/* SECTION: CANDLE BLOWER CAKE */}
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
                id="husband-section-candles"
              >
                <CandleBlower husbandName={config.husbandName} />
              </motion.section>

              {/* GRID: INTERACTIVE WIDGETS (BALLOONS & SCRATCH CARDS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="husband-widgets-grid">
                
                {/* COLUMN 1: SCRATCH-OFF LOVE REASONS */}
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border-4 border-white shadow-xl flex flex-col gap-5"
                  id="husband-section-scratch"
                >
                  <div className="border-b border-pink-100 pb-3 flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-pink-500" />
                    <h3 className="font-serif text-xl font-black text-pink-600 uppercase tracking-wide">
                      Why I Love You
                    </h3>
                  </div>
                  <p className="text-pink-950 font-medium text-xs leading-relaxed mb-1">
                    Drag your finger or mouse over the cards below to reveal sweet personalized reminders of why you are so loved.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {config.loveReasons.map((reason, idx) => (
                      // @ts-ignore
                      <ScratchCard key={idx} index={idx} text={reason} />
                    ))}
                  </div>
                </motion.section>

                {/* COLUMN 2: BALLOON POPPING GAME */}
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  id="husband-section-balloons"
                >
                  <BalloonPopper />
                </motion.section>

              </div>

              {/* SECTION: HEARTWARMING LETTER */}
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-[2.5rem] md:rounded-[3rem] border-4 border-white shadow-xl p-8 sm:p-12 relative"
                id="husband-section-letter"
              >
                {/* Decorative post stamp / background details */}
                <div className="absolute top-6 right-6 w-16 h-16 border-2 border-dashed border-pink-200 rounded-lg flex items-center justify-center transform rotate-6 select-none opacity-40">
                  <Heart className="w-8 h-8 text-pink-500 fill-pink-500/10" />
                </div>

                <div className="max-w-2xl mx-auto flex flex-col gap-6">
                  <div className="flex justify-center mb-2">
                    <span className="inline-block px-4 py-1 bg-pink-50 text-pink-700 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest border border-pink-100">
                      A Letter For You
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl font-black text-pink-600 text-center uppercase tracking-wide">
                    My Dear Husband,
                  </h3>

                  {/* Letter content text */}
                  <div className="text-stone-850 text-sm md:text-base leading-relaxed font-serif whitespace-pre-line border-t border-pink-100 pt-6">
                    {config.customLetter}
                  </div>

                  <div className="flex flex-col items-center text-center mt-6 border-t border-pink-100 pt-6 select-none">
                    <p className="text-pink-900/60 text-[10px] font-mono tracking-wider uppercase mb-1">
                      Forever holding your hand,
                    </p>
                    <p className="font-serif text-2xl font-black text-pink-600">
                      {config.wifeName} ♥
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* SECTION: PHOTOLINE OF MEMORIES */}
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-4 border-white shadow-xl"
                id="husband-section-timeline"
              >
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl font-black text-pink-600 flex items-center justify-center gap-1.5 uppercase tracking-wide">
                    <Camera className="w-5.5 h-5.5 text-pink-500" />
                    Memory Lane
                  </h3>
                  <p className="text-pink-950 font-medium text-xs mt-1">
                    Flip through some of our most beautiful, magical moments together.
                  </p>
                </div>

                <MemoryTimeline memories={config.memories} isCustomizable={false} />
              </motion.section>

              {/* Sweet closing signature card */}
              <div className="text-center mt-6 select-none">
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500/20 mx-auto animate-pulse mb-2" />
                <p className="text-[10px] font-mono tracking-widest text-pink-400 uppercase">
                  Made with love • 2026 Birthday Celebration
                </p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
