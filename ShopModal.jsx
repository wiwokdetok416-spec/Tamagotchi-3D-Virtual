import React, { useState } from 'react';
import { ACCESSORIES_CATALOG, SHELL_THEMES, DANCE_CATALOG } from '../services/storage';
import { soundFx } from '../audio/soundEffects';
import { X, ShoppingBag, Sparkles, Palette, Check, Bot, Music, Zap } from 'lucide-react';
export const ShopModal = ({
  coins,
  ownedAccessories,
  equippedHat,
  currentThemeId,
  isJossyOwned,
  ownedDances,
  adminUnlocked = false,
  freeShopping = false,
  pets,
  onBuyAccessory,
  onEquipHat,
  onSelectTheme,
  onBuyJossyBot,
  onBuyDance,
  onOpenJossyBotModal,
  onStartAdminQuiz,
  onOpenAdminPanel,
  onClose,
}) => {
  const [tab, setTab] = useState('wardrobe');
  const maxPetLevel = pets ? Math.max(...Object.values(pets).map((p) => p.level || 1), 1) : 1;
  const isLevel5Reached = maxPetLevel >= 5;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-300 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-purple-200" />
            <div>
              <h3 className="font-heading font-extrabold text-lg leading-tight">
                Toko Tamagotchi &amp; AI
              </h3>
              <p className="text-xs text-purple-200 font-medium">
                Dompetmu: {coins.toLocaleString('id-ID')} 🪙
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

        {/* Tab switch */}
        <div className="flex border-b border-purple-100 bg-purple-50/50 p-1.5 gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => {
              soundFx.playBeep();
              setTab('wardrobe');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
              tab === 'wardrobe'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-100/60'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Aksesoris
          </button>
          <button
            onClick={() => {
              soundFx.playBeep();
              setTab('robot');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
              tab === 'robot'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-cyan-700 hover:bg-cyan-100/60'
            }`}
          >
            <Bot className="w-4 h-4" /> J0ssy bot
          </button>
          <button
            onClick={() => {
              soundFx.playBeep();
              setTab('dances');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
              tab === 'dances'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-pink-700 hover:bg-pink-100/60'
            }`}
          >
            <Music className="w-4 h-4" /> Joget
          </button>
          <button
            onClick={() => {
              soundFx.playBeep();
              setTab('themes');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
              tab === 'themes'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-100/60'
            }`}
          >
            <Palette className="w-4 h-4" /> Cangkang
          </button>
          <button
            onClick={() => {
              soundFx.playBeep();
              setTab('admin');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
              tab === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-amber-700 hover:bg-amber-100/60'
            }`}
          >
            <Zap className="w-4 h-4" /> Admin
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {freeShopping && (
            <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm animate-pulse">
              <Zap className="w-4 h-4" /> MODE BELANJA GRATIS ADMIN AKTIF: Semua Item Rp 0 🪙!
            </div>
          )}
          {tab === 'wardrobe' && (
            <div className="space-y-3">
              {/* Active equipped accessory banner */}
              {equippedHat && (
                <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 flex justify-between items-center text-xs shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-200 text-purple-900 flex items-center justify-center text-base">
                      {ACCESSORIES_CATALOG.find((a) => a.id === equippedHat)?.emoji || '🎩'}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-600 block">
                        Sedang Dipakai di Hewan:
                      </span>
                      <span className="font-bold text-slate-800 text-xs">
                        {ACCESSORIES_CATALOG.find((a) => a.id === equippedHat)?.name ||
                          'Aksesoris 3D'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onEquipHat(null);
                      soundFx.playBeep();
                    }}
                    className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Lepas
                  </button>
                </div>
              )}

              {ACCESSORIES_CATALOG.map((item) => {
                const isOwned = ownedAccessories.includes(item.id);
                const isEquipped = equippedHat === item.id;
                const canAfford = freeShopping || coins >= item.cost;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                      isEquipped
                        ? 'border-purple-400 bg-purple-50 shadow-xs'
                        : isOwned
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                        {item.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-heading font-bold text-sm text-slate-800">
                            {item.name}
                          </h4>
                          {isEquipped && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-600 text-white">
                              Dipakai
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                      </div>
                    </div>

                    <div>
                      {isOwned ? (
                        <button
                          onClick={() => {
                            onEquipHat(isEquipped ? null : item.id);
                          }}
                          className={`btn-tactile px-3.5 py-1.5 font-heading font-bold text-xs rounded-xl flex items-center gap-1 ${
                            isEquipped
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                          }`}
                        >
                          {isEquipped ? (
                            'Lepas'
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" /> Pakai
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => onBuyAccessory(item)}
                          className={`btn-tactile px-3 py-1.5 font-heading font-bold text-xs rounded-xl ${
                            canAfford
                              ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-xs'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {freeShopping ? 'Beli Gratis (0 🪙)' : `Beli ${item.cost} 🪙`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'robot' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-cyan-400 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
                    🤖
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-black text-lg text-white">J0ssy bot</h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950">
                        AI Groq 20B
                      </span>
                    </div>
                    <p className="text-xs text-cyan-200 font-medium mt-0.5">
                      Robot Pintar &amp; Asisten Pribadi Tamagotchi
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Robot AI canggih yang setia menemanimu di dunia 3D. J0ssy bot bisa diajak ngobrol
                  cerdas, membantumu merawat hewan peliharaan, serta memiliki indikator baterai
                  interaktif yang perlu diistirahatkan dan dicas saat energinya menipis!
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                    <span className="text-base">💬</span>
                    <span className="text-slate-200">Ngobrol AI Cerdas</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                    <span className="text-base">⚡</span>
                    <span className="text-slate-200">Sistem Baterai Dinamis</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                    <span className="text-base">🍲</span>
                    <span className="text-slate-200">Bantu Beri Makan</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                    <span className="text-base">🫧</span>
                    <span className="text-slate-200">Bantu Mandikan Pet</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Harga Spesial
                    </span>
                    <span className="font-heading font-extrabold text-base text-amber-400">
                      100.000 🪙
                    </span>
                  </div>

                  {isJossyOwned ? (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenJossyBotModal();
                      }}
                      className="btn-tactile px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-heading font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                    >
                      <Bot className="w-4 h-4" /> Buka J0ssy bot
                    </button>
                  ) : (
                    <button
                      disabled={!freeShopping && coins < 100000}
                      onClick={onBuyJossyBot}
                      className={`btn-tactile px-4 py-2 font-heading font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 ${
                        freeShopping || coins >= 100000
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      {freeShopping
                        ? 'Beli Gratis (0 🪙)'
                        : coins >= 100000
                          ? 'Beli J0ssy bot (100.000 🪙)'
                          : 'Koin Kurang (100.000 🪙)'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'dances' && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-900 flex items-center gap-2">
                <Music className="w-4 h-4 text-pink-600 shrink-0" />
                <span>
                  Beli dan buka gerakan joget seru untuk hewan peliharaanmu! Tiap joget memberikan
                  +15 Kebahagiaan &amp; +10 XP.
                </span>
              </div>

              {DANCE_CATALOG.map((item) => {
                const isOwned = ownedDances.includes(item.id) || item.isDefault;
                const canAfford = freeShopping || coins >= item.cost;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                      isOwned ? 'border-pink-200 bg-pink-50/50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
                        {item.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-heading font-bold text-sm text-slate-800">
                            {item.name}
                          </h4>
                          {item.isDefault && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-600 text-white">
                              Gratis
                            </span>
                          )}
                          {isOwned && !item.isDefault && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-pink-600 text-white">
                              Dimiliki
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isOwned ? (
                        <span className="text-xs font-bold text-pink-600 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Siap
                        </span>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => onBuyDance(item)}
                          className={`btn-tactile px-3 py-1.5 font-heading font-bold text-xs rounded-xl ${
                            canAfford
                              ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-xs'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {freeShopping
                            ? 'Beli Gratis (0 🪙)'
                            : `Beli ${item.cost.toLocaleString('id-ID')} 🪙`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'themes' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Pilih gaya cangkang konsol Tamagotchimu sesuka hati tanpa biaya tambahan!
              </p>
              {SHELL_THEMES.map((theme) => {
                const isSelected = currentThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onSelectTheme(theme);
                      soundFx.playSelect();
                    }}
                    className={`btn-tactile w-full p-3.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 shadow-sm ring-2 ring-purple-300/50'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${theme.primary} border-2 ${theme.border} shadow-inner`}
                      ></div>
                      <div>
                        <div className="font-heading font-bold text-sm text-slate-800">
                          {theme.name}
                        </div>
                        <div className="text-[11px] text-slate-500">Tema Cangkang Konsol</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Aktif
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 5: ADMIN PANEL TAB */}
          {tab === 'admin' && (
            <div className="space-y-4 py-1">
              {adminUnlocked ? (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 to-slate-900 border-2 border-amber-400 shadow-xl text-center space-y-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 mx-auto flex items-center justify-center text-3xl font-black shadow-lg ring-4 ring-amber-400/30">
                    ⚡
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-400 border border-emerald-400/40">
                      Hak Akses Penuh: Aktif Selamanya
                    </span>
                    <h4 className="text-xl font-heading font-black text-amber-300 mt-2">
                      ADMIN PANEL SUDAH TERBUKA!
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                      Kotak kecil bertuliskan{' '}
                      <span className="text-amber-400 font-bold">⚡ ADMIN</span> kini aktif melayang
                      di layarmu. Kamu bisa menyeretnya kemana saja dan menekannya untuk membuka
                      menu kapan pun!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playBeep();
                      onOpenAdminPanel();
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:opacity-95 text-slate-950 font-heading font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-5 h-5 text-slate-950" />
                    <span>Buka Menu Admin Panel Sekarang ⚡</span>
                  </button>
                </div>
              ) : (
                <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/70 border-2 border-amber-400/80 shadow-2xl text-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md">
                      ⚡
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        Fitur Rahasia Toko
                      </span>
                      <h4 className="font-heading font-black text-lg text-amber-300 leading-tight mt-0.5">
                        Admin Panel Permanen
                      </h4>
                      <p className="text-xs text-slate-400">
                        Harga Koin: Rp 0 🪙 (Harga = Jawaban Benar)
                      </p>
                    </div>
                  </div>

                  {/* Level 5 Requirement Box */}
                  <div
                    className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                      isLevel5Reached
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold flex items-center gap-1.5">
                        {isLevel5Reached
                          ? '✅ Syarat 1: Minimal Level 5 (Terpenuhi)'
                          : '🔒 Syarat 1: Minimal Level 5 (Belum Tercapai)'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10">
                        Lv. {maxPetLevel} / 5
                      </span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isLevel5Reached ? 'bg-emerald-400' : 'bg-rose-500'}`}
                        style={{ width: `${Math.min(100, (maxPetLevel / 5) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {isLevel5Reached
                        ? `Luar biasa! Hewan peliharaanmu telah mencapai Level ${maxPetLevel} (≥ 5). Kamu berhak mengikuti Ujian Matematika!`
                        : `Salah satu hewan peliharaanmu harus mencapai minimal Level 5 terlebih dahulu! Saat ini level tertinggi adalah Lv. ${maxPetLevel}. Beri makan, rawat, dan mainkan mini-game untuk menaikkan level.`}
                    </p>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-xs space-y-2 text-slate-300">
                    <p className="font-bold text-amber-300">📜 Syarat 2: Ujian 5 Soal Matematika</p>
                    <p>
                      Jawab{' '}
                      <span className="text-white font-extrabold">5 Soal Matematika Acak</span>{' '}
                      (berbagai tingkat kesulitan: Mudah, Sedang, Sulit, hingga Ekstrem) dan{' '}
                      <span className="text-emerald-400 font-extrabold">BENAR SEMUA (5/5)</span>!
                    </p>
                    <p>
                      Jika lulus kedua syarat ini...{' '}
                      <span className="text-amber-300 font-bold uppercase tracking-wide">
                        BAKAL DAPAT ADMIN PANEL SELAMA-LAMANYA!
                      </span>
                    </p>
                  </div>

                  <div className="bg-amber-950/30 p-3 rounded-2xl border border-amber-500/30 text-[11px] text-amber-200/90 space-y-1">
                    <p className="font-bold text-amber-300">Ciri-ciri &amp; Yang Bisa Dilakukan:</p>
                    <p>• Muncul kotak kecil yang bisa diseret &amp; ada menunya kalau dipencet</p>
                    <p>• Kendalikan harga di toko / beli dengan gratis (Rp 0)</p>
                    <p>• Bisa kebal pada mini game (God Mode)</p>
                    <p>• Bisa atur bar kebutuhan hewan (bahkan dibekukan)</p>
                    <p>• Bisa atur koin kita (bahkan bisa sampai ∞)</p>
                    <p>• Membuka kunci semua yang belum didapat &amp; reset ke semula</p>
                  </div>

                  <button
                    disabled={!isLevel5Reached}
                    onClick={() => {
                      if (!isLevel5Reached) return;
                      soundFx.playBeep();
                      onStartAdminQuiz();
                    }}
                    className={`w-full py-3.5 rounded-2xl font-heading font-black text-sm uppercase tracking-wide shadow-xl flex items-center justify-center gap-2 ${
                      isLevel5Reached
                        ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:opacity-95 text-slate-950 cursor-pointer'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isLevel5Reached ? (
                      <span>Mulai Ujian 5 Soal Matematika 🎯</span>
                    ) : (
                      <span>🔒 Butuh Minimal Level 5 (Saat Ini Lv. {maxPetLevel})</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
