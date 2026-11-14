import React, { useState, useRef, useEffect } from 'react';
import { soundFx } from '../audio/soundEffects';
import { Zap } from 'lucide-react';
export const DraggableAdminBadge = ({ onOpenPanel }) => {
  // Initial position: Top right beneath HUD
  const [pos, setPos] = useState({ x: 16, y: 140 }); // offset from top-right or absolute
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({
    startX: 0,
    startY: 0,
    initPosX: 0,
    initPosY: 0,
    hasMoved: false,
  });
  // Calculate clamp within screen
  const clampPos = (x, y) => {
    const maxX = Math.max(window.innerWidth - 76, 0);
    const maxY = Math.max(window.innerHeight - 76, 0);
    return {
      x: Math.min(Math.max(10, x), maxX),
      y: Math.min(Math.max(60, y), maxY),
    };
  };
  // Init position clamped
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultX = Math.max(window.innerWidth - 86, 16);
      setPos(clampPos(defaultX, 150));
    }
  }, []);
  // Mouse drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initPosX: pos.x,
      initPosY: pos.y,
      hasMoved: false,
    };
    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - dragStartRef.current.startX;
      const dy = moveEvent.clientY - dragStartRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        dragStartRef.current.hasMoved = true;
      }
      setPos(clampPos(dragStartRef.current.initPosX + dx, dragStartRef.current.initPosY + dy));
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (!dragStartRef.current.hasMoved) {
        // Was a tap/click!
        soundFx.playBeep(880, 0.1);
        onOpenPanel();
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  // Touch drag handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initPosX: pos.x,
      initPosY: pos.y,
      hasMoved: false,
    };
    const handleTouchMove = (moveEvent) => {
      if (moveEvent.touches.length === 0) return;
      const t = moveEvent.touches[0];
      const dx = t.clientX - dragStartRef.current.startX;
      const dy = t.clientY - dragStartRef.current.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        dragStartRef.current.hasMoved = true;
      }
      setPos(clampPos(dragStartRef.current.initPosX + dx, dragStartRef.current.initPosY + dy));
    };
    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (!dragStartRef.current.hasMoved) {
        // Was a tap!
        soundFx.playBeep(880, 0.1);
        onOpenPanel();
      }
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };
  return (
    <div
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`fixed z-40 select-none cursor-grab active:cursor-grabbing transition-transform ${isDragging ? 'scale-110 shadow-2xl opacity-95' : 'hover:scale-105 shadow-xl'}`}
      title="Kotak Admin Panel (Seret kemana saja atau pencet untuk membuka menu)"
    >
      <div className="relative group flex flex-col items-center">
        {/* Glow halo */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 opacity-80 blur-xs group-hover:opacity-100 transition-opacity animate-pulse" />

        {/* Small Box body */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950/90 border-2 border-amber-400 p-1 flex flex-col items-center justify-center backdrop-blur-md text-amber-300 shadow-inner">
          {/* Top miniature indicator */}
          <div className="flex items-center gap-1 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[8px] font-black tracking-tighter text-amber-200">ADMIN</span>
          </div>

          {/* Icon */}
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 animate-bounce" />

          {/* Tiny label */}
          <span className="text-[7px] sm:text-[8px] font-mono font-bold tracking-tight text-cyan-300">
            PANEL
          </span>
        </div>

        {/* Hover hint */}
        <div className="absolute top-full mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-[9px] text-amber-300 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Geser / Tekan untuk Buka ⚡
        </div>
      </div>
    </div>
  );
};
