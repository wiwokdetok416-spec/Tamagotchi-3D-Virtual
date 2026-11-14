import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import { PET_SPECIES, ACHIEVEMENTS_LIST } from '../services/storage';
import { soundFx } from '../audio/soundEffects';
import {
  X,
  BookOpen,
  Calendar,
  Award,
  PenTool,
  CheckCircle2,
  Plus,
  FileText,
  Sparkles,
  Code,
  Copy,
  Edit3,
} from 'lucide-react';
export const MarkdownModal = ({
  currentPetId,
  petName,
  diary,
  unlockedAchievements,
  coins,
  onAddDiaryEntry,
  onClaimAchievement,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('guide');
  const [isWritingNewEntry, setIsWritingNewEntry] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  // Playground state for custom markdown experimentation
  const [playgroundText, setPlaygroundText] = useState(`# 📝 Selamat Datang di Markdown Playground!

Ketik atau coba berbagai format **Markdown** di sini secara *langsung*.

## ✨ Fitur Game Terbaru
- 🤖 **J0ssy Bot AI**: Asisten robot pintar perawatan hewan!
- 💃 **Panggung Joget**: Coba gerakan tarian keren di toko!
- ⚡ **Admin Panel**: Jawab 5 kuis di toko untuk akses selamanya!
- 🔄 **Reset ke Semula**: Mengembalikan modifikasi cheat admin ke standar wajar tanpa hapus akun.

### 📋 Checklist Perawatan Hari Ini:
- [x] Beri makan ${petName}
- [x] Mandikan hingga wangi
- [ ] Ajak joget di panggung
- [ ] Cek kapasitas baterai J0ssy bot

> *"Sahabat sejati adalah mereka yang selalu setia menemani setiap hari."*

\`\`\`javascript
// Status pet saat ini
const petStatus = {
  name: "${petName}",
  status: "Sehat & Ceria",
  mood: "Bahagia ✨"
};
\`\`\`
`);
  const [playgroundView, setPlaygroundView] = useState('split');
  // Markdown Care Handbook Content
  const careGuideMarkdown = useMemo(() => {
    const petInfo = PET_SPECIES[currentPetId];
    return `# 📖 Ensiklopedia & Panduan Lengkap Tamagotchi 3D

Selamat datang di ensiklopedia resmi perawatan hewan kesayanganmu! Rawatlah sahabatmu dengan penuh kasih agar mereka selalu ceria, sehat, dan berkembang.

---

## 🐾 Profil Sahabat Pilihanmu: **${petName}**
* **Spesies**: ${petInfo.species}
* **Karakter Utama**: ${petInfo.nature}
* **Makanan Favorit**: ${petInfo.favoriteFood}
* **Kemampuan Spesial**: ${petInfo.specialSkill}

### 🦀 Karakter Baru: Patar, Si Kepiting Kasar
Kini hadir **Patar**, kepiting karang kasar bertempurung merah membara dan bercapit perkasa!
* **Kepribadian**: Ketus, judes, dan bicaranya kasar ala preman pantai, tapi aslinya tsundere setia yang sangat melindungi sahabatnya.
* **Aksi Unik**: Mengetuk capit perkasa (*klak-klak!*), berjalan miring lincah di lantai, dan berjoget heboh ala *Crab Rave*!
* **Makanan Favorit**: Rumput Laut Krispi segar dengan garam laut alami.

> *"Setiap hewan peliharaan memiliki kepribadian unik. Elus mereka setiap hari di ruang 3D untuk mempererat ikatan batin!"*

---

## 🤖 Panduan Robot AI: **J0ssy bot**
Robot pendamping cerdas yang dapat dibeli di Toko dengan harga 100.000 🪙:
* **Fitur AI Chat**: Klik tombol **J0ssy bot** untuk mengobrol santai atau meminta saran nutrisi hewanmu. AI ditenagai model performa tinggi Groq.
* **Kapasitas Baterai**:
  * **> 20%**: Baterai aman dan robot siap digunakan beraktivitas kapan saja.
  * **< 20%**: Peringatan baterai lemah! Segera matikan dan lakukan pengisian daya (cas).
  * **0% (Habis Total)**: Robot nonaktif darurat dan harus dicas manual hingga terisi penuh.
* **Mode Istirahat (Cas)**: Tekan tombol *"Matikan & Istirahatkan Robot (Cas)"* di dalam jendela J0ssy untuk mengisi ulang baterai.

---

## 💃 Panggung Joget & Emotikon Tarian
Sekarang hewan peliharaanmu bisa menari di atas panggung diskotek mini 3D:
* **Emotikon Gratis**: Semua pemain mendapatkan satu gerakan tari gratis (*Tarian Kaku Santai*).
* **Koleksi Tarian Keren**: Kunjungi Toko untuk membeli gerakan tari spektakuler seperti *Breakdance Spin*, *Disco Retro Fever*, *Moonwalk Smooth*, dan *Wiggle Ceria*!

---

## ⚡ Panduan Rahasia: Admin Panel & 5 Soal Matematika
Admin Panel adalah fitur istimewa untuk pengembang dan pemain kreatif:
1. **Syarat 1 (Minimal Level 5)**: Salah satu hewan peliharaanmu (Milo, Fizzi, Ngkur, atau Patar) harus mencapai **minimal Level 5** terlebih dahulu sebelum tombol ujian matematika aktif!
2. **Syarat 2 (Ujian 5 Soal Matematika)**: Buka Toko ➔ Tab **Admin Panel** ➔ Jawab **5 soal matematika acak** (tingkat Mudah, Sedang, Sulit, hingga Ekstrem) dan wajib **BENAR SEMUA (5/5)**.
3. **Akses Selamanya**: Begitu lulus kuis 5/5, kotak melayang **[⚡ Admin Panel]** akan muncul permanen di layar. Kotak ini dapat **diseret (drag)** ke mana saja dan diklik untuk membuka menu kendali.
4. **Fitur Admin**:
   * Kontrol harga toko atau aktifkan **Belanja Gratis (Free Shopping)**.
   * Aktifkan **Mode Kebal** di Mini-Game (kebal bom duri & otomatis menang di Kotak Hadiah).
   * Atur bar kebutuhan hewan sesuka hati atau bekukan agar tidak pernah berkurang.
   * Tambah koin emas hingga tak terhingga (∞).
   * Buka seluruh topi aksesoris, tarian, dan prestasi dalam satu klik.
5. **Fungsi "Reset ke Semula"**:
   * **PENTING**: Tombol ini **TIDAK menghapus data permainanmu**!
   * Fungsi tombol ini adalah **mengembalikan segala hal yang telah dimodifikasi melalui Admin Panel ke kondisi standar wajar** (mematikan belanja gratis, mematikan mode kebal, mencairkan status kebutuhan yang dibekukan, menormalkan koin, dan mengembalikan kebutuhan hewan ke kondisi sehat natural).

---

## 📱 Kompatibilitas HP & Komputer/Laptop
Game dirancang 100% responsif dan fleksibel:
* **Pengguna HP / Smartphone**: Tampilan proporsional, dock sentuh ergonomis, panel modal adaptif, dan kanvas 3D ramah sentuhan (touch gestures).
* **Pengguna PC / Laptop**: Layar penuh lega, kontrol mouse presisi, dan shortcut keyboard cepat (**1** Makan, **2** Mandi, **3** Tidur, **4** Joget, **5** Mini Game, **6** Toko, **Spasi** Elus Pet).

---

## 📊 Memahami Indikator Vital

| Indikator | Fungsi | Cara Meningkatkan |
| :--- | :--- | :--- |
| **🍗 Kenyang** | Energi perut pet | Beri makan biskuit, pelet, salmon, atau rumput laut krispi |
| **⚡ Energi** | Tenaga untuk beraktivitas | Matikan lampu & tidurkan pet di kasur empuk |
| **🫧 Kebersihan** | Bebas kuman & bau | Mandikan dengan sabun berbusa di menu Cuci |
| **💖 Kasih Sayang** | Ikatan batin dengan pemilik | Elus di ruang 3D, beri cemilan favorit |
| **😊 Kebahagiaan** | Semangat & keceriaan | Ajak bermain mini-game atau joget bareng |
| **🩺 Kesehatan** | Kondisi fisik pet | Jaga kebersihan dan jangan biarkan kelaparan |

---

## 📝 Cheatsheet Sintaks Markdown

| Format | Sintaks Markdown | Hasil Tampilan |
| :--- | :--- | :--- |
| **Tebal** | \`**teks tebal**\` | **teks tebal** |
| *Miring* | \`*teks miring*\` | *teks miring* |
| ~~Coret~~ | \`~~teks coret~~\` | ~~teks coret~~ |
| **Judul H1** | \`# Judul Utama\` | Judul Ukuran Besar |
| **Judul H2** | \`## Sub Judul\` | Judul Ukuran Sedang |
| **Kutipan** | \`> Kalimat inspiratif\` | Blok kutipan bergaris |
| **Kode** | \` \\\`kode singkat\\\` \` | Teks font monospaced |
| **Daftar Tugas** | \`- [x] Selesai\` | Kotak centang interaktif |

---

*Selamat merawat dan bersenang-senang bersama ${petName}!* ✨
`;
  }, [currentPetId, petName]);
  // Insert markdown tag helper for editor
  const insertTag = (prefix, suffix = '') => {
    setNewContent((prev) => `${prev}${prefix}teks${suffix}`);
  };
  const insertPlaygroundTag = (prefix, suffix = '') => {
    setPlaygroundText((prev) => `${prev}${prefix}teks${suffix}`);
  };
  const handleSaveDiary = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddDiaryEntry(newTitle.trim(), newContent.trim());
    setNewTitle('');
    setNewContent('');
    setIsWritingNewEntry(false);
    setPreviewMode(false);
    soundFx.playLevelUp();
  };
  const handleCopyPlaygroundToDiary = () => {
    onAddDiaryEntry(`Catatan Markdown: ${petName}`, playgroundText);
    soundFx.playLevelUp();
    setActiveTab('diary');
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-teal-400 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-teal-100" />
            <div>
              <h3 className="font-heading font-bold text-lg leading-tight">
                Pusat Informasi &amp; Buku Harian
              </h3>
              <p className="text-xs text-teal-100 font-medium">
                Format rapi dengan Markdown interaktif
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playBeep();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-teal-100 bg-teal-50/50 p-1.5 gap-1.5 overflow-x-auto">
          <button
            onClick={() => {
              soundFx.playBeep();
              setActiveTab('guide');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-teal-100/60'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Buku Panduan
          </button>
          <button
            onClick={() => {
              soundFx.playBeep();
              setActiveTab('diary');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'diary'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-teal-100/60'
            }`}
          >
            <Calendar className="w-4 h-4" /> Jurnal &amp; Diary
          </button>
          <button
            onClick={() => {
              soundFx.playBeep();
              setActiveTab('editor');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-teal-100/60'
            }`}
          >
            <Code className="w-4 h-4" /> Markdown Playground
          </button>
          <button
            onClick={() => {
              soundFx.playBeep();
              setActiveTab('achievements');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-teal-100/60'
            }`}
          >
            <Award className="w-4 h-4" /> Prestasi ({unlockedAchievements.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* TAB 1: GUIDE */}
          {activeTab === 'guide' && (
            <div
              className="markdown-body text-slate-700 text-sm"
              dangerouslySetInnerHTML={{
                __html: marked.parse(careGuideMarkdown, { async: false }),
              }}
            />
          )}

          {/* TAB 2: DIARY */}
          {activeTab === 'diary' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-teal-50 p-3 rounded-2xl border border-teal-200">
                <div>
                  <h4 className="font-heading font-bold text-sm text-teal-900">
                    Catatan Kenangan Bersama {petName}
                  </h4>
                  <p className="text-xs text-teal-700">
                    Tulis jurnal harianmu menggunakan format Markdown yang rapi!
                  </p>
                </div>
                {!isWritingNewEntry && (
                  <button
                    onClick={() => {
                      setIsWritingNewEntry(true);
                      soundFx.playBeep();
                    }}
                    className="btn-tactile px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Tulis Catatan Baru
                  </button>
                )}
              </div>

              {/* Write New Entry Box */}
              {isWritingNewEntry && (
                <form
                  onSubmit={handleSaveDiary}
                  className="bg-slate-50 border-2 border-teal-300 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <PenTool className="w-3.5 h-3.5 text-teal-600" /> Tulis Entri Markdown
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 px-2 py-1 rounded-md bg-teal-100"
                    >
                      {previewMode ? 'Mode Edit' : 'Pratinjau Markdown'}
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Judul Catatan (contoh: Hari Pertama Belajar Trik Duduk)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-400 text-sm font-semibold"
                  />

                  {/* Markdown Toolbar */}
                  {!previewMode && (
                    <div className="flex flex-wrap gap-1 bg-white p-1.5 rounded-lg border border-slate-200 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => insertTag('**', '**')}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 font-bold"
                        title="Tebal"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTag('*', '*')}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 italic"
                        title="Miring"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTag('### ')}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 font-bold"
                        title="Judul Kecil"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTag('- ')}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200"
                        title="Daftar Titik"
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        onClick={() => insertTag('> ')}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200"
                        title="Kutipan"
                      >
                        &ldquo; Kutipan
                      </button>
                    </div>
                  )}

                  {!previewMode ? (
                    <textarea
                      required
                      rows={5}
                      placeholder="Tuliskan pengalaman manismu hari ini... Kamu bisa gunakan **tebal**, *miring*, atau - daftar!"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-400 text-sm font-sans"
                    />
                  ) : (
                    <div className="min-h-[120px] p-3 rounded-xl bg-white border border-slate-200 markdown-body text-xs">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: marked.parse(newContent || '*Belum ada isi catatan...*', {
                            async: false,
                          }),
                        }}
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsWritingNewEntry(false);
                        setPreviewMode(false);
                      }}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn-tactile px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-heading font-bold text-xs rounded-xl shadow-xs"
                    >
                      Simpan ke Jurnal 💾
                    </button>
                  </div>
                </form>
              )}

              {/* Diary Timeline Entries */}
              <div className="space-y-3">
                {diary.length === 0 ? (
                  <p className="text-center py-6 text-slate-400 text-xs">
                    Belum ada catatan jurnal. Tulis sekarang untuk mengenang momen indah!
                  </p>
                ) : (
                  diary.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-all shadow-xs space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                          <h4 className="font-heading font-bold text-sm text-slate-800">
                            {entry.title}
                          </h4>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0">
                          {entry.dateStr}
                        </span>
                      </div>

                      <div
                        className="markdown-body text-xs text-slate-600 pl-6 border-l-2 border-teal-200"
                        dangerouslySetInnerHTML={{
                          __html: marked.parse(entry.markdownContent, {
                            async: false,
                          }),
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE MARKDOWN PLAYGROUND & EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              {/* Header Card with Template buttons */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-heading font-black text-sm text-teal-950 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-teal-600" />
                    Interactive Markdown Playground
                  </h4>
                  <p className="text-xs text-teal-700">
                    Ketik langsung dan saksikan konversi format Markdown secara real-time!
                  </p>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">Template:</span>
                  <button
                    onClick={() => {
                      setPlaygroundText(
                        `## 🐾 Laporan Harian: ${petName}\n\n* **Tanggal**: ${new Date().toLocaleDateString('id-ID')}\n* **Status Mood**: Ceria & Aktif 💖\n\n### 📝 Aktivitas Seru:\n1. Sarapan pelet lezat\n2. Mandi air hangat dengan gelembung busa\n3. Latihan joget lagu disco di panggung\n\n> "Pet yang dirawat dengan cinta akan selalu setia mendampingi!"`,
                      );
                    }}
                    className="px-2 py-1 rounded-lg bg-white border border-teal-300 text-teal-800 text-[11px] font-bold hover:bg-teal-100/60 cursor-pointer shadow-2xs"
                  >
                    🐾 Harian
                  </button>
                  <button
                    onClick={() => {
                      setPlaygroundText(
                        `## 🤖 Log Diagnostik J0ssy Bot AI\n\n| Komponen | Status | Nilai |\n| :--- | :--- | :--- |\n| **Model AI** | GPT-OSS 20b | Groq Ultra-Fast |\n| **Baterai** | Siap Pakai | Di atas 20% |\n| **Mode** | Standby Aktif | Respon Cepat |\n\n\`\`\`json\n{\n  "bot_name": "J0ssy bot",\n  "status": "ready",\n  "auto_care": true\n}\n\`\`\``,
                      );
                    }}
                    className="px-2 py-1 rounded-lg bg-white border border-teal-300 text-teal-800 text-[11px] font-bold hover:bg-teal-100/60 cursor-pointer shadow-2xs"
                  >
                    🤖 J0ssy Log
                  </button>
                </div>
              </div>

              {/* View layout mode switch + formatting toolbar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {/* Toolbar buttons */}
                  <div className="flex flex-wrap gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-300 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => insertPlaygroundTag('**', '**')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 font-bold border border-slate-200"
                      title="Tebal"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaygroundTag('*', '*')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 italic border border-slate-200"
                      title="Miring"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaygroundTag('~~', '~~')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 line-through border border-slate-200"
                      title="Coret"
                    >
                      S
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaygroundTag('# ')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 font-bold border border-slate-200"
                      title="Judul Utama"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaygroundTag('## ')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 font-bold border border-slate-200"
                      title="Sub Judul"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaygroundTag('> ')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200"
                      title="Kutipan"
                    >
                      &ldquo;
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaygroundTag('- ')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200"
                      title="Daftar Titik"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaygroundTag('- [ ] ')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200"
                      title="Checklist"
                    >
                      ☑
                    </button>
                    <button
                      type="button"
                      onClick={() => insertPlaygroundTag('`', '`')}
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200"
                      title="Kode Inline"
                    >
                      &lt;/&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertPlaygroundTag(
                          '\n| Kolom 1 | Kolom 2 |\n| :--- | :--- |\n| Data A | Data B |\n',
                        )
                      }
                      className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200"
                      title="Tabel"
                    >
                      Tabel
                    </button>
                  </div>

                  {/* View layout toggle */}
                  <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-bold text-slate-700">
                    <button
                      onClick={() => setPlaygroundView('split')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${playgroundView === 'split' ? 'bg-white shadow-xs text-teal-700' : 'hover:bg-slate-300'}`}
                    >
                      Berdampingan (Split)
                    </button>
                    <button
                      onClick={() => setPlaygroundView('edit')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${playgroundView === 'edit' ? 'bg-white shadow-xs text-teal-700' : 'hover:bg-slate-300'}`}
                    >
                      Editor
                    </button>
                    <button
                      onClick={() => setPlaygroundView('preview')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${playgroundView === 'preview' ? 'bg-white shadow-xs text-teal-700' : 'hover:bg-slate-300'}`}
                    >
                      Pratinjau
                    </button>
                  </div>
                </div>

                {/* Editor & Preview Panes */}
                <div
                  className={`grid gap-3 ${playgroundView === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}
                >
                  {/* Left: Input Textarea */}
                  {(playgroundView === 'split' || playgroundView === 'edit') && (
                    <div className="flex flex-col space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Edit3 className="w-3.5 h-3.5 text-teal-600" /> Editor Markdown (Teks
                        Mentah)
                      </span>
                      <textarea
                        rows={12}
                        value={playgroundText}
                        onChange={(e) => setPlaygroundText(e.target.value)}
                        placeholder="Tulis sintaks Markdown di sini..."
                        className="w-full p-3.5 rounded-2xl border-2 border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 font-mono text-xs text-slate-800 leading-relaxed outline-none shadow-inner bg-slate-50/50"
                      />
                    </div>
                  )}

                  {/* Right: Rendered HTML Markdown Preview */}
                  {(playgroundView === 'split' || playgroundView === 'preview') && (
                    <div className="flex flex-col space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Hasil Rendered Markdown
                      </span>
                      <div className="min-h-[220px] max-h-[340px] overflow-y-auto p-4 rounded-2xl bg-white border-2 border-teal-200/80 markdown-body text-xs text-slate-800 shadow-sm leading-relaxed">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: marked.parse(playgroundText || '*Teks kosong...*', {
                              async: false,
                            }),
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleCopyPlaygroundToDiary}
                    className="btn-tactile px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-heading font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Simpan Teks Ini ke Buku Harian (Diary) 📖</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex justify-between items-center text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Total Koin Kamu: {coins} 🪙
                </span>
                <span className="font-semibold text-amber-700">
                  Tercapai: {unlockedAchievements.length} / {ACHIEVEMENTS_LIST.length}
                </span>
              </div>

              {ACHIEVEMENTS_LIST.map((ach) => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                      isUnlocked
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 bg-slate-50 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                        {ach.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-slate-800">
                            {ach.title}
                          </h4>
                          {isUnlocked && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500 text-white flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Tercapai
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{ach.description}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-heading font-bold text-xs text-amber-600 block">
                        +{ach.rewardCoins} 🪙
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
