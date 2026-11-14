import React from 'react';
import { soundFx } from '../audio/soundEffects';
import { RotateCcw, AlertTriangle, X, Check } from 'lucide-react';
export const ResetConfirmModal = ({ petName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border-4 border-rose-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <RotateCcw className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-heading font-extrabold text-base leading-tight">
              Mulai Ulang Permainan?
            </h3>
          </div>
          <button
            onClick={() => {
              soundFx.playBeep();
              onCancel();
            }}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-3xl shadow-inner">
            🔄
          </div>

          <div>
            <h4 className="font-heading font-bold text-slate-800 text-base">
              Reset Data Tamagotchi 3D
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Seluruh progres bermain bersama <strong className="text-slate-700">{petName}</strong>{' '}
              (level, koin, catatan jurnal, dan aksesoris) akan diatur ulang ke awal.
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-left flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Setelah reset, kamu dapat langsung <strong>memilih kembali hewan peliharaanmu</strong>{' '}
              (Milo, Fizzi, atau Ngkur) dari awal!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={() => {
                soundFx.playBeep();
                onCancel();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs transition-colors"
            >
              Batal (Lanjutkan)
            </button>
            <button
              onClick={() => {
                soundFx.playLevelUp();
                onConfirm();
              }}
              className="btn-tactile flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-heading font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Ya, Mulai Ulang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
