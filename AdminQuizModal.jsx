import React, { useState, useEffect } from 'react';
import { soundFx } from '../audio/soundEffects';
import { X, HelpCircle, CheckCircle2, AlertCircle, Sparkles, RotateCcw } from 'lucide-react';
const QUESTION_POOL = [
  // MUDAH (Aritmetika Dasar & Logika Cepat)
  {
    id: 'm1',
    difficulty: 'Mudah',
    difficultyColor: 'bg-emerald-500 text-white',
    question:
      'Jika Milo memiliki 45 biskuit lalu diberi tambahan 27 biskuit lagi, berapa total biskuit Milo sekarang?',
    options: ['62 biskuit', '72 biskuit', '75 biskuit', '82 biskuit'],
    correctIndex: 1,
    explanation: '45 + 27 = 72 biskuit.',
  },
  {
    id: 'm2',
    difficulty: 'Mudah',
    difficultyColor: 'bg-emerald-500 text-white',
    question: 'Berapa hasil dari operasi hitung: (15 × 4) - 20?',
    options: ['35', '40', '45', '50'],
    correctIndex: 1,
    explanation: '(15 × 4) = 60, lalu 60 - 20 = 40.',
  },
  {
    id: 'm3',
    difficulty: 'Mudah',
    difficultyColor: 'bg-emerald-500 text-white',
    question:
      'Patar si kepiting mengumpulkan 36 rumput laut dan membaginya rata ke dalam 4 wadah. Berapa isi masing-masing wadah?',
    options: ['7 rumput laut', '8 rumput laut', '9 rumput laut', '12 rumput laut'],
    correctIndex: 2,
    explanation: '36 ÷ 4 = 9 rumput laut di tiap wadah.',
  },
  {
    id: 'm4',
    difficulty: 'Mudah',
    difficultyColor: 'bg-emerald-500 text-white',
    question: 'Berapakah hasil dari penjumlahan: 175 + 325?',
    options: ['480', '490', '500', '520'],
    correctIndex: 2,
    explanation: '175 + 325 = 500 tepat!',
  },
  {
    id: 'm5',
    difficulty: 'Mudah',
    difficultyColor: 'bg-emerald-500 text-white',
    question: 'Jika 1 hari terdiri dari 24 jam, berapa jam total waktu dalam 3 hari penuh?',
    options: ['48 jam', '60 jam', '72 jam', '96 jam'],
    correctIndex: 2,
    explanation: '24 × 3 = 72 jam.',
  },
  // SEDANG (Urutan Operasi PEMDAS, Persentase, Aljabar Sederhana)
  {
    id: 's1',
    difficulty: 'Sedang',
    difficultyColor: 'bg-sky-500 text-white',
    question: 'Berapa hasil dari: 8 + 6 × 5 - (12 ÷ 3)?',
    options: ['34', '42', '66', '30'],
    correctIndex: 0,
    explanation:
      'Dahulukan perkalian & pembagian: 6 × 5 = 30 dan 12 ÷ 3 = 4. Maka 8 + 30 - 4 = 34!',
  },
  {
    id: 's2',
    difficulty: 'Sedang',
    difficultyColor: 'bg-sky-500 text-white',
    question: 'Berapakah 25% dari 240 koin emas?',
    options: ['50 koin', '60 koin', '70 koin', '80 koin'],
    correctIndex: 1,
    explanation: '25% = 1/4. 240 ÷ 4 = 60 koin emas.',
  },
  {
    id: 's3',
    difficulty: 'Sedang',
    difficultyColor: 'bg-sky-500 text-white',
    question: 'Jika 3x + 15 = 45, berapakah nilai x?',
    options: ['5', '10', '15', '20'],
    correctIndex: 1,
    explanation: '3x = 45 - 15 = 30, sehingga x = 30 ÷ 3 = 10.',
  },
  {
    id: 's4',
    difficulty: 'Sedang',
    difficultyColor: 'bg-sky-500 text-white',
    question: 'Tentukan bilangan berikutnya pada barisan geometri: 2, 6, 18, 54, ...?',
    options: ['108', '148', '162', '216'],
    correctIndex: 2,
    explanation: 'Pola dikali 3: 54 × 3 = 162.',
  },
  {
    id: 's5',
    difficulty: 'Sedang',
    difficultyColor: 'bg-sky-500 text-white',
    question:
      'Sebuah wadah balok memiliki panjang 8 cm, lebar 5 cm, dan tinggi 10 cm. Berapakah volume wadah tersebut?',
    options: ['200 cm³', '350 cm³', '400 cm³', '480 cm³'],
    correctIndex: 2,
    explanation: 'Volume = p × l × t = 8 × 5 × 10 = 400 cm³.',
  },
  // SULIT (Akar, Pangkat, Rasio, Soal Cerita Lanjutan)
  {
    id: 'u1',
    difficulty: 'Sulit',
    difficultyColor: 'bg-amber-500 text-slate-950 font-bold',
    question: 'Berapakah hasil dari: √144 + 3³ - 2⁴?',
    options: ['19', '21', '23', '27'],
    correctIndex: 2,
    explanation: '√144 = 12, 3³ = 27, 2⁴ = 16. Maka 12 + 27 - 16 = 23.',
  },
  {
    id: 'u2',
    difficulty: 'Sulit',
    difficultyColor: 'bg-amber-500 text-slate-950 font-bold',
    question:
      'Perbandingan koin Milo dan Ngkur adalah 3 : 5. Jika total koin mereka berdua 400 koin, berapa koin milik Ngkur?',
    options: ['150 koin', '200 koin', '250 koin', '300 koin'],
    correctIndex: 2,
    explanation: 'Total bagian = 3 + 5 = 8. Koin Ngkur = (5 ÷ 8) × 400 = 250 koin.',
  },
  {
    id: 'u3',
    difficulty: 'Sulit',
    difficultyColor: 'bg-amber-500 text-slate-950 font-bold',
    question:
      'Patar berjalan dengan kecepatan 15 meter/menit. Berapa jarak yang ditempuhnya dalam 1 jam 20 menit (80 menit)?',
    options: ['900 meter', '1.050 meter', '1.200 meter', '1.500 meter'],
    correctIndex: 2,
    explanation: 'Jarak = kecepatan × waktu = 15 meter/menit × 80 menit = 1.200 meter.',
  },
  {
    id: 'u4',
    difficulty: 'Sulit',
    difficultyColor: 'bg-amber-500 text-slate-950 font-bold',
    question: 'Jika 2^(x + 1) = 64, berapakah nilai dari x² - 5?',
    options: ['15', '20', '25', '31'],
    correctIndex: 1,
    explanation: '64 = 2⁶, maka x + 1 = 6 sehingga x = 5. Nilai x² - 5 = 5² - 5 = 25 - 5 = 20.',
  },
  {
    id: 'u5',
    difficulty: 'Sulit',
    difficultyColor: 'bg-amber-500 text-slate-950 font-bold',
    question: 'Berapakah hasil dari faktorial: (5! ÷ 3!) + 4! ?',
    options: ['36', '40', '44', '48'],
    correctIndex: 2,
    explanation: '5! ÷ 3! = 5 × 4 = 20. 4! = 24. Maka 20 + 24 = 44.',
  },
  // EKSTREM (Sistem Persamaan, Pythagoras, Logika Modulo, Aljabar Kuadrat)
  {
    id: 'e1',
    difficulty: 'Ekstrem',
    difficultyColor: 'bg-rose-600 text-white font-extrabold',
    question:
      'Dua bilangan memiliki jumlah 60 dan selisih 16. Berapakah hasil kali kedua bilangan tersebut?',
    options: ['724', '804', '836', '916'],
    correctIndex: 2,
    explanation:
      'x + y = 60 dan x - y = 16. Dijumlahkan: 2x = 76 → x = 38, y = 22. Hasil kali = 38 × 22 = 836.',
  },
  {
    id: 'e2',
    difficulty: 'Ekstrem',
    difficultyColor: 'bg-rose-600 text-white font-extrabold',
    question:
      'Sebuah segitiga siku-siku memiliki alas 12 cm dan tinggi 16 cm. Berapakah panjang sisi miringnya (hipotenusa)?',
    options: ['18 cm', '20 cm', '22 cm', '24 cm'],
    correctIndex: 1,
    explanation: 'c = √(12² + 16²) = √(144 + 256) = √400 = 20 cm.',
  },
  {
    id: 'e3',
    difficulty: 'Ekstrem',
    difficultyColor: 'bg-rose-600 text-white font-extrabold',
    question:
      'Sebuah item seharga 200 koin didiskon 20%, lalu didiskon lagi 10% dari harga setelah diskon pertama. Berapa harga akhirnya?',
    options: ['140 koin', '144 koin', '148 koin', '152 koin'],
    correctIndex: 1,
    explanation: 'Diskon pertama: 200 × 0.8 = 160 koin. Diskon kedua: 160 × 0.9 = 144 koin.',
  },
  {
    id: 'e4',
    difficulty: 'Ekstrem',
    difficultyColor: 'bg-rose-600 text-white font-extrabold',
    question:
      'Jika hari ini adalah hari Senin, maka 100 hari yang akan datang tepat jatuh pada hari apa?',
    options: ['Selasa', 'Rabu', 'Kamis', 'Jumat'],
    correctIndex: 1,
    explanation: '100 mod 7 = 2 (karena 7 × 14 = 98, sisa 2 hari). Senin + 2 hari = hari Rabu!',
  },
  {
    id: 'e5',
    difficulty: 'Ekstrem',
    difficultyColor: 'bg-rose-600 text-white font-extrabold',
    question: 'Jika fungsi f(n) = n² - 3n + 7, berapakah nilai dari f(12)?',
    options: ['105', '115', '125', '135'],
    correctIndex: 1,
    explanation: 'f(12) = 12² - (3 × 12) + 7 = 144 - 36 + 7 = 115.',
  },
];
export const AdminQuizModal = ({ onUnlockSuccess, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizState, setQuizState] = useState('answering');
  const [stepFeedback, setStepFeedback] = useState(null);
  // Initialize 5 randomized questions with mixed difficulties
  const startNewQuiz = () => {
    // Pick 1 Mudah, 2 Sedang, 1 Sulit, 1 Ekstrem (total 5)
    const mudah = QUESTION_POOL.filter((q) => q.difficulty === 'Mudah').sort(
      () => 0.5 - Math.random(),
    );
    const sedang = QUESTION_POOL.filter((q) => q.difficulty === 'Sedang').sort(
      () => 0.5 - Math.random(),
    );
    const sulit = QUESTION_POOL.filter((q) => q.difficulty === 'Sulit').sort(
      () => 0.5 - Math.random(),
    );
    const ekstrem = QUESTION_POOL.filter((q) => q.difficulty === 'Ekstrem').sort(
      () => 0.5 - Math.random(),
    );
    const picked = [mudah[0], sedang[0], sedang[1] || mudah[1], sulit[0], ekstrem[0]].filter(
      Boolean,
    );
    setQuestions(picked);
    setCurrentIndex(0);
    setSelectedOption(null);
    setQuizState('answering');
    setStepFeedback(null);
  };
  useEffect(() => {
    startNewQuiz();
  }, []);
  const currentQ = questions[currentIndex];
  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQ) return;
    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      soundFx.playSparkle();
      setStepFeedback({ isCorrect: true, explanation: currentQ.explanation });
      if (currentIndex + 1 >= 5) {
        // Answered all 5 questions correctly!!
        soundFx.playLevelUp();
        setQuizState('passed');
        onUnlockSuccess();
      } else {
        setQuizState('result_step');
      }
    } else {
      // Wrong answer! Failed attempt
      soundFx.playBeep(220, 0.3);
      setStepFeedback({ isCorrect: false, explanation: currentQ.explanation });
      setQuizState('failed');
    }
  };
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setStepFeedback(null);
    setCurrentIndex((prev) => prev + 1);
    setQuizState('answering');
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 text-white flex items-center justify-between shadow-md border-b border-amber-400/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shadow-inner">
              ⚡
            </div>
            <div>
              <h3 className="font-heading font-black text-lg tracking-wide flex items-center gap-1.5">
                Ujian 5 Soal Matematika: Admin Panel
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                Jawab 5 Soal Matematika Benar Semua (5/5) untuk Akses Selamanya!
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

        {/* Progress Tracker */}
        {quizState !== 'passed' && quizState !== 'failed' && (
          <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Pertanyaan {currentIndex + 1} dari 5
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold ${currentQ?.difficultyColor}`}
              >
                Tingkat: {currentQ?.difficulty}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex gap-1 p-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    i < currentIndex
                      ? 'bg-emerald-400'
                      : i === currentIndex
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Body content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* STATE 1: ANSWERING */}
          {quizState === 'answering' && currentQ && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <span className="text-xs font-bold text-slate-400 block mb-1">
                  SOAL #{currentIndex + 1}:
                </span>
                <p className="text-base font-bold text-white leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              <div className="space-y-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        soundFx.playBeep(440 + idx * 40, 0.08);
                        setSelectedOption(idx);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all font-medium text-sm flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md ring-2 ring-amber-400/30'
                          : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'}`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className={`w-full py-3.5 rounded-2xl font-heading font-extrabold text-sm uppercase tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  selectedOption !== null
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>Kirim Jawaban</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STATE 2: STEP RESULT (Correct step, proceed to next) */}
          {quizState === 'result_step' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/50 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-heading font-extrabold text-emerald-400">
                  BENAR SEKALI! 🎉
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                  {stepFeedback?.explanation}
                </p>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-xs text-amber-300 font-semibold">
                Tersisa {5 - (currentIndex + 1)} pertanyaan lagi untuk membuka Admin Panel
                selamanya!
              </div>
              <button
                onClick={handleNextQuestion}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-heading font-bold text-sm shadow-lg cursor-pointer"
              >
                Lanjut ke Pertanyaan Berikutnya ➡️
              </button>
            </div>
          )}

          {/* STATE 3: PASSED (All 5 correct!) */}
          {quizState === 'passed' && (
            <div className="space-y-4 text-center py-4 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-400 p-1 mx-auto shadow-2xl">
                <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-3xl">
                  ⚡👑
                </div>
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Ujian Selesai: 5/5 Benar Sempurna!
                </span>
                <h4 className="text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 mt-2">
                  ADMIN PANEL AKTIF SELAMANYA!
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-sm mx-auto">
                  Selamat! Kamu resmi menjadi penguasa developer Tamagotchi 3D! Kotak kecil
                  bertuliskan <span className="text-amber-400 font-bold">⚡ ADMIN</span> kini muncul
                  melayang di layar dan bisa kamu seret kemanapun!
                </p>
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-amber-500/40 text-left text-xs space-y-1.5 text-slate-300">
                <p className="font-bold text-amber-400">Fitur Hebat yang Terbuka:</p>
                <p>• 🛒 Kendalikan harga toko / belanja gratis Rp 0</p>
                <p>• 🛡️ Mode Kebal / God Mode di Mini-game</p>
                <p>• 📊 Atur & bekukan bar kebutuhan hewan sesukamu</p>
                <p>• 🪙 Koin tak terbatas (hingga ∞ 999.999.999)</p>
                <p>• 🔓 Buka semua aksesoris, tarian & robot AI seketika</p>
              </div>

              <button
                onClick={() => {
                  soundFx.playBeep();
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:opacity-95 text-slate-950 font-heading font-black text-sm tracking-wide shadow-xl cursor-pointer"
              >
                Tutup & Mulai Gunakan Admin Panel 🚀
              </button>
            </div>
          )}

          {/* STATE 4: FAILED (Wrong answer) */}
          {quizState === 'failed' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-400/50 mx-auto flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-heading font-extrabold text-rose-400">
                  JAWABAN KURANG TEPAT! ❌
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                  Syarat membuka Admin Panel adalah{' '}
                  <span className="font-bold text-white">5 dari 5 Benar Semua</span>.
                </p>
              </div>

              <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700 text-xs text-slate-300 text-left">
                <span className="font-bold text-amber-400 block mb-0.5">
                  Penjelasan Kunci Jawaban:
                </span>
                {stepFeedback?.explanation}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={startNewQuiz}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Ujian (Acak Soal Baru)</span>
                </button>
                <button
                  onClick={onClose}
                  className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  Tutup Dulu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
