import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MascotCharacter } from './MascotCharacter';
import { Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingNameGateProps {
  onComplete: (name: string) => void;
}

export const OnboardingNameGate: React.FC<OnboardingNameGateProps> = ({ onComplete }) => {
  const [nameInput, setNameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMsg('Ủa cưng ơi, nhập tên của cưng để Cô Em biết đường sướng mắng hay nương chiều cấu trúc hông sườn chứ dợ?');
      return;
    }
    if (trimmed.length < 2) {
      setErrorMsg('Tên gì ngắn ngủn dợ cưng? Nhập tên ít nhất 2 ký tự giùm Cô Em có động lực dắt gân cốt nha.');
      return;
    }
    setErrorMsg(null);
    onComplete(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#fff8f5] flex items-center justify-center p-4">
      {/* Background abstract elements to represent Co Em aesthetic */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#7c5637 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border-4 border-[#7c5637] rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(124,86,55,1)] relative z-10 space-y-6"
      >
        {/* Animated mascot at onboarding top */}
        <div className="flex justify-center -mt-16 md:-mt-20">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#ffcba4] p-1 border-4 border-[#7c5637] overflow-hidden shadow-md">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPLzWgvoaGl2lSjsJuS2MHid6CVqngP7R2bSkqpYfZBNIXJ1rHH7WgGqj1dNeb5XyiX5kT4Ce9vEkVyeh0gIrhPb57eNhpdz-v8zV-MyOI1rBnHA2LJTmCF8UIzLH4NbT-H5lOWNUb5AWv6CamMIqRA9UOrDeON-S6v6kukFI1-nksv5pRQlvzVryInW4KhoyBV9WeOAd_zwFxgf7tSPVtYnQB1r9AxQrjWcQJ7pHDsK7ZvRF43ZW3jTbkDfHw4QBfoWFSJDRG6__a"
              alt="Co Em Mascot Onboarding"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Mascot dialog speech bubble */}
        <div className="bg-[#FFFBF2] border-2 border-[#7c5637] rounded-2xl p-4 text-center relative shadow-sm">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FFFBF2] border-t-2 border-l-2 border-[#7c5637] rotate-45" />
          <p className="text-xs font-bold text-[#7c5637] leading-relaxed">
            "Hế nhô đồng nghiệp! Cô Em săn lùng cột sống gù tôm bấy lâu nay nè. Khai ngay quý danh danh gia vọng tộc để Cô Em lưu sổ nam tào lên đơn nương tì giải sầu thắt lưng nha cưng!"
          </p>
        </div>

        <div className="space-y-2 text-center text-[#2D3436]">
          <span className="text-[10px] bg-orange-100 border border-orange-200 text-[#EE6C4D] px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold rotate-1 inline-block">
            Onboarding • Khởi tạo danh tánh
          </span>
          <h2 className="text-2xl font-black text-[#7c5637] tracking-tight">Khai Báo Quý Danh</h2>
          <p className="text-[11px] text-gray-500 font-bold max-w-xs mx-auto">
            Đặt tên cho sành điệu để Cô Em réo gọi động viên dãn cơ chống còng lưng mệt mỏi nhé!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-[#7c5637] uppercase tracking-wider block">
              Tên của cưng là hoặc nickname sếp sòng:
            </label>
            <input
              type="text"
              placeholder="VD: Bé Thảo Vy, Nam Lập Trình, sếp Thư Ký..."
              autoFocus
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              className="w-full bg-[#FFFBF2] border-2 border-[#7c5637] rounded-xl px-4 py-3 text-sm font-bold text-[#2D3436] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE6C4D] transition-all shadow-[2px_2px_0px_0px_rgba(124,86,55,1)]"
            />
          </div>

          {errorMsg && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 bg-red-50 border-2 border-red-200 rounded-xl text-[11px] text-red-600 font-bold leading-relaxed"
            >
              ⚠️ {errorMsg}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-[#EE6C4D] text-white border-2 border-[#7c5637] rounded-xl py-3.5 text-xs font-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(124,86,55,1)] hover:bg-[#EE6C4D]/90 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(124,86,55,1)] transition-all cursor-pointer"
          >
            Bắt đầu dãn mỏi, cản deadline 🚀
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-dashed border-gray-200">
          <p className="text-[10px] text-gray-400 font-semibold italic">
            "Không đồng ý khai tên là mỏ Cô Em chanh chua réo gọi cằn nhằn suốt ngày đó nhen!"
          </p>
        </div>
      </motion.div>
    </div>
  );
};
