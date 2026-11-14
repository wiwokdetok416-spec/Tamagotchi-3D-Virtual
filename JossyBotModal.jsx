import React, { useState, useRef, useEffect } from 'react';
import { soundFx } from '../audio/soundEffects';
import {
  X,
  Send,
  BatteryCharging,
  BatteryWarning,
  Battery,
  Power,
  Sparkles,
  Bot,
  Zap,
  Utensils,
  Droplets,
  Heart,
} from 'lucide-react';
export const JossyBotModal = ({
  pet,
  jossyState,
  onUpdateJossy,
  onFeedPet,
  onWashPet,
  onClose,
}) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `*Bzzzt! Beep-boop!* Halo sahabat! Aku J0ssy bot, asisten robot AI pribadimu. Ada yang bisa kubantu untuk merawat **${pet.name}** hari ini?`,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const battery = jossyState.battery;
  const isSleeping = jossyState.isSleeping;
  const isLow = battery < 20 && battery > 0;
  const isEmpty = battery <= 0;
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  // Handle Quick Assist
  const handleQuickFeed = () => {
    if (isEmpty) {
      soundFx.playBeep(300, 0.1);
      return;
    }
    soundFx.playSparkle();
    onFeedPet();
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `*Nguung!* Makanan siap disajikan untuk ${pet.name}! Perutnya sekarang semakin kenyang dan senang! 🍲✨`,
      },
    ]);
    // Small battery drain for assist work
    onUpdateJossy((prev) => ({
      ...prev,
      battery: Math.max(0, prev.battery - 3),
    }));
  };
  const handleQuickWash = () => {
    if (isEmpty) {
      soundFx.playBeep(300, 0.1);
      return;
    }
    soundFx.playSparkle();
    onWashPet();
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `*Swoosh!* Busa sabun wangi sudah membersihkan seluruh tubuh ${pet.name}! Kinclong 100%! 🫧✨`,
      },
    ]);
    onUpdateJossy((prev) => ({
      ...prev,
      battery: Math.max(0, prev.battery - 3),
    }));
  };
  // Toggle Rest & Charge mode
  const handleToggleSleep = () => {
    soundFx.playBeep(isSleeping ? 700 : 450, 0.1);
    onUpdateJossy((prev) => ({
      ...prev,
      isSleeping: !prev.isSleeping,
    }));
  };
  // Manual Quick Charge
  const handleManualCharge = () => {
    soundFx.playSparkle();
    onUpdateJossy((prev) => ({
      ...prev,
      battery: Math.min(100, prev.battery + 25),
    }));
  };
  // Send Chat message
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMsg).trim();
    if (!text || isLoading) return;
    if (isEmpty) {
      soundFx.playBeep(250, 0.15);
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: text },
        {
          role: 'assistant',
          content:
            '... [J0ssy bot kehabisan daya dan mati. Silakan tekan tombol Cas Manual di atas untuk mengaktifkan kembali!] 🔌⚡',
        },
      ]);
      setInputMsg('');
      return;
    }
    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputMsg('');
    setIsLoading(true);
    soundFx.playBeep(500, 0.08);
    try {
      const response = await fetch('/api/jossy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          petContext: {
            name: pet.name,
            species: pet.id,
            level: pet.level,
            stats: pet.stats,
            isSleeping: pet.isSleeping,
          },
          botBattery: battery,
        }),
      });
      if (!response.ok) {
        throw new Error('Gagal menghubungi J0ssy server');
      }
      const data = await response.json();
      const botReply = data.reply || '*Beep-boop!* Aku siap membantumu kapan saja!';
      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
      soundFx.playLevelUp();
      // Drain small battery on chat
      onUpdateJossy((prev) => ({
        ...prev,
        battery: Math.max(0, prev.battery - 2),
      }));
    } catch (err) {
      console.warn('Jossy chat fallback:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `*Bzzzt!* Sistem lokal J0ssy bot tetap aktif: ${pet.name} terlihat ceria! Jangan lupa jaga tingkat kenyang (${pet.stats.hunger}%) dan kebahagiaannya (${pet.stats.happiness}%) ya! 🤖✨`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-cyan-400 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-700 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner text-2xl relative">
              <Bot className="w-7 h-7 text-cyan-200" />
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  isEmpty
                    ? 'bg-rose-500'
                    : isLow
                      ? 'bg-amber-400 animate-ping'
                      : isSleeping
                        ? 'bg-emerald-400'
                        : 'bg-cyan-300'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg leading-tight tracking-wide">
                  J0ssy bot
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/30 text-cyan-100 border border-cyan-300/40">
                  AI Groq 20B
                </span>
              </div>
              <p className="text-xs text-cyan-100 font-medium">
                Asisten Robot Pintar &amp; Pendamping Setia
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

        {/* Battery & Energy Status Bar */}
        <div className="px-4 py-3 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold">
              {isEmpty ? (
                <Battery className="w-4 h-4 text-rose-500 animate-pulse" />
              ) : isLow ? (
                <BatteryWarning className="w-4 h-4 text-amber-400 animate-bounce" />
              ) : isSleeping ? (
                <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <Battery className="w-4 h-4 text-cyan-400" />
              )}
              <span>Kapasitas Baterai: {battery}%</span>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isEmpty
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : isLow
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : isSleeping
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {isEmpty
                ? 'Mati (Habis)'
                : isLow
                  ? 'Baterai Rendah (<20%)'
                  : isSleeping
                    ? 'Sedang Dicas ⚡'
                    : 'Siap & Aktif'}
            </span>
          </div>

          {/* Progress gauge */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isEmpty
                  ? 'bg-rose-500'
                  : isLow
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                    : isSleeping
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${Math.max(4, battery)}%` }}
            />
          </div>

          {/* Status Hint */}
          <div className="mt-2 text-[11px] flex items-center justify-between gap-2">
            <p className="text-slate-300 leading-tight">
              {isEmpty ? (
                <span className="text-rose-400 font-semibold">
                  ⚠️ Baterai habis! J0ssy bot mati. Segera cas manual agar bisa digunakan kembali.
                </span>
              ) : isLow ? (
                <span className="text-amber-300 font-semibold">
                  ⚠️ Kapasitas baterai di bawah 20%! Matikan &amp; cas sebelum kehabisan.
                </span>
              ) : isSleeping ? (
                <span className="text-emerald-300 font-semibold">
                  ⚡ J0ssy bot sedang istirahat mengisi daya hingga 100%.
                </span>
              ) : (
                <span className="text-slate-300">
                  Kapasitas di atas 20%—J0ssy bot siap membantu merawat {pet.name}!
                </span>
              )}
            </p>

            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={handleToggleSleep}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all ${
                  isSleeping
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                {isSleeping ? 'Bangunkan' : 'Istirahatkan'}
              </button>
              <button
                onClick={handleManualCharge}
                className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center gap-1 transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Cas (+25%)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Assist Toolbar */}
        <div className="px-4 py-2.5 bg-cyan-50/70 border-b border-cyan-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-extrabold text-cyan-900 shrink-0 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> Bantuan Robot:
          </span>
          <button
            onClick={handleQuickFeed}
            disabled={isEmpty}
            className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 shrink-0 transition-all ${
              isEmpty
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200 shadow-xs'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-amber-500" /> Beri Makan
          </button>
          <button
            onClick={handleQuickWash}
            disabled={isEmpty}
            className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 shrink-0 transition-all ${
              isEmpty
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 hover:bg-sky-100 border border-sky-200 shadow-xs'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-sky-500" /> Mandikan
          </button>
          <button
            onClick={() =>
              handleSendMessage(
                'Bagaimana kondisi hewan peliharaanku sekarang dan apa saran terbaikmu?',
              )
            }
            disabled={isEmpty}
            className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 shrink-0 transition-all ${
              isEmpty
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white text-slate-700 hover:bg-pink-100 border border-pink-200 shadow-xs'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-pink-500" /> Cek Kondisi
          </button>
        </div>

        {/* Chat History */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-medium'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-2 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                <span>J0ssy bot sedang berpikir...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-1.5 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleSendMessage(`Apa kabar ${pet.name}?`)}
            disabled={isEmpty || isLoading}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-cyan-100 text-slate-700 font-medium shrink-0 border border-slate-300 transition-colors"
          >
            Apa kabar {pet.name}?
          </button>
          <button
            onClick={() => handleSendMessage('Ceritakan lelucon lucu tentang hewan peliharaan!')}
            disabled={isEmpty || isLoading}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-cyan-100 text-slate-700 font-medium shrink-0 border border-slate-300 transition-colors"
          >
            Cerita lucu dong! 😂
          </button>
          <button
            onClick={() =>
              handleSendMessage('Gimana tips supaya pet cepat naik level dan bahagia?')
            }
            disabled={isEmpty || isLoading}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-cyan-100 text-slate-700 font-medium shrink-0 border border-slate-300 transition-colors"
          >
            Tips naik level ⭐
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={
              isEmpty
                ? 'J0ssy bot kehabisan baterai... Cas manual dulu!'
                : 'Ketik pesan untuk J0ssy bot...'
            }
            disabled={isEmpty || isLoading}
            className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMsg.trim() || isEmpty || isLoading}
            className={`btn-tactile px-4 py-2.5 rounded-xl font-heading font-bold text-xs flex items-center gap-1.5 shadow-md ${
              !inputMsg.trim() || isEmpty || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-600 text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Kirim</span>
          </button>
        </div>
      </div>
    </div>
  );
};
