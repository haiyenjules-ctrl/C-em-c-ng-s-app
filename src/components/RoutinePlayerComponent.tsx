/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routine, Exercise } from '../types';
import {
  Play,
  Pause,
  SkipForward,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface RoutinePlayerComponentProps {
  routine: Routine;
  onComplete: (sessionDetails: {
    completedIds: string[];
    skippedIds: string[];
    painfulIds: string[];
    durationSpent: number;
  }) => void;
  onCancel: () => void;
  customImages?: { [key: string]: string };
}

export const RoutinePlayerComponent: React.FC<RoutinePlayerComponentProps> = ({
  routine,
  onComplete,
  onCancel,
  customImages = {},
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState(routine.exercises[0]?.duration || 30);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [painfulIds, setPainfulIds] = useState<string[]>([]);
  const [totalSecondsSpent, setTotalSecondsSpent] = useState(0);

  const activeExercise: Exercise | undefined = routine.exercises[currentIdx];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeExercise) {
      setTimeLeft(activeExercise.duration);
    }
  }, [currentIdx, activeExercise]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
        setTotalSecondsSpent((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      handleExerciseCompletion();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  const handleExerciseCompletion = () => {
    if (!activeExercise) return;
    setCompletedIds((prev) => [...prev, activeExercise.id]);
    moveToNext();
  };

  const handleSkip = () => {
    if (!activeExercise) return;
    setSkippedIds((prev) => [...prev, activeExercise.id]);
    moveToNext();
  };

  const handlePainful = () => {
    if (!activeExercise) return;
    setPainfulIds((prev) => [...prev, activeExercise.id]);
    alert(
      `Đã ghi nhận bài này gây đau mỏi dữ quá! Mình dừng tập động tác này ngay lập tức để bảo vệ xương cốt nghe sếp. Chuyển sang bài kế nha!`
    );
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIdx < routine.exercises.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      triggerComplete();
    }
  };

  const triggerComplete = () => {
    setIsPlaying(false);
    onComplete({
      completedIds,
      skippedIds,
      painfulIds,
      durationSpent: totalSecondsSpent,
    });
  };

  if (!activeExercise) {
    return (
      <div className="text-center p-8 bg-white rounded-3xl border-3 border-[#2D3436]">
        <p className="font-extrabold text-[#EE6C4D]">Oài! Routine này trống rỗng mất rồi sếp ơi.</p>
        <button
          onClick={onCancel}
          className="mt-4 px-6 py-2.5 bg-[#EE6C4D] text-white border-2 border-[#2D3436] rounded-full font-bold shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] cursor-pointer"
        >
          Quay lại
        </button>
      </div>
    );
  }

  // Calculate percentage progress of current exercise
  const percentCompleted = ((activeExercise.duration - timeLeft) / activeExercise.duration) * 100;

  // Mascot mapping when no custom image or default image is available
  const defaultMascotUrl = activeExercise.id.includes('02') || activeExercise.id.includes('04') || activeExercise.id.includes('06') || activeExercise.id.includes('08') || activeExercise.id.includes('10')
    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiIsqdrGNKKpNrIzNOxfKzns3c00K2nKoFk0ZHQEmUC_tyn1RWXoIhg6aaHRLgaxkYJkM4py2MosnhTTe4I__1u3UKq5WUrz2LGxyZ7rKMDnCBJAFTuzWEn1ezK8hDKPBt1z8-Tcct8qZD7DrdyDOWrFPpb84yIS_yaipjpOMz546MfTcMKCL1At_iGiG7fkAPssIm_q_fgnjledUdnICcoo-x1gI7Ypib06y3i1F1bWEAilH7LP3o7GQgi8688QxizcX35e848Nht'
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPLzWgvoaGl2lSjsJuS2MHid6CVqngP7R2bSkqpYfZBNIXJ1rHH7WgGqj1dNeb5XyiX5kT4Ce9vEkVyeh0gIrhPb57eNhpdz-v8zV-MyOI1rBnHA2LJTmCF8UIzLH4NbT-H5lOWNUb5AWv6CamMIqRA9UOrDeON-S6v6kukFI1-nksv5pRQlvzVryInW4KhoyBV9WeOAd_zwFxgf7tSPVtYnQB1r9AxQrjWcQJ7pHDsK7ZvRF43ZW3jTbkDfHw4QBfoWFSJDRG6__a';

  const displayedImageUrl = customImages[activeExercise.id] || activeExercise.imageUrl || defaultMascotUrl;

  return (
    <div className="max-w-md mx-auto bg-[#FFFBF2] border-3 border-[#2D3436] rounded-[32px] shadow-[6px_6px_0px_0px_rgba(45,52,54,1)] overflow-hidden">
      {/* Top Punchcard Header */}
      <div className="bg-[#FFFBF2] border-b-3 border-[#2D3436] p-4 flex justify-between items-center px-6">
        <div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
            THẺ BẤM GIỜ TẬP LÀM
          </span>
          <h2 className="font-extrabold text-[#7c5637] text-xs truncate max-w-[180px] sm:max-w-sm">
            {routine.name}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="px-3.5 py-1 bg-white hover:bg-rose-50 border-2 border-[#2D3436] rounded-full font-black text-[11px] text-[#2D3436] hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
        >
          <XCircle className="w-3.5 h-3.5 stroke-[2.5]" /> Hủy bỏ
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Step Indicator Row */}
        <div className="flex justify-between items-center text-xs">
          <span className="font-black text-slate-500 uppercase tracking-wide">
            🔢 Động tác {currentIdx + 1} / {routine.exercises.length}
          </span>
          <span className="px-2.5 py-0.5 border-2 border-[#2D3436] bg-[#BCEDDA] text-[#2D3436] rounded-md text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(45,52,54,1)]">
            {activeExercise.area}
          </span>
        </div>

        {/* Cohesive Dynamic Pocket Timer & Posture Panel */}
        <div className="bg-white border-2 border-[#2D3436] rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] flex flex-col items-center text-center space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
            {/* Pocket sized Posture Frame */}
            <div className="w-28 h-28 border-2 border-[#2D3436] rounded-xl overflow-hidden bg-white p-0.5 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] relative flex items-center justify-center shrink-0">
              <img
                src={displayedImageUrl}
                alt={activeExercise.name}
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Circular Digital Countdown Stopwatch */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="#F1F5F9"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="#EE6C4D"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={301}
                  strokeDashoffset={301 - (301 * percentCompleted) / 100}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-[#2D3436] tabular-nums tracking-tighter">
                  {timeLeft}
                </span>
                <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-widest leading-none mt-0.5">Giây còn lại</span>
              </div>
            </div>
          </div>

          {/* Symmetrical Text Compartment */}
          <div className="w-full pt-1">
            <h3 className="font-serif font-black text-base text-[#7c5637] leading-tight mb-2">
              {activeExercise.name}
            </h3>
            
            {/* Hyper-condensed instruction - Only one single sentence for extreme clarity */}
            <div className="border-t border-dashed border-slate-200 w-full pt-2.5">
              <p className="text-[#bf7135] font-black text-[9px] uppercase tracking-wider mb-1">👉 Thao tác nhanh gọn:</p>
              <p className="text-gray-650 font-bold text-xs leading-relaxed max-w-sm mx-auto">
                {activeExercise.description}
              </p>
            </div>
          </div>
        </div>

        {/* Consolidated Control Button Strip */}
        <div className="bg-slate-50 border-2 border-[#2D3436] rounded-2xl p-4 flex justify-between items-center gap-3.5 shadow-[3px_3px_0px_0px_rgba(45,52,54,1)]">
          {/* SOS option */}
          <button
            type="button"
            onClick={handlePainful}
            className="px-3 py-2.5 rounded-xl border-2 border-[#2D3436] bg-rose-50 text-rose-600 hover:bg-rose-100 font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer flex-1"
            title="Động tác quá đau, đổi bài!"
          >
            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" /> Mỏi quá! SOS
          </button>

          {/* Action Play/Pause Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-[#EE6C4D] border-2 border-[#2D3436] flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:bg-[#EE6C4D]/90 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white stroke-2" />
            ) : (
              <Play className="w-5 h-5 fill-white stroke-2 translate-x-0.5" />
            )}
          </button>

          {/* Skip Button Option */}
          <button
            type="button"
            onClick={handleSkip}
            className="px-3 py-2.5 rounded-xl border-2 border-[#2D3436] bg-white text-gray-700 hover:bg-gray-50 font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer flex-1 border-dashed"
            title="Nhảy qua bài kế"
          >
            Bỏ qua <SkipForward className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};
