import React, { useState } from 'react';
import { PET_SPECIES } from '../services/storage';
import { soundFx } from '../audio/soundEffects';
import { Sparkles, Check, Heart, Shield, Waves, ChevronRight } from 'lucide-react';
export const PetSelectorModal = ({ currentPetId, onSelectPet, canClose = false, onClose }) => {
  const [selectedId, setSelectedId] = useState(currentPetId || 'milo');
  const [petName, setPetName] = useState(PET_SPECIES[currentPetId || 'milo'].name);
  const handleChoose = (id) => {
    setSelectedId(id);
    setPetName(PET_SPECIES[id].name);
    if (id === 'milo') soundFx.playBark();
    else if (id === 'fizzi') soundFx.playBubble();
    else if (id === 'patar') soundFx.playCrabSnap();
    else soundFx.playMeow();
  };
  const handleConfirm = () => {
    soundFx.playLevelUp();
    onSelectPet(selectedId, petName.trim() || PET_SPECIES[selectedId].name);
    if (onClose) onClose();
  };
  const petsList = ['milo', 'fizzi', 'ngkur', 'patar'];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-300 flex flex-col max-h-[92vh]">
        {/* Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Game Tamagotchi 3D Virtual Pet
          </div>
          <h2 className="font-heading font-extrabold text-2xl drop-shadow-sm">
            Pilih Sahabat Virtual Peliharaanmu!
          </h2>
          <p className="text-xs text-amber-50 mt-1 max-w-md mx-auto">
            Pilih karakter kesayanganmu. Progres, koin, dan usahamu tersimpan aman secara offline!
          </p>
        </div>

        {/* 4 Pet Cards */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {petsList.map((id) => {
              const info = PET_SPECIES[id];
              const isSelected = selectedId === id;
              const emoji =
                id === 'milo' ? '🐶' : id === 'fizzi' ? '🐟' : id === 'patar' ? '🦀' : '🐱';
              const Icon =
                id === 'milo' ? Heart : id === 'fizzi' ? Waves : id === 'patar' ? Sparkles : Shield;
              return (
                <button
                  key={id}
                  onClick={() => handleChoose(id)}
                  className={`btn-tactile rounded-2xl p-3 text-left border-3 transition-all flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/90 shadow-md ring-3 ring-amber-300/40'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex justify-between items-center w-full">
                    <span className="text-3xl">{emoji}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-[10px] shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Character Name & Tagline */}
                  <div className="my-2">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-slate-800 leading-tight">
                      {info.name}
                    </h3>
                    <p className="text-[10px] font-bold text-amber-600 mt-0.5 truncate">
                      {info.species}
                    </p>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                      {info.tagline}
                    </p>
                  </div>

                  {/* Highlight pill */}
                  <div className="pt-2 border-t border-slate-200/80 w-full text-[10px] font-semibold text-slate-600 flex items-center gap-1">
                    <Icon className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">{info.specialSkill}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Pet Detail Bio */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 mt-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl">
                {selectedId === 'milo'
                  ? '🐶'
                  : selectedId === 'fizzi'
                    ? '🐟'
                    : selectedId === 'patar'
                      ? '🦀'
                      : '🐱'}
              </span>
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-800">
                  {PET_SPECIES[selectedId].name} - {PET_SPECIES[selectedId].tagline}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {PET_SPECIES[selectedId].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                <span className="font-bold text-slate-500 block">Karakter Alami:</span>
                <span className="font-bold text-amber-800">{PET_SPECIES[selectedId].nature}</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                <span className="font-bold text-slate-500 block">Makanan Favorit:</span>
                <span className="font-bold text-amber-800">
                  {PET_SPECIES[selectedId].favoriteFood}
                </span>
              </div>
            </div>

            {/* Custom Name input */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Beri Nama Panggilan untuk Sahabatmu:
              </label>
              <input
                type="text"
                maxLength={16}
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-bold text-sm text-slate-800"
                placeholder={`Contoh: ${PET_SPECIES[selectedId].name}`}
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
          {canClose && onClose && (
            <button
              onClick={() => {
                soundFx.playBeep();
                onClose();
              }}
              className="px-4 py-3 text-slate-500 hover:text-slate-700 font-bold text-sm rounded-xl"
            >
              Batal
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="btn-tactile flex-1 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 text-white font-heading font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base"
          >
            Mulai Bermain Bersama {petName || PET_SPECIES[selectedId].name}!{' '}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
