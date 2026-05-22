/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotCharacter } from './MascotCharacter';
import { Award, Zap, X, ShieldCheck, Mail, Gift, PartyPopper } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'3day' | '7day' | '14day'>('7day');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const plans = [
    {
      id: '3day' as const,
      name: 'Khóa Cấp Cứu 3 Ngày',
      desc: 'Giúp "cầm cự" sống sót vượt ải nộp báo cáo quý.',
      price: '39.000đ',
      original: '79.000đ',
      popular: false,
      benefits: [
        '3 ngày bám đuổi routine phục hồi',
        'Xoa bóp giảm 50% đau mỏi thắt lưng',
        'Mẹo né sếp gõ đầu lúc gật gù trưa'
      ]
    },
    {
      id: '7day' as const,
      name: 'Khóa Tút Cốt Cách 7 Ngày',
      desc: 'Tuần lễ vàng bốc dỡ toàn bộ rỉ sét, giãn xô bả vai tròn trịa.',
      price: '79.000đ',
      original: '149.000đ',
      popular: true,
      benefits: [
        '7 ngày đồng hành AI routine biến ảo',
        'Khóa học Mát-xa Bách Hội giảm căng sọ',
        'Phục hồi tư thế thẳng bối cảnh Desk',
        'Voucher trà sữa đồng nghiệp thanh thuần'
      ]
    },
    {
      id: '14day' as const,
      name: 'Khóa Sống Khôn Ngoan 14 Ngày',
      desc: 'Lột xác biến thành biểu tượng dẻo dai khỏe khoắn phòng nhân sự.',
      price: '129.000đ',
      original: '249.000đ',
      popular: false,
      benefits: [
        'Routine cá nhân hóa nâng cao',
        'Zalo chat Cô Em "nhây mặn" nhắc nhở',
        'Bộ sticker cartoon chính hiệu dán laptop',
        'Cam kết bớt đau mỏi đến 90%'
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Save waitlist to local storage for metric demo
      try {
        const list = JSON.parse(localStorage.getItem('co_em_waitlist') || '[]');
        list.push({ email, plan: selectedPlan, date: new Date().toISOString() });
        localStorage.setItem('co_em_waitlist', JSON.stringify(list));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#2D3436]/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-2 border-[#7c5637] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 border text-gray-500 z-10 hover:text-[#EE6C4D] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <span className="bg-[#BCEDDA] text-[#406d60] border border-[#a1d0c1] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Đăng ký đặt chỗ sớm ⭐ VIP PASS
              </span>
              <h3 className="font-black text-2xl text-[#2D3436]">
                Chương Trình Đồng Hành Trị Liệu Cô Em Công Sở
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                Đeo bám thói quen thư giãn cùng "Cô Em" với các lộ trình nâng cấp thể cốt đỉnh cao, được bọc thép bởi AI cá nhân bám sát theo từng giờ làm việc của bạn!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {plans.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between relative ${
                    selectedPlan === p.id
                      ? 'border-[#EE6C4D] bg-[#FFFBF2] shadow-md transform scale-[1.01]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#EE6C4D] text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase">
                      Bán chạy nhất 🔥
                    </span>
                  )}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase text-[#7a5435] block">
                      {p.name}
                    </span>
                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed leading-[14px]">
                      {p.desc}
                    </p>
                    <div className="pt-2">
                      <span className="text-[10px] text-gray-400 line-through block">
                        {p.original}
                      </span>
                      <span className="text-lg font-black text-[#EE6C4D]">
                        {p.price}
                      </span>
                    </div>
                  </div>

                  <ul className="text-[9px] text-gray-600 font-bold space-y-1.5 border-t pt-2.5 mt-3 list-disc pl-3">
                    {p.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Email form to build pre-reservation intent */}
            <form onSubmit={handleSubmit} className="bg-[#FFFBF2] p-5 rounded-2xl border-2 border-dashed border-[#FBAE94] space-y-4">
              <p className="text-xs text-gray-700 leading-relaxed text-center font-bold">
                👉 Gửi email đăng ký đặt chỗ trước để hưởng <strong>Chiết khấu Độc quyền 50%</strong> ngay khi Cô Em Công Sở VIP mở bán chính thức nha!
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    required
                    placeholder="Email công sở của bạn là..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-2 border-[#7c5637] rounded-xl p-3 pl-10 text-xs font-semibold focus:outline-none focus:border-[#EE6C4D]"
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="bg-[#EE6C4D] border-2 border-[#7c5637] text-white font-black px-5 rounded-xl text-xs hover:bg-orange-600 cursor-pointer active:scale-95 transition-all"
                >
                  Đăng Ký Nhận Quà
                </button>
              </div>
              <div className="flex justify-center items-center gap-1 text-[10px] text-gray-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Đảm bảo bảo mật tối mật thông tin cá nhân.
              </div>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <PartyPopper className="w-16 h-16 text-emerald-500 bg-emerald-50 p-2.5 rounded-full" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl text-[#2D3436]">
                Chúc Mừng Bạn Đã Gói VIP Thành Công! 🎉
              </h3>
              <p className="text-sm font-semibold text-emerald-800">
                Lượt đăng ký VIP của email <strong className="underline">{email}</strong> đã tự động ghim vào danh sách danh dự!
              </p>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                Khi "Cô Em" đóng hòm đóng khóa chương trình nâng cấp AI xịn xò này gõ cửa, bạn sẽ nhận được email hướng dẫn bí mật kèm mã chiết khấu 50% và Bộ Sticker hoạt hình Cô Em may mắn nhé!
              </p>
            </div>

            <div className="bg-[#FFFBF2] p-4 rounded-xl text-xs inline-block border border-orange-200">
              <span className="font-bold text-[#7a5435] block mb-1">🎁 QUÀ TẶNG Kèm theo lúc ra mắt:</span>
              <p className="text-gray-600 font-semibold italic">"1 Cuốn E-book Mát-xa mặt chống quầng thâm & Trà hoa nhài thanh lọc deadline"</p>
            </div>

            <div>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#3a675a] text-white font-bold text-xs shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                Trở lại tập luyện thôi sếp mong!
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
