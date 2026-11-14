import React from 'react';
import { DANCE_CATALOG } from '../services/storage';
import { soundFx } from '../audio/soundEffects';
import { X, Play, ShoppingBag } from 'lucide-react';
export const DanceModal = ({ coins, ownedDances, petName, onSelectDance, onBuyDance, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-400 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
              💃
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg leading-tight">
                Panggung Joget {petName}
              </h3>
              <p className="text-xs text-pink-100 font-medium">
                +15 Kebahagiaan &amp; +10 XP tiap berjoget! ⭐
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playBeep();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50">
          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <span className="font-semibold">Dompet Koinmu:</span>
            <span className="font-extrabold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-lg">
              {coins.toLocaleString('id-ID')} 🪙
            </span>
          </div>

          <div className="space-y-2.5">
            {DANCE_CATALOG.map((item) => {
              const isOwned = ownedDances.includes(item.id) || item.isDefault;
              const canAfford = coins >= item.cost;
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                    isOwned
                      ? 'border-pink-300 bg-white shadow-xs'
                      : 'border-slate-200 bg-slate-100/80 opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-100 border border-pink-200 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {item.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-heading font-bold text-sm text-slate-800">
                          {item.name}
                        </h4>
                        {item.isDefault && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-300">
                            GRATIS
                          </span>
                        )}
                        {isOwned && !item.isDefault && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-pink-100 text-pink-700 border border-pink-300">
                            DIMILIKI
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isOwned ? (
                      <button
                        onClick={() => {
                          onSelectDance(item);
                          onClose();
                        }}
                        className="btn-tactile px-3.5 py-2 font-heading font-bold text-xs bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl shadow-md flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Joget!</span>
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => onBuyDance(item)}
                        className={`btn-tactile px-3 py-1.5 font-heading font-bold text-xs rounded-xl flex items-center gap-1 ${
                          canAfford
                            ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-sm'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Beli {item.cost.toLocaleString('id-ID')} 🪙</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            Ajak {petName} joget secara berkala untuk menjaga suasana hatinya selalu gembira! 🎶
          </p>
        </div>
      </div>
    </div>
  );
};
