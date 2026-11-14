import React from 'react';
import { INITIAL_FOODS } from '../services/storage';
import { soundFx } from '../audio/soundEffects';
import { X, Utensils, Plus, Check } from 'lucide-react';
export const FoodMenuModal = ({
  petId,
  petName,
  inventory,
  coins,
  freeShopping = false,
  onFeed,
  onBuyFood,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-300 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-6 h-6 text-yellow-100" />
            <div>
              <h3 className="font-heading font-bold text-lg leading-tight">Beri Makan {petName}</h3>
              <p className="text-xs text-orange-100 font-medium">Koin Kamu: {coins} 🪙</p>
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

        {/* Food List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {freeShopping && (
            <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black text-center shadow-xs">
              ⚡ MODE BELANJA GRATIS: Semua Makanan Rp 0 🪙!
            </div>
          )}
          {INITIAL_FOODS.map((food) => {
            const count = inventory[food.id] || 0;
            const isFavorite = food.suitablePet === petId;
            const canAfford = freeShopping || coins >= food.cost;
            return (
              <div
                key={food.id}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                  isFavorite
                    ? 'border-amber-300 bg-amber-50/70 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                }`}
              >
                {/* Food Icon & Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-13 h-13 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-3xl shrink-0">
                    {food.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-heading font-bold text-sm text-slate-800 truncate">
                        {food.name}
                      </h4>
                      {isFavorite && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-900">
                          Favorit {petName}! ⭐
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{food.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-bold">
                      <span className="text-orange-600">+{food.hungerBoost}% Kenyang</span>
                      <span className="text-rose-500">+{food.happinessBoost}% Senang</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Feed or Buy */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {count > 0 ? (
                    <button
                      onClick={() => {
                        onFeed(food);
                      }}
                      className="btn-tactile px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold text-xs rounded-xl shadow-sm flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Suapi ({count})
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        onBuyFood(food);
                      }}
                      className={`btn-tactile px-3.5 py-2 font-heading font-bold text-xs rounded-xl flex items-center gap-1 ${
                        canAfford
                          ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-sm'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />{' '}
                      {freeShopping ? 'Gratis (0 🪙)' : `Beli ${food.cost} 🪙`}
                    </button>
                  )}
                  {count > 0 && (
                    <button
                      disabled={!canAfford}
                      onClick={() => onBuyFood(food)}
                      className="text-[10px] text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
                    >
                      + Tambah ({freeShopping ? '0 🪙' : `+${food.cost} 🪙`})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-amber-50 border-t border-amber-200 text-center">
          <p className="text-[11px] text-slate-500">
            Makanan favorit memberikan efek kebahagiaan ganda dan membuat ikatan kasih sayang
            semakin erat!
          </p>
        </div>
      </div>
    </div>
  );
};
