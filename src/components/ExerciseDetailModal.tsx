/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image, Check, AlertTriangle } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseDetailModalProps {
  isOpen: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onStartExercise: (exercise: Exercise) => void;
  customImages: { [key: string]: string };
  onSaveCustomImage: (exerciseId: string, url: string) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  isOpen,
  exercise,
  onClose,
  onStartExercise,
  customImages,
  onSaveCustomImage,
}) => {
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [tempUrl, setTempUrl] = useState('');

  // Synchronize tempUrl when exercise changes
  useEffect(() => {
    if (exercise) {
      setTempUrl(customImages[exercise.id] || exercise.imageUrl || '');
      setIsEditingImage(false);
    }
  }, [exercise, customImages]);

  if (!isOpen || !exercise) return null;

  // Mascot mapping similar to search results
  const defaultMascotUrl = exercise.id.includes('02') || exercise.id.includes('04') || exercise.id.includes('06') || exercise.id.includes('08') || exercise.id.includes('10')
    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiIsqdrGNKKpNrIzNOxfKzns3c00K2nKoFk0ZHQEmUC_tyn1RWXoIhg6aaHRLgaxkYJkM4py2MosnhTTe4I__1u3UKq5WUrz2LGxyZ7rKMDnCBJAFTuzWEn1ezK8hDKPBt1z8-Tcct8qZD7DrdyDOWrFPpb84yIS_yaipjpOMz546MfTcMKCL1At_iGiG7fkAPssIm_q_fgnjledUdnICcoo-x1gI7Ypib06y3i1F1bWEAilH7LP3o7GQgi8688QxizcX35e848Nht' // expert/wink character
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPLzWgvoaGl2lSjsJuS2MHid6CVqngP7R2bSkqpYfZBNIXJ1rHH7WgGqj1dNeb5XyiX5kT4Ce9vEkVyeh0gIrhPb57eNhpdz-v8zV-MyOI1rBnHA2LJTmCF8UIzLH4NbT-H5lOWNUb5AWv6CamMIqRA9UOrDeON-S6v6kukFI1-nksv5pRQlvzVryInW4KhoyBV9WeOAd_zwFxgf7tSPVtYnQB1r9AxQrjWcQJ7pHDsK7ZvRF43ZW3jTbkDfHw4QBfoWFSJDRG6__a'; // sticker pose

  const displayedImageUrl = customImages[exercise.id] || exercise.imageUrl || defaultMascotUrl;

  const getLocationLabel = (style: string) => {
    if (!style) return 'NONE';
    const s = style.toLowerCase();
    if (s === 'desk') return 'CHAIR';
    if (s === 'floor') return 'FLOOR';
    return 'NONE';
  };

  const handleSaveImage = () => {
    if (tempUrl.trim()) {
      onSaveCustomImage(exercise.id, tempUrl.trim());
    } else {
      // Clear custom image to fallback to original or mascot
      onSaveCustomImage(exercise.id, '');
    }
    setIsEditingImage(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#2D3436]/60 backdrop-blur-sm"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          id="exercise-detail-modal"
          className="bg-[#FFFBF2] border-3 border-[#2D3436] rounded-[32px] max-w-sm w-full p-6 shadow-[8px_8px_0px_0px_rgba(45,52,54,1)] relative z-10 max-h-[92vh] overflow-y-auto no-scrollbar"
        >
          {/* Close Circular Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full border-2 border-[#2D3436] bg-white text-[#2D3436] hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer z-20 active:scale-95 shadow-sm"
            title="Đóng"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Symmetrical Illustration Block */}
          <div className="space-y-3 mt-4 text-center">
            <div className="w-[180px] h-[180px] mx-auto border-3 border-[#2D3436] rounded-3xl overflow-hidden bg-white p-1 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] relative flex items-center justify-center group">
              <img
                src={displayedImageUrl}
                alt={exercise.name}
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Editing Picture Interaction Row */}
            {isEditingImage ? (
              <div className="bg-white border-2 border-[#2D3436] p-2.5 rounded-2xl max-w-xs mx-auto space-y-2 mt-2 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] text-left">
                <label className="text-[10px] font-black uppercase text-gray-500 block">Dán link ảnh động tác của cưng:</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="Link hình ảnh (https://...)"
                    className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-[10px] flex-1 focus:outline-none focus:border-[#EE6C4D] font-medium"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveImage}
                    className="p-1 px-2.5 bg-[#BCEDDA] text-[#2D3436] border border-[#2D3436] rounded-lg text-[10px] font-black cursor-pointer hover:bg-[#a9e4cf] flex items-center gap-1 active:scale-90"
                  >
                    <Check className="w-3 h-3 stroke-[3]" /> Lưu
                  </button>
                  <button
                    onClick={() => {
                      setTempUrl(customImages[exercise.id] || exercise.imageUrl || '');
                      setIsEditingImage(false);
                    }}
                    className="px-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-[10px] font-bold text-gray-600"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingImage(true)}
                className="text-xs font-black text-[#EE6C4D] hover:underline flex items-center gap-1 justify-center mx-auto cursor-pointer group active:scale-95 transition-all mt-1"
              >
                <span>🎨 Thay ảnh của cưng</span>
              </button>
            )}
          </div>

          {/* Area Target Pill Badge */}
          <div className="flex justify-center mt-5">
            <span className="px-3.5 py-1 border-2 border-[#2D3436] bg-[#BCEDDA] text-[#2D3436] rounded-full text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(45,52,54,1)]">
              {exercise.area}
            </span>
          </div>

          {/* Name Header and Witty Motto */}
          <div className="text-center space-y-1.5 mt-3">
            <h3 className="font-serif font-black text-2xl text-[#7c5637] leading-tight">
              {exercise.name}
            </h3>
            <p className="text-sm text-gray-700 italic font-bold leading-relaxed max-w-xs mx-auto px-4">
              “{exercise.description}”
            </p>
          </div>

          {/* Dashed Line Separation */}
          <div className="border-t-2 border-dashed border-[#2D3436]/40 my-4" />

          {/* Instructions List (Cô em chỉ bài) */}
          <div className="space-y-1 bg-white p-4.5 rounded-2xl border-2 border-[#2D3436] shadow-[2.5px_2.5px_0px_0px_rgba(45,52,54,1)]" id="instructions-container">
            <div className="text-xs text-slate-700 leading-relaxed font-semibold">
              <strong className="text-[#bf7135] font-black uppercase tracking-wider text-[11px] block mb-1">
                👉 Cô em chỉ bài:
              </strong>
              <ul className="list-disc pl-4.5 space-y-1.5 mt-1" id="instructions-list">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} id={`instruction-step-${index}`}>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Warning / Common Mistakes callout */}
          <div className="p-3.5 bg-[#FFD2E5] border-2 border-[#2D3436] rounded-2xl flex items-start gap-2.5 text-xs text-slate-800 mt-4 leading-relaxed shadow-[2.5px_2.5px_0px_0px_rgba(45,52,54,1)]">
            <AlertTriangle className="w-4.5 h-4.5 text-[#EE6C4D] shrink-0 mt-0.5 stroke-[2.5]" />
            <div>
              <strong className="font-black text-[#2D3436]">⚠️ Cẩn thận nhé:</strong>{' '}
              <span className="font-bold">
                {exercise.commonMistakes && exercise.commonMistakes.length > 0
                  ? exercise.commonMistakes.join(' ')
                  : 'Không cố tập vượt ngưỡng chịu đựng của cơ gân cổ.'}
              </span>
            </div>
          </div>

          {/* Exercise Parameters in 2 Columns */}
          <div className="grid grid-cols-2 gap-3.5 mt-4">
            {/* Column 1: Speed Duration suggestions */}
            <div className="p-3 bg-white border-2 border-[#2D3436] rounded-2xl flex flex-col items-center justify-center text-center shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
              <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Thời gian gợi ý</span>
              <span className="text-sm font-black text-[#2D3436] mt-0.5">{exercise.duration} giây</span>
            </div>

            {/* Column 2: Equipment Requirements (Chair, Floor, None) */}
            <div className="p-3 bg-white border-2 border-[#2D3436] rounded-2xl flex flex-col items-center justify-center text-center shadow-[2px_2px_0px_0px_rgba(45,52,54,1)]">
              <span className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Đạo cụ rảnh rang</span>
              <span className="text-sm font-black text-[#2D3436] mt-0.5 uppercase">
                {getLocationLabel(exercise.locationStyle)}
              </span>
            </div>
          </div>

          {/* Launch Big CTA Action Button */}
          <button
            onClick={() => {
              onStartExercise(exercise);
              onClose();
            }}
            className="w-full mt-5 bg-[#ffc593] hover:bg-[#ffb675] text-[#2D3436] border-2 border-[#2D3436] rounded-2xl py-3.5 text-sm font-black flex items-center justify-center gap-1.5 shadow-[4px_4px_0px_0px_rgba(45,52,54,1)] hover:shadow-[5px_5px_0px_0px_rgba(45,52,54,1)] active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_0px_rgba(45,52,54,1)] transition-all cursor-pointer"
          >
            Bắt đầu bấm giờ tập ngay ⏱️
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
