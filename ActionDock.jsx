import React, { useState } from 'react';
import { soundFx } from '../audio/soundEffects';
import {
  Utensils,
  Droplets,
  Gamepad2,
  Moon,
  Sun,
  ShoppingBag,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Music,
} from 'lucide-react';
export const ActionDock = ({
  isSleeping,
  onFeedClick,
  onWashClick,
  onPlayClick,
  onDanceClick,
  onToggleSleep,
  onShopClick,
  onMarkdownClick,
  onPetClick,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl sm:max-w-3xl px-2 sm:px-4 pointer-events-none">
      <div className="flex flex-col items-center">
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => {
            soundFx.playBeep();
            setCollapsed(!collapsed);
          }}
          className="pointer-events-auto mb-2 px-3.5 py-1 rounded-full bg-slate-900/85 hover:bg-slate-900 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-700/80 shadow-md backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {collapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Buka Menu Aksi</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Sembunyikan Menu (Mode Pemandangan)</span>
            </>
          )}
        </button>

        {/* Action Buttons Drawer */}
        <div
          className={`pointer-events-auto w-full transition-all duration-300 ease-out transform ${
            collapsed ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
          }`}
        >
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-2 sm:p-3 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* 1. Beri Makan */}
              <button
                onClick={() => {
                  soundFx.playBeep();
                  onFeedClick();
                }}
                className="btn-tactile flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-heading font-extrabold transition-all group"
                title="Beri Makan Cemilan Lezat (Tombol 1)"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/30 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Utensils className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-950" />
                </div>
                <span className="text-[9px] sm:text-xs tracking-tight">Makan</span>
              </button>

              {/* 2. Mandikan */}
              <button
                onClick={() => {
                  onWashClick();
                }}
                className="btn-tactile flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-2xl bg-gradient-to-b from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-white font-heading font-extrabold transition-all group"
                title="Mandikan & Bersihkan Busa Sabun (Tombol 2)"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Droplets className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-[9px] sm:text-xs tracking-tight">Mandi</span>
              </button>

              {/* 3. Bermain Mini-Game */}
              <button
                onClick={() => {
                  soundFx.playBeep();
                  onPlayClick();
                }}
                className="btn-tactile flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-white font-heading font-extrabold transition-all group"
                title="Bermain Mini-Game & Raih Koin (Tombol 3)"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-[9px] sm:text-xs tracking-tight">Main</span>
              </button>

              {/* 4. Panggung Joget */}
              <button
                onClick={() => {
                  soundFx.playBeep();
                  onDanceClick();
                }}
                className="btn-tactile flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-2xl bg-gradient-to-b from-pink-400 to-rose-500 hover:from-pink-300 hover:to-rose-400 text-white font-heading font-extrabold transition-all group"
                title="Panggung Joget Hewan Peliharaan"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/25 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Music className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-[9px] sm:text-xs tracking-tight">Joget</span>
              </button>

              {/* 4. Tidur / Bangun */}
              <button
                onClick={() => {
                  onToggleSleep();
                }}
                className={`btn-tactile flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl font-heading font-extrabold transition-all group ${
                  isSleeping
                    ? 'bg-gradient-to-b from-yellow-400 to-amber-500 text-slate-950'
                    : 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white'
                }`}
                title={
                  isSleeping
                    ? 'Bangunkan Pet (Tombol 4)'
                    : 'Tidurkan Pet & Pulihkan Energi (Tombol 4)'
                }
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  {isSleeping ? (
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                  ) : (
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </div>
                <span className="text-[10px] sm:text-xs tracking-tight">
                  {isSleeping ? 'Bangun' : 'Tidur'}
                </span>
              </button>

              {/* 5. Toko & Aksesoris */}
              <button
                onClick={() => {
                  soundFx.playBeep();
                  onShopClick();
                }}
                className="btn-tactile flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-purple-400 to-purple-500 hover:from-purple-300 hover:to-purple-400 text-white font-heading font-extrabold transition-all group"
                title="Toko Topi & Cangkang Konsol (Tombol 5)"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-[10px] sm:text-xs tracking-tight">Toko</span>
              </button>

              {/* 6. Buku Panduan & Diary Markdown */}
              <button
                onClick={() => {
                  soundFx.playBeep();
                  onMarkdownClick();
                }}
                className="btn-tactile flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-white font-heading font-extrabold transition-all group"
                title="Buku Panduan, Catatan Harian & Prestasi (Tombol 6)"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-[10px] sm:text-xs tracking-tight">Jurnal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
