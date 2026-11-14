import React, { useState } from 'react';
import { marked } from 'marked';
import { soundFx } from '../audio/soundEffects';
import {
  X,
  ShoppingBag,
  Shield,
  Sliders,
  Coins,
  Unlock,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  FileText,
  Copy,
  Infinity as InfinityIcon,
} from 'lucide-react';
export const AdminPanelModal = ({
  currentPetId,
  pets,
  coins,
  adminState,
  onUpdateAdminState,
  onUpdatePetStats,
  onSetCoins,
  onUnlockAllContent,
  onResetAdminCheats,
  onResetAdminModifications,
  onResetGameFactory,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('shop');
  const [customCoinInput, setCustomCoinInput] = useState('');
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [copiedDocs, setCopiedDocs] = useState(false);
  const activePet = currentPetId ? pets[currentPetId] : null;
  const adminMarkdownDocs = `# ⚡ Lembar Dokumentasi Pengembang & Admin Panel

Dokumentasi arsitektur sistem kendali internal dan fitur cheat permainan **Tamagotchi 3D**.

---

## 🛠️ Ringkasan Fitur & Perintah Admin

### 1. 🛒 Kendali Toko & Belanja Gratis (Free Shopping)
* **Status**: \`${adminState.freeShopping ? 'AKTIF (GRATIS)' : 'NORMAL'}\`
* Saat aktif, seluruh makanan lezat, topi aksesoris, tarian joget, dan robot AI dapat dibeli tanpa koin (biaya 0 🪙).

### 2. 🛡️ Mode Kebal Mini-Game (Invincible God Mode)
* **Status**: \`${adminState.invincibleMiniGame ? 'AKTIF (KEBAL BOM)' : 'NORMAL'}\`
* Pemain menjadi kebal terhadap ledakan bom duri di permainan *Tangkap Bintang* dan secara instan otomatis menang di *Tebak Kotak Hadiah*.

### 3. 📊 Manipulasi Kebutuhan & Pembekuan Status
* **Status Freeze**: \`${adminState.freezeStats ? 'DIBEKUKAN (TIDAK BERKURANG)' : 'NORMAL (DECAY AKTIF)'}\`
* Anda dapat menggeser bar Kenyang, Energi, Kebersihan, Kebahagiaan, dan Kasih Sayang kapan saja secara instan.

### 4. 🪙 Manipulasi Saldo Koin
* Saldo saat ini: **${coins.toLocaleString('id-ID')} 🪙**
* Dukungan penambahan koin hingga \`999.999.999 🪙\` (Koin Tak Terhingga / ∞).

### 5. 🔓 Pembuka Seluruh Konten (Unlock All)
* Seketika membuka seluruh katalog topi, semua emotikon tarian, robot pendamping AI J0ssy bot (baterai 100%), dan seluruh penghargaan medali.

---

## 🔄 Pemulihan "Reset ke Semula"
> **Catatan Penting**:
> Tombol **"Reset ke Semula"** di Admin Panel bertujuan untuk **mengembalikan semua perubahan yang telah dimodifikasi melalui Admin Panel ke kondisi standar normal**.
> Fitur ini **TIDAK menghapus data save atau progres hewan**, melainkan:
> 1. Mematikan fitur belanja gratis.
> 2. Mematikan mode kebal mini game.
> 3. Mematikan pembekuan status kebutuhan hewan.
> 4. Mengembalikan kebutuhan hewan ke kondisi sehat wajar (Kenyang 85%, Energi 90%, Kebersihan 90%, Kebahagiaan 85%, Kasih Sayang 70%, Kesehatan 100%).
> 5. Menormalkan koin kembali ke saldo wajar (100 🪙 jika tak terhingga).

---

## 🤖 Spesifikasi J0ssy Bot AI (Groq API)
* **Model LLM**: \`GPT-OSS 20b\`
* **Kapasitas Baterai**:
  * \`> 20%\`: Siap digunakan untuk auto-care & chat interaktif.
  * \`< 20%\`: Indikator berkedip, perlu dimatikan dan dicas.
  * \`0%\`: Nonaktif otomatis darurat, butuh pengisian manual.
`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl sm:max-w-4xl bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 text-white flex items-center justify-between border-b border-amber-500/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg ring-2 ring-amber-300">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base sm:text-lg tracking-wide text-amber-300">
                  ADMIN PANEL CONTROL CENTER
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold uppercase border border-emerald-400/30">
                  AKTIF SELAMANYA
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Mode Pengembang Tamagotchi 3D Bebas Hambatan
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playBeep();
              onClose();
            }}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-rose-600/80 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="Tutup Menu Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => {
              soundFx.playBeep();
              setActiveTab('shop');
            }}
            className={`py-2 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Toko &amp; Harga</span>
          </button>

          <button
            onClick={() => {
              soundFx.playBeep();
              setActiveTab('game');
            }}
            className={`py-2 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'game'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Mode Kebal</span>
          </button>

          <button
            onClick={() => {
              soundFx.playBeep();
              setActiveTab('stats');
            }}
            className={`py-2 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Kebutuhan</span>
          </button>

          <button
            onClick={() => {
              soundFx.playBeep();
              setActiveTab('coins');
            }}
            className={`py-2 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'coins'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Koin Emas</span>
          </button>

          <button
            onClick={() => {
              soundFx.playBeep();
              setActiveTab('unlock');
            }}
            className={`py-2 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'unlock'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Buka Semua</span>
          </button>

          <button
            onClick={() => {
              soundFx.playBeep();
              setActiveTab('markdown');
            }}
            className={`py-2 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'markdown'
                ? 'bg-teal-400 text-slate-950 shadow-md'
                : 'text-teal-400/80 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dokumentasi Markdown</span>
          </button>

          <button
            onClick={() => {
              soundFx.playBeep();
              setActiveTab('reset');
            }}
            className={`py-2 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'reset'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-rose-400 hover:bg-slate-800 hover:text-white'
            }`}
          ></button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: TOKO & HARGA */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-xl">
                      🏷️
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm text-white">
                        Mode Belanja Gratis (Semua Rp 0 🪙)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Aksesoris, makanan, tarian joget &amp; J0ssy bot dapat dibeli gratis tanpa
                        koin!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playSparkle();
                      onUpdateAdminState((prev) => ({ ...prev, freeShopping: !prev.freeShopping }));
                    }}
                    className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${adminState.freeShopping ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform transform absolute top-1 ${adminState.freeShopping ? 'translate-x-7' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed space-y-1.5">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Status Toko Saat Ini:
                </p>
                <p>
                  {adminState.freeShopping ? (
                    <span className="text-emerald-400 font-bold">
                      ✅ AKTIF: Semua barang di toko seharga 0 Koin (Bebas Borong Apapun!).
                    </span>
                  ) : (
                    <span className="text-slate-300">
                      Normal: Menggunakan harga standar toko (Bisa diaktifkan toggle di atas kapan
                      saja).
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: MODE KEBAL MINI-GAME */}
          {activeTab === 'game' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-xl">
                      🛡️
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm text-white">
                        Mode Kebal / God Mode Mini-Game
                      </h4>
                      <p className="text-xs text-slate-400">
                        Bom tidak mengurangi nyawa sama sekali, dan tebak kotak otomatis menang!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playSparkle();
                      onUpdateAdminState((prev) => ({
                        ...prev,
                        invincibleMiniGame: !prev.invincibleMiniGame,
                      }));
                    }}
                    className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${adminState.invincibleMiniGame ? 'bg-cyan-500' : 'bg-slate-700'}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-white transition-transform transform absolute top-1 ${adminState.invincibleMiniGame ? 'translate-x-7' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200/90 leading-relaxed space-y-1.5">
                <p className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Efek God Mode di Mini Game:
                </p>
                <p>
                  • Penangkap Cemilan: Bom 💣 yang mengenaimu akan memantul dan memberi +5 poin
                  bonus tanpa mati.
                </p>
                <p>
                  • Kotak Beruntung: Kotak pemenang ditandai dengan lingkaran emas bercahaya
                  langsung.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: KEBUTUHAN HEWAN */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {/* Max all button */}
              <button
                onClick={() => {
                  if (!currentPetId) return;
                  soundFx.playSparkle();
                  onUpdatePetStats(currentPetId, {
                    hunger: 100,
                    energy: 100,
                    hygiene: 100,
                    happiness: 100,
                    love: 100,
                  });
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:opacity-95 text-slate-950 font-heading font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>MAKSIMALKAN SEMUA KEBUTUHAN (100% SEMPURNA)</span>
              </button>

              {/* Freeze toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-white">
                    Bekukan Bar Kebutuhan (Anti Lapar/Turun)
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Kebutuhan hewan tidak akan pernah berkurang seiring waktu.
                  </p>
                </div>
                <button
                  onClick={() => {
                    soundFx.playSparkle();
                    onUpdateAdminState((prev) => ({ ...prev, freezeStats: !prev.freezeStats }));
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${adminState.freezeStats ? 'bg-teal-500' : 'bg-slate-700'}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform transform absolute top-1 ${adminState.freezeStats ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              {/* Sliders for current pet */}
              {activePet && (
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-3.5">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Sesuaikan Bar {activePet.name}:
                  </span>

                  {/* 1. Kenyang */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-amber-400">🍖 Kenyang (Hunger):</span>
                      <span>{Math.round(activePet.stats.hunger)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(activePet.stats.hunger)}
                      onChange={(e) =>
                        onUpdatePetStats(currentPetId, { hunger: Number(e.target.value) })
                      }
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  {/* 2. Energi */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-400">⚡ Energi (Energy):</span>
                      <span>{Math.round(activePet.stats.energy)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(activePet.stats.energy)}
                      onChange={(e) =>
                        onUpdatePetStats(currentPetId, { energy: Number(e.target.value) })
                      }
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>

                  {/* 3. Kebersihan */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-sky-400">🫧 Kebersihan (Hygiene):</span>
                      <span>{Math.round(activePet.stats.hygiene)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(activePet.stats.hygiene)}
                      onChange={(e) =>
                        onUpdatePetStats(currentPetId, { hygiene: Number(e.target.value) })
                      }
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                  </div>

                  {/* 4. Kebahagiaan */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-pink-400">💖 Kebahagiaan (Happiness):</span>
                      <span>{Math.round(activePet.stats.happiness)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(activePet.stats.happiness)}
                      onChange={(e) =>
                        onUpdatePetStats(currentPetId, { happiness: Number(e.target.value) })
                      }
                      className="w-full accent-pink-400 cursor-pointer"
                    />
                  </div>

                  {/* 5. Kasih Sayang */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-rose-400">❤️ Kasih Sayang (Love):</span>
                      <span>{Math.round(activePet.stats.love)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(activePet.stats.love)}
                      onChange={(e) =>
                        onUpdatePetStats(currentPetId, { love: Number(e.target.value) })
                      }
                      className="w-full accent-rose-400 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: KOIN & INFINITY */}
          {activeTab === 'coins' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase">
                  Saldo Koin Saat Ini:
                </span>
                <p className="text-3xl font-heading font-black text-amber-400">
                  {coins >= 999999999
                    ? '∞ (999.999.999 🪙)'
                    : `${coins.toLocaleString('id-ID')} 🪙`}
                </p>
              </div>

              {/* Infinite Coins Button */}
              <button
                onClick={() => {
                  soundFx.playLevelUp();
                  onSetCoins(999999999);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-yellow-400 hover:opacity-95 text-slate-950 font-heading font-black text-sm tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <InfinityIcon className="w-5 h-5 text-slate-950" />
                <span>KOIN TAK TERBATAS (∞ 999.999.999 🪙)</span>
              </button>

              {/* Preset buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    soundFx.playCoin();
                    onSetCoins(coins + 10000);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs cursor-pointer"
                >
                  +10.000 🪙
                </button>
                <button
                  onClick={() => {
                    soundFx.playCoin();
                    onSetCoins(coins + 100000);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs cursor-pointer"
                >
                  +100.000 🪙
                </button>
                <button
                  onClick={() => {
                    soundFx.playCoin();
                    onSetCoins(coins + 1000000);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-xs cursor-pointer"
                >
                  +1.000.000 🪙
                </button>
              </div>

              {/* Custom input */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Ketik jumlah koin..."
                  value={customCoinInput}
                  onChange={(e) => setCustomCoinInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => {
                    const parsed = parseInt(customCoinInput, 10);
                    if (!isNaN(parsed) && parsed >= 0) {
                      soundFx.playCoin();
                      onSetCoins(parsed);
                      setCustomCoinInput('');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: BUKA SEMUA (UNLOCK ALL) */}
          {activeTab === 'unlock' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <h4 className="font-heading font-black text-sm text-amber-300 flex items-center gap-2">
                  <Unlock className="w-4 h-4" />
                  Buka Seluruh Koleksi &amp; Konten Sekaligus
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Menekan tombol di bawah akan seketika membuka seluruh topi aksesoris, semua tarian
                  panggung joget, robot AI J0ssy bot (baterai 100%), dan semua prestasi penghargaan.
                </p>

                <button
                  onClick={() => {
                    soundFx.playLevelUp();
                    onUnlockAllContent();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-heading font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span>BUKA SEMUA AKSESORIS, TARIAN &amp; ROBOT AI</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700">
                  <span className="font-bold text-white block mb-0.5">Topi &amp; Aksesoris:</span>
                  Semua topi (Mahkota, Bola, Ninja, dll) langsung tersedia di lemarimu.
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700">
                  <span className="font-bold text-white block mb-0.5">Panggung Joget:</span>
                  Semua gerakan (Breakdance, Disco, Moonwalk, Wiggle) langsung terbuka.
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700">
                  <span className="font-bold text-white block mb-0.5">J0ssy Bot AI:</span>
                  Langsung menjadi milikmu dengan kapasitas baterai 100% penuh.
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700">
                  <span className="font-bold text-white block mb-0.5">Prestasi &amp; Hadiah:</span>
                  Semua medali pencapaian otomatis terisi lengkap.
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DOKUMENTASI MARKDOWN */}
          {activeTab === 'markdown' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-teal-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-black text-sm text-teal-300 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Dokumentasi Pengembang &amp; Sintaks Markdown
                    </h4>
                    <p className="text-xs text-slate-300">
                      Spesifikasi teknis, cheatsheet markdown, dan panduan arsitektur sistem Admin
                      Panel.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(adminMarkdownDocs);
                      setCopiedDocs(true);
                      soundFx.playBeep();
                      setTimeout(() => setCopiedDocs(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-400/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedDocs ? 'Tersalin! ✅' : 'Salin Markdown'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 markdown-body text-xs text-slate-300 max-h-[380px] overflow-y-auto leading-relaxed shadow-inner">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(adminMarkdownDocs, { async: false }),
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: RESET (Mengembalikan Modifikasi Admin ke Semula) */}
          {activeTab === 'reset' && (
            <div className="space-y-4">
              {/* Primary User Action: Revert Admin Modifications */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900 border-2 border-amber-400/60 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-xl shadow-md">
                    🔄
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-sm sm:text-base text-amber-300">
                      Kembalikan Modifikasi Admin ke Semula
                    </h4>
                    <p className="text-xs text-slate-300">
                      Menormalkan seluruh fitur cheat yang diubah lewat Admin Panel tanpa menghapus
                      akun/game.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-700/80 space-y-2 text-xs text-slate-300">
                  <span className="font-bold text-amber-200 block mb-1">
                    Yang akan dikembalikan ke kondisi standar:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-emerald-400 font-bold">✓</span> Belanja Gratis
                      dinonaktifkan (harga normal)
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-emerald-400 font-bold">✓</span> Mode Kebal mini-game
                      dimatikan
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-emerald-400 font-bold">✓</span> Pembekuan kebutuhan
                      dinonaktifkan
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-emerald-400 font-bold">✓</span> Bar kebutuhan pet
                      kembali sehat prima
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-emerald-400 font-bold">✓</span> Saldo koin dinormalkan
                      kembali ke 100 🪙
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-emerald-400 font-bold">✓</span> Harga khusus toko
                      direset ke katalog
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium pt-1 border-t border-slate-800">
                    🛡️ Hewan kesayanganmu, level, topi, tarian joget, dan catatan jurnal tetap
                    tersimpan aman!
                  </p>
                </div>

                <button
                  onClick={() => {
                    soundFx.playSparkle();
                    if (onResetAdminModifications) {
                      onResetAdminModifications();
                    } else {
                      onResetAdminCheats();
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-heading font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-slate-950" />
                  <span>KEMBALIKAN SEMUA MODIFIKASI ADMIN KE SEMULA 🔄</span>
                </button>
              </div>

              {/* Optional Secondary Action: Factory Wipe */}
              <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Hapus Data Total (Reset Pabrik Game)</span>
                  </div>
                  {!confirmResetOpen && (
                    <button
                      onClick={() => setConfirmResetOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-[11px] font-bold cursor-pointer"
                    >
                      Buka Pilihan
                    </button>
                  )}
                </div>

                {confirmResetOpen && (
                  <div className="p-3 bg-rose-900/60 rounded-xl border border-rose-500 space-y-2 text-xs">
                    <p className="font-bold text-rose-100">
                      PERINGATAN: Opsi ini menghapus seluruh simpanan permainan dari awal. Gunakan
                      hanya jika ingin mulai ulang total.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onResetGameFactory();
                        }}
                        className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer"
                      >
                        Ya, Hapus Semuanya
                      </button>
                      <button
                        onClick={() => setConfirmResetOpen(false)}
                        className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
