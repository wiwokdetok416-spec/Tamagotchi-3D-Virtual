import { soundFx } from '../audio/soundEffects';
import {
  Volume2,
  VolumeX,
  Zap,
  Heart,
  Utensils,
  Droplets,
  Moon,
  Sliders,
  BookOpen,
  Smartphone,
  Maximize2,
  RotateCcw,
  Bot,
} from 'lucide-react';
export const PetHUD = ({
  pet,
  coins,
  soundEnabled,
  quality,
  isSleeping,
  consoleFrameMode,
  jossyState,
  onToggleSound,
  onCycleQuality,
  onToggleFrameMode,
  onOpenSelector,
  onOpenMarkdown,
  onResetGame,
  onOpenJossyBot,
}) => {
  const getStatColor = (val) => {
    if (val <= 25) return 'from-rose-500 to-red-500';
    if (val <= 50) return 'from-amber-400 to-amber-500';
    return 'from-emerald-400 to-teal-500';
  };
  const getMoodInfo = () => {
    if (isSleeping)
      return {
        label: 'Tidur Pulas',
        emoji: '💤',
        color: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
      };
    if (pet.stats.hunger <= 30)
      return {
        label: 'Perut Lapar',
        emoji: '🍗',
        color: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
      };
    if (pet.stats.hygiene <= 30)
      return {
        label: 'Ingin Mandi',
        emoji: '🫧',
        color: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
      };
    if (pet.stats.energy <= 25)
      return {
        label: 'Mengantuk',
        emoji: '🥱',
        color: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      };
    if (pet.stats.happiness >= 80)
      return {
        label: 'Sangat Bahagia',
        emoji: '🌟',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      };
    return {
      label: 'Ceria & Sehat',
      emoji: '😊',
      color: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    };
  };
  const mood = getMoodInfo();
  const xpPercent = Math.min(100, Math.floor((pet.xp / pet.xpNext) * 100));
  return (
    <div className="absolute top-0 left-0 right-0 p-2 sm:p-4 z-20 pointer-events-none w-full">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-2">
        {/* Responsive Top Bar: Dual-tier on mobile (<sm), Single unified row on sm+ */}

        {/* --- MOBILE VIEW (< 640px) --- */}
        <div className="flex sm:hidden flex-col gap-1.5 pointer-events-auto w-full">
          {/* Mobile Tier 1: Pet Profile + Currency & J0ssy */}
          <div className="flex items-center justify-between gap-1.5 w-full">
            {/* Pet Identity Card */}
            <button
              onClick={() => {
                soundFx.playBeep();
                onOpenSelector();
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white shadow-lg backdrop-blur-md transition-all text-left shrink min-w-0"
              title="Klik untuk ganti atau pilih hewan peliharaan"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
                {pet.id === 'milo'
                  ? '🐶'
                  : pet.id === 'fizzi'
                    ? '🐟'
                    : pet.id === 'patar'
                      ? '🦀'
                      : '🐱'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-heading font-extrabold text-xs text-slate-100 truncate max-w-[80px]">
                    {pet.name}
                  </span>
                  <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                    Lv.{pet.level}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-slate-400">
                  <span>{mood.emoji}</span>
                  <div className="w-8 h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-400"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>

            {/* Coins & J0ssy Status on Mobile */}
            <div className="flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-heading font-extrabold text-xs shadow-md border border-amber-300">
                <span>🪙</span>
                <span>{coins.toLocaleString('id-ID')}</span>
              </div>

              {jossyState?.owned && (
                <button
                  onClick={() => {
                    soundFx.playBeep(880, 0.1);
                    if (onOpenJossyBot) onOpenJossyBot();
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-2xl border backdrop-blur-md transition-all shadow-md text-xs font-bold ${
                    jossyState.battery <= 0
                      ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse'
                      : jossyState.battery < 20
                        ? 'bg-amber-950/90 border-amber-400 text-amber-300 animate-bounce'
                        : jossyState.isSleeping
                          ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
                          : 'bg-cyan-950/90 border-cyan-400 text-cyan-300'
                  }`}
                  title="J0ssy bot AI"
                >
                  <Bot className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                  <span className="font-mono text-[10px]">{jossyState.battery}%</span>
                  {jossyState.isSleeping && (
                    <Zap className="w-2.5 h-2.5 fill-current text-emerald-400" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Tier 2: Compact Utility Quick Strip (Zero Overflow) */}
          <div className="flex items-center justify-end gap-1 w-full overflow-x-auto py-0.5 scrollbar-none">
            {/* Markdown Journal */}
            <button
              onClick={() => {
                soundFx.playBeep();
                onOpenMarkdown();
              }}
              className="px-2 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-teal-500/40 text-teal-300 transition-all shadow-sm backdrop-blur-md flex items-center gap-1 text-[11px] font-bold shrink-0"
              title="Buku Panduan & Jurnal Markdown"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Jurnal</span>
            </button>

            {/* View Mode Switcher */}
            <button
              onClick={() => {
                soundFx.playBeep();
                onToggleFrameMode();
              }}
              className="px-2 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-all shadow-sm backdrop-blur-md flex items-center gap-1 text-[11px] font-bold shrink-0"
              title={consoleFrameMode ? 'Ganti ke Layar Penuh' : 'Ganti ke Mode Konsol'}
            >
              {consoleFrameMode ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Penuh</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Konsol</span>
                </>
              )}
            </button>

            {/* Quality Switcher */}
            <button
              onClick={() => {
                soundFx.playBeep();
                onCycleQuality();
              }}
              className="px-2 py-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-all shadow-sm backdrop-blur-md flex items-center gap-1 text-[11px] font-bold shrink-0"
              title="Kualitas Grafis"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>{quality === 'low' ? 'Hemat' : quality === 'medium' ? 'Normal' : 'HD'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-all shadow-sm backdrop-blur-md shrink-0"
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              )}
            </button>

            {/* Reset Game */}
            <button
              onClick={() => {
                soundFx.playBeep();
                onResetGame();
              }}
              className="px-2 py-1 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 transition-all shadow-sm backdrop-blur-md flex items-center gap-1 text-[11px] font-bold shrink-0"
              title="Reset Permainan"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* --- DESKTOP & TABLET VIEW (sm: >= 640px) --- */}
        <div className="hidden sm:flex items-center justify-between gap-3 pointer-events-auto w-full">
          {/* Left: Pet Identity Profile Card */}
          <button
            onClick={() => {
              soundFx.playBeep();
              onOpenSelector();
            }}
            className="group flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 text-white shadow-lg backdrop-blur-md transition-all text-left shrink-0"
            title="Klik untuk ganti atau pilih hewan peliharaan"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-extrabold flex items-center justify-center text-xl shadow-md shrink-0 group-hover:scale-105 transition-transform">
              {pet.id === 'milo'
                ? '🐶'
                : pet.id === 'fizzi'
                  ? '🐟'
                  : pet.id === 'patar'
                    ? '🦀'
                    : '🐱'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base text-slate-100 tracking-wide">
                  {pet.name}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Lv.{pet.level}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <span
                  className={`px-1.5 py-0.5 rounded-full border text-[9px] font-bold flex items-center gap-1 ${mood.color}`}
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </span>
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-300"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </button>

          {/* Right Toolbar: Coins, J0ssy, Jurnal, Mode Frame, Quality, Sound, Reset */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Coins Counter Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-heading font-extrabold text-sm shadow-md border border-amber-300">
              <span className="text-sm">🪙</span>
              <span>{coins.toLocaleString('id-ID')}</span>
            </div>

            {/* J0ssy bot Status Button (If Owned) */}
            {jossyState?.owned && (
              <button
                onClick={() => {
                  soundFx.playBeep(880, 0.1);
                  if (onOpenJossyBot) onOpenJossyBot();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border backdrop-blur-md transition-all shadow-md text-xs font-bold ${
                  jossyState.battery <= 0
                    ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 animate-pulse'
                    : jossyState.battery < 20
                      ? 'bg-amber-950/80 border-amber-400/80 text-amber-300 animate-bounce'
                      : jossyState.isSleeping
                        ? 'bg-emerald-950/80 border-emerald-400/80 text-emerald-300'
                        : 'bg-cyan-950/80 border-cyan-400/80 text-cyan-300 hover:bg-cyan-900/80'
                }`}
                title="Buka J0ssy bot & cek kapasitas baterai"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span>J0ssy</span>
                <span className="font-mono text-xs">{jossyState.battery}%</span>
                {jossyState.isSleeping && (
                  <Zap className="w-3 h-3 fill-current text-emerald-400 animate-pulse" />
                )}
              </button>
            )}

            {/* Markdown Journal Quick Access */}
            <button
              onClick={() => {
                soundFx.playBeep();
                onOpenMarkdown();
              }}
              className="px-2.5 py-1.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-teal-500/40 text-teal-300 hover:text-white transition-all shadow-md backdrop-blur-md flex items-center gap-1 text-xs font-bold"
              title="Buka Buku Panduan & Jurnal Markdown"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Jurnal</span>
            </button>

            {/* View Mode Switcher (Konsol vs Layar Penuh) */}
            <button
              onClick={() => {
                soundFx.playBeep();
                onToggleFrameMode();
              }}
              className="px-2.5 py-1.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-all shadow-md backdrop-blur-md flex items-center gap-1 text-xs font-bold"
              title={
                consoleFrameMode ? 'Ganti ke Tampilan Layar Penuh' : 'Ganti ke Tampilan Mode Konsol'
              }
            >
              {consoleFrameMode ? (
                <>
                  <Maximize2 className="w-4 h-4 text-amber-400" />
                  <span>Layar Penuh</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Konsol</span>
                </>
              )}
            </button>

            {/* Quality Settings Cycle */}
            <button
              onClick={() => {
                soundFx.playBeep();
                onCycleQuality();
              }}
              className="px-2.5 py-1.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-all shadow-md backdrop-blur-md flex items-center gap-1 text-xs font-bold"
              title={`Kualitas Grafis: ${quality === 'low' ? 'Hemat (Perangkat Lawas)' : quality === 'medium' ? 'Normal' : 'Tinggi (HD)'}`}
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>{quality === 'low' ? 'Hemat' : quality === 'medium' ? 'Normal' : 'HD'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-all shadow-md backdrop-blur-md"
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
            </button>

            {/* Reset Game Button */}
            <button
              onClick={() => {
                soundFx.playBeep();
                onResetGame();
              }}
              className="px-2.5 py-1.5 rounded-2xl bg-rose-950/70 hover:bg-rose-900/90 border border-rose-500/50 text-rose-300 hover:text-white transition-all shadow-md backdrop-blur-md flex items-center gap-1 text-xs font-bold"
              title="Mulai Ulang Permainan Tamagotchi 3D (Reset)"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Clean Vitals Gauge Row - Expansive & Balanced */}
        <div className="pointer-events-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 sm:p-3 backdrop-blur-md shadow-lg max-w-3xl self-center w-full">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-xs">
            {/* 1. Kenyang (Hunger) */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1 text-orange-400 truncate">
                  <Utensils className="w-3 h-3 shrink-0" />
                  <span className="hidden xs:inline">Kenyang</span>
                </span>
                <span className="font-mono text-[10px] text-slate-200">
                  {Math.round(pet.stats.hunger)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                <div
                  className={`h-full bg-gradient-to-r transition-all duration-300 ${getStatColor(pet.stats.hunger)}`}
                  style={{ width: `${Math.min(100, Math.max(0, pet.stats.hunger))}%` }}
                />
              </div>
            </div>

            {/* 2. Energi */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1 text-amber-400 truncate">
                  <Zap className="w-3 h-3 shrink-0" />
                  <span className="hidden xs:inline">Energi</span>
                </span>
                <span className="font-mono text-[10px] text-slate-200">
                  {Math.round(pet.stats.energy)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                <div
                  className={`h-full bg-gradient-to-r transition-all duration-300 ${getStatColor(pet.stats.energy)}`}
                  style={{ width: `${Math.min(100, Math.max(0, pet.stats.energy))}%` }}
                />
              </div>
            </div>

            {/* 3. Kebersihan */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1 text-sky-400 truncate">
                  <Droplets className="w-3 h-3 shrink-0" />
                  <span className="hidden xs:inline">Bersih</span>
                </span>
                <span className="font-mono text-[10px] text-slate-200">
                  {Math.round(pet.stats.hygiene)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                <div
                  className={`h-full bg-gradient-to-r transition-all duration-300 ${getStatColor(pet.stats.hygiene)}`}
                  style={{ width: `${Math.min(100, Math.max(0, pet.stats.hygiene))}%` }}
                />
              </div>
            </div>

            {/* 4. Kasih Sayang / Bahagia */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1 text-rose-400 truncate">
                  <Heart className="w-3 h-3 shrink-0" />
                  <span className="hidden xs:inline">Cinta</span>
                </span>
                <span className="font-mono text-[10px] text-slate-200">
                  {Math.round(pet.stats.love)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, pet.stats.love))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Sleeping Status Banner */}
        {isSleeping && (
          <div className="self-center px-4 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-400/50 text-indigo-200 text-xs font-bold flex items-center gap-2 pointer-events-auto shadow-md backdrop-blur-xs">
            <Moon className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
            <span>{pet.name} sedang tidur nyenyak memulihkan energi... Zzz</span>
          </div>
        )}
      </div>
    </div>
  );
};
