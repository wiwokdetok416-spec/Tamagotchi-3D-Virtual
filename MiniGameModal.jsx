import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../audio/soundEffects';
import { X, Play, RotateCcw, Trophy, Star, Sparkles, Award } from 'lucide-react';
export const MiniGameModal = ({ petId, petName, isInvincible = false, onClose, onReward }) => {
  const [selectedGame, setSelectedGame] = useState('catcher');
  // --- Game 1: Star & Snack Catcher State ---
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [catcherX, setCatcherX] = useState(50); // percentage 0 - 100
  const gameAreaRef = useRef(null);
  const [fallingItems, setFallingItems] = useState([]);
  // --- Game 2: Lucky Box Guess State ---
  const [boxState, setBoxState] = useState('select');
  const [winningBox, setWinningBox] = useState(1);
  const [pickedBox, setPickedBox] = useState(null);
  const [boxWinStreak, setBoxWinStreak] = useState(0);
  // Snack catcher loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    let nextItemId = 1;
    const spawnInterval = setInterval(() => {
      const isStar = Math.random() < 0.25;
      const isBomb = Math.random() < 0.2;
      const snackEmoji = petId === 'milo' ? '🦴' : petId === 'fizzi' ? '✨' : '🐟';
      const newItem = {
        id: nextItemId++,
        x: 10 + Math.random() * 80,
        y: 0,
        type: isBomb ? 'bomb' : isStar ? 'star' : 'snack',
        emoji: isBomb ? '💣' : isStar ? '⭐' : snackEmoji,
        speed: 1.8 + Math.random() * 1.5,
      };
      setFallingItems((prev) => [...prev.slice(-15), newItem]);
    }, 900);
    const fallInterval = setInterval(() => {
      setFallingItems((prev) => {
        const next = [];
        prev.forEach((item) => {
          const newY = item.y + item.speed;
          // Check collision with catcher at y >= 82%
          if (newY >= 82 && newY <= 94) {
            const dist = Math.abs(item.x - catcherX);
            if (dist < 14) {
              // Collided!
              if (item.type === 'bomb') {
                if (isInvincible) {
                  // Mode Kebal Admin: immune to bomb damage, deflects & awards bonus!
                  soundFx.playSparkle();
                  setScore((s) => s + 10);
                } else {
                  soundFx.playBeep(220, 0.2);
                  setLives((l) => {
                    const nl = l - 1;
                    if (nl <= 0) {
                      setGameState('gameover');
                    }
                    return nl;
                  });
                }
              } else if (item.type === 'star') {
                soundFx.playSparkle();
                setScore((s) => s + 25);
              } else {
                soundFx.playEat();
                setScore((s) => s + 10);
              }
              return; // item caught
            }
          }
          if (newY > 100) {
            // Fell off bottom
            if (item.type !== 'bomb') {
              // Missed snack
            }
            return;
          }
          next.push({ ...item, y: newY });
        });
        return next;
      });
    }, 35);
    return () => {
      clearInterval(spawnInterval);
      clearInterval(fallInterval);
    };
  }, [gameState, catcherX, petId]);
  // Keyboard controls for catcher
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setCatcherX((x) => Math.max(10, x - 9));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setCatcherX((x) => Math.min(90, x + 9));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);
  const startGame = () => {
    setScore(0);
    setLives(3);
    setFallingItems([]);
    setCatcherX(50);
    setGameState('playing');
    soundFx.playSelect();
  };
  const handleFinishCatcher = () => {
    const earnedCoins = Math.max(15, Math.floor(score / 2));
    const happiness = Math.min(40, Math.floor(score / 3));
    onReward(earnedCoins, happiness, score);
    soundFx.playLevelUp();
    onClose();
  };
  // Lucky box guess logic
  const handlePickBox = (boxIndex) => {
    if (boxState !== 'select') return;
    setPickedBox(boxIndex);
    setBoxState('shuffling');
    soundFx.playBeep(520, 0.1);
    setTimeout(() => {
      // In god mode, the picked box is always guaranteed to win!
      const winner = isInvincible ? boxIndex : Math.floor(Math.random() * 3);
      setWinningBox(winner);
      setBoxState('revealed');
      if (boxIndex === winner) {
        soundFx.playLevelUp();
        setBoxWinStreak((s) => s + 1);
        onReward(30, 25, 50);
      } else {
        soundFx.playBeep(280, 0.15);
      }
    }, 700);
  };
  const resetBoxGame = () => {
    setPickedBox(null);
    setBoxState('select');
  };
  const petEmoji = petId === 'milo' ? '🐶' : petId === 'fizzi' ? '🐟' : '🐱';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-300 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-100" />
            <div>
              <h3 className="font-heading font-bold text-lg leading-tight">
                Area Bermain Mini-Game
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                Bermain bersama {petName} untuk raih koin!
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

        {/* Tab Selection */}
        <div className="flex border-b border-amber-100 bg-amber-50/50 p-1.5 gap-1.5">
          <button
            onClick={() => {
              soundFx.playBeep();
              setSelectedGame('catcher');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedGame === 'catcher'
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:bg-amber-100/60'
            }`}
          >
            <Star className="w-4 h-4" /> Tangkap Bintang
          </button>
          <button
            onClick={() => {
              soundFx.playBeep();
              setSelectedGame('box_guess');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedGame === 'box_guess'
                ? 'bg-amber-400 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:bg-amber-100/60'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Tebak Kotak Hadiah
          </button>
        </div>

        {/* Game 1: Snack & Star Catcher */}
        {selectedGame === 'catcher' && (
          <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
            {gameState === 'ready' && (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-4xl shadow-inner border-2 border-amber-300">
                  {petEmoji}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xl text-slate-800">
                    Tangkap Makanan &amp; Bintang!
                  </h4>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                    Gerakkan {petName} ke kiri dan kanan untuk menangkap cemilan dan bintang emas.
                    Hindari bom!
                  </p>
                </div>
                <div className="flex justify-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span>🦴/🐟/✨ +10 Skor</span>
                  <span>⭐ +25 Skor</span>
                  <span className="text-rose-500">💣 -1 Nyawa</span>
                </div>
                <button
                  onClick={startGame}
                  className="btn-tactile w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base"
                >
                  <Play className="w-5 h-5 fill-current" /> Mulai Main Sekarang!
                </button>
              </div>
            )}

            {gameState === 'playing' && (
              <div className="flex-1 flex flex-col">
                {/* Stats Bar */}
                <div className="flex justify-between items-center bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold mb-2">
                  <div className="flex items-center gap-1 text-amber-300">
                    <Trophy className="w-4 h-4" /> Skor: {score}
                  </div>
                  {isInvincible && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-extrabold flex items-center gap-1">
                      🛡️ KEBAL AKTIF
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-rose-300">
                    Nyawa: {isInvincible ? '🛡️ TAK TERBATAS' : '❤️'.repeat(Math.max(0, lives))}
                  </div>
                </div>

                {/* 2D Canvas Fall Zone */}
                <div
                  ref={gameAreaRef}
                  onClick={(e) => {
                    if (!gameAreaRef.current) return;
                    const rect = gameAreaRef.current.getBoundingClientRect();
                    const clickPct = ((e.clientX - rect.left) / rect.width) * 100;
                    setCatcherX(Math.max(10, Math.min(90, clickPct)));
                  }}
                  className="relative flex-1 min-h-[220px] bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100 rounded-2xl border-2 border-sky-300 overflow-hidden cursor-pointer select-none"
                >
                  {/* Falling items */}
                  {fallingItems.map((item) => (
                    <div
                      key={item.id}
                      className="absolute transform -translate-x-1/2 text-2xl filter drop-shadow-sm pointer-events-none transition-transform"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                      }}
                    >
                      {item.emoji}
                    </div>
                  ))}

                  {/* Catcher Avatar */}
                  <div
                    className="absolute bottom-2 transform -translate-x-1/2 transition-all duration-75 flex flex-col items-center"
                    style={{ left: `${catcherX}%` }}
                  >
                    <div className="text-3xl filter drop-shadow-md">{petEmoji}</div>
                    <div className="w-12 h-2.5 bg-amber-400 rounded-full border border-amber-600 shadow-sm"></div>
                  </div>
                </div>

                {/* Touch Controls for Mobile/Older devices */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setCatcherX((x) => Math.max(10, x - 15))}
                    className="btn-tactile flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm"
                  >
                    ◀ Kiri
                  </button>
                  <button
                    onClick={() => setCatcherX((x) => Math.min(90, x + 15))}
                    className="btn-tactile flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm"
                  >
                    Kanan ▶
                  </button>
                </div>
              </div>
            )}

            {gameState === 'gameover' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl">
                  🏆
                </div>
                <div>
                  <h4 className="font-heading font-bold text-2xl text-slate-800">
                    Permainan Selesai!
                  </h4>
                  <p className="text-slate-500 text-sm mt-1">
                    Kamu dan {petName} bermain dengan sangat hebat!
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-xs mx-auto space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Skor Akhir:</span>
                    <span className="font-heading font-bold text-slate-800 text-base">
                      {score} Poin
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-amber-700 font-medium">Hadiah Koin:</span>
                    <span className="font-heading font-bold text-amber-600 text-base">
                      +{Math.max(15, Math.floor(score / 2))} 🪙
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-rose-600 font-medium">Bonus Kebahagiaan:</span>
                    <span className="font-heading font-bold text-rose-500 text-base">
                      +{Math.min(40, Math.floor(score / 3))}% ❤️
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={startGame}
                    className="btn-tactile flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-heading font-bold rounded-xl flex items-center justify-center gap-1.5 text-sm"
                  >
                    <RotateCcw className="w-4 h-4" /> Main Lagi
                  </button>
                  <button
                    onClick={handleFinishCatcher}
                    className="btn-tactile flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-heading font-bold rounded-xl shadow-md text-sm"
                  >
                    Klaim Hadiah 🎁
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Game 2: Lucky Box Guess */}
        {selectedGame === 'box_guess' && (
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="text-center space-y-2">
              <h4 className="font-heading font-bold text-lg text-slate-800">
                Tebak Kotak Hadiah Berisi Koin Emas!
              </h4>
              <p className="text-xs text-slate-500">
                Pilih salah satu dari 3 kotak keberuntungan. Tebak di mana koin emas disembunyikan!
              </p>
              {boxWinStreak > 0 && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  <Award className="w-3.5 h-3.5" /> Menang Beruntun: {boxWinStreak}x
                </div>
              )}
            </div>

            {/* 3 Gift Boxes */}
            <div className="grid grid-cols-3 gap-3 my-6">
              {[0, 1, 2].map((idx) => {
                const isPicked = pickedBox === idx;
                const isWinner = winningBox === idx;
                return (
                  <button
                    key={idx}
                    disabled={boxState !== 'select'}
                    onClick={() => handlePickBox(idx)}
                    className={`btn-tactile aspect-square rounded-2xl flex flex-col items-center justify-center p-3 border-2 transition-all relative ${
                      isPicked
                        ? 'border-amber-500 bg-amber-100 ring-4 ring-amber-300/40'
                        : 'border-slate-200 bg-slate-50 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="text-4xl transition-transform hover:scale-110">
                      {boxState === 'revealed' ? (isWinner ? '🪙' : '💨') : '🎁'}
                    </div>
                    <span className="text-xs font-bold text-slate-600 mt-2">Kotak {idx + 1}</span>
                    {boxState === 'revealed' && isWinner && (
                      <span className="absolute -top-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        +30 Koin!
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Status Feedback */}
            <div className="text-center min-h-[60px] flex items-center justify-center">
              {boxState === 'select' && (
                <p className="text-xs font-semibold text-slate-400">
                  Ketuk salah satu kotak di atas untuk membuka hadiah!
                </p>
              )}
              {boxState === 'shuffling' && (
                <p className="text-xs font-bold text-amber-600 animate-pulse">
                  Mengocok kotak hadiah... tunggu sebentar...
                </p>
              )}
              {boxState === 'revealed' && (
                <div>
                  {pickedBox === winningBox ? (
                    <div className="text-emerald-600 font-heading font-bold text-sm">
                      🎉 Hore! Tebakanmu benar! Kamu dan {petName} dapat 30 Koin Emas!
                    </div>
                  ) : (
                    <div className="text-rose-500 font-heading font-bold text-sm">
                      Ups, kotak ini kosong! Jangan menyerah, coba lagi!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer buttons */}
            {boxState === 'revealed' ? (
              <button
                onClick={resetBoxGame}
                className="btn-tactile w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-heading font-bold rounded-xl shadow-md text-sm"
              >
                Tebak Lagi! 🔄
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFx.playBeep();
                  onClose();
                }}
                className="w-full py-2.5 text-slate-500 hover:text-slate-700 font-bold text-xs"
              >
                Selesai Bermain
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
