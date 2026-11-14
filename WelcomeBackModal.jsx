import React from 'react';
import { soundFx } from '../audio/soundEffects';
import { Sparkles, Heart, Zap, Clock, ShieldCheck } from 'lucide-react';
export const WelcomeBackModal = ({ report, onClose }) => {
  const formatTimeAway = (mins) => {
    if (mins < 60) return `${mins} Menit`;
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours} Jam ${m > 0 ? `${m} Menit` : ''}`;
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-300 flex flex-col">
        {/* Banner */}
        <div className="px-5 py-5 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-white text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl mb-2 shadow-inner">
            🌅
          </div>
          <h3 className="font-heading font-extrabold text-xl">Selamat Datang Kembali!</h3>
          <p className="text-xs text-amber-100 mt-0.5">
            {report.petName} sangat senang kamu kembali!
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-slate-600 font-medium">Kamu bepergian selama:</span>
            <span className="font-heading font-bold text-slate-900 ml-auto">
              {formatTimeAway(report.minutesAway)}
            </span>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
            <p className="text-xs text-amber-900 font-medium italic">
              &ldquo;{report.notes}&rdquo;
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {report.coinsFound > 0 && (
              <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="text-[10px] text-amber-800 block">Koin Ditemukan:</span>
                  <span className="font-heading font-bold text-amber-900">
                    +{report.coinsFound} 🪙
                  </span>
                </div>
              </div>
            )}

            {report.energyRestored > 0 && (
              <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] text-emerald-800 block">Energi Pulih:</span>
                  <span className="font-heading font-bold text-emerald-900">
                    +{report.energyRestored}% ⚡
                  </span>
                </div>
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <div>
                <span className="text-[10px] text-rose-700 block">Perut Pet:</span>
                <span className="font-heading font-bold text-rose-800">Minta Makan 🍲</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <div>
                <span className="text-[10px] text-sky-700 block">Status Data:</span>
                <span className="font-heading font-bold text-sky-800">100% Aman</span>
              </div>
            </div>
          </div>

          {/* Reassurance badge */}
          <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Seluruh progres &amp; koin
            tersimpan otomatis offline.
          </div>

          <button
            onClick={() => {
              soundFx.playSelect();
              onClose();
            }}
            className="btn-tactile w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-heading font-bold rounded-2xl shadow-md text-sm"
          >
            Sapa &amp; Peluk {report.petName}! 🐾
          </button>
        </div>
      </div>
    </div>
  );
};
