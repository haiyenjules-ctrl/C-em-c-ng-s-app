/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotCharacter } from './MascotCharacter';
import {
  Heart,
  Sparkles,
  Award,
  ChevronRight,
  TrendingDown,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  Flame,
  Calendar
} from 'lucide-react';

interface CheckoutAndPlanInviteProps {
  painBefore: number;
  routineName: string;
  onPlanCreated: (planType: '3day' | '7day', questionnaireAnswers: any) => void;
  onSkipPlan: (painAfter: number) => void;
  hasActivePlan?: boolean;
  activePlanType?: '3day' | '7day' | null;
  activePlanDay?: number;
  onActivePlanDayCompleted?: (painAfter: number) => void;
}

export const CheckoutAndPlanInvite: React.FC<CheckoutAndPlanInviteProps> = ({
  painBefore,
  routineName,
  onPlanCreated,
  onSkipPlan,
  hasActivePlan = false,
  activePlanType = null,
  activePlanDay = 1,
  onActivePlanDayCompleted,
}) => {
  const [step, setStep] = useState<'checkout' | 'invite' | 'questions' | 'success'>('checkout');
  const [feedback, setFeedback] = useState<'better' | 'same' | 'worse' | null>(null);
  const [painAfter, setPainAfter] = useState<number>(Math.max(1, painBefore - 2));

  // Questionnaire questions
  const [q1, setQ1] = useState<string>(''); // computer time
  const [q2, setQ2] = useState<string>(''); // peak tired hour
  const [q3, setQ3] = useState<string>(''); // bestie voice
  const [selectedPlan, setSelectedPlan] = useState<'3day' | '7day'>('3day');

  // Custom peak hour state
  const [customTime, setCustomTime] = useState<string>('16:00');
  const [isCustomTimeActive, setIsCustomTimeActive] = useState<boolean>(false);

  const handleFeedbackSelect = (type: 'better' | 'same' | 'worse') => {
    setFeedback(type);
    if (type === 'better') {
      setPainAfter(Math.max(1, painBefore - 3));
    } else if (type === 'same') {
      setPainAfter(painBefore);
    } else {
      setPainAfter(Math.min(10, painBefore + 1));
    }
  };

  const handleCheckoutSubmit = () => {
    if (!feedback) {
      alert("Đồng nghiệp ơi, chọn giúp Cô Em một trạng thái cảm nhận nhe!");
      return;
    }
    if (hasActivePlan) {
      setStep('success');
    } else {
      // If user says better or same, invite them to create a custom 3 or 7-day plan!
      if (feedback === 'better' || feedback === 'same') {
        setStep('invite');
      } else {
        // If worse, go back or trigger safety checkout skip directly
        onSkipPlan(painAfter);
      }
    }
  };

  const handleInviteAccept = () => {
    setStep('questions');
  };

  const handleFormSubmit = () => {
    if (!q1 || !q2 || !q3) {
      alert("Ấy ơi, trả lời nốt mấy câu trắc nghiệm nhanh để Cô Em thắt nơ lộ trình cho chuẩn nhe!");
      return;
    }
    setStep('success');
  };

  const handleDone = () => {
    onPlanCreated(selectedPlan, {
      computerTime: q1,
      peakHour: q2,
      wittyVoice: q3
    });
  };

  return (
    <div id="checkout-container-card" className="max-w-xl mx-auto bg-[#FFFBF2] border-2 border-[#7c5637] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      
      {/* Decorative background visual element */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-100 rounded-full blur-xl opacity-70" />

      <AnimatePresence mode="wait">
        
        {/* STEP 1: CHECKOUT SCREEN */}
        {step === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <span className="bg-orange-100 text-[#EE6C4D] border border-orange-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block">
                Tập xong rồi, Chúc Mừng Bạn! 🎉
              </span>
              <h2 className="text-xl font-black text-[#2D3436]">Check-out Cảm Nhận Sau Vận Động</h2>
              <p className="text-xs text-gray-500 font-bold max-w-sm mx-auto">
                Vừa hoàn thành bài: <strong className="text-gray-700">"{routineName}"</strong>. Hãy khai báo trung thực cho Cô Em hỏi thăm tí nhe cưng:
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                id="better-btn"
                onClick={() => handleFeedbackSelect('better')}
                className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                  feedback === 'better'
                    ? 'bg-[#BCEDDA] border-[#406d60] shadow-md scale-102 font-black'
                    : 'bg-white border-gray-200 hover:border-emerald-200'
                }`}
              >
                <div className="text-3xl">😍</div>
                <span className="text-xs font-black text-[#406d60]">Đỡ hẳn luôn!</span>
                <span className="text-[10px] text-gray-400 font-semibold leading-tight">Mềm mượt xả láng</span>
              </button>

              <button
                type="button"
                id="same-btn"
                onClick={() => handleFeedbackSelect('same')}
                className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                  feedback === 'same'
                    ? 'bg-amber-50 border-amber-500 shadow-md scale-102 font-black'
                    : 'bg-white border-gray-200 hover:border-amber-200'
                }`}
              >
                <div className="text-3xl">😶</div>
                <span className="text-xs font-black text-amber-700">Dịu nhẹ tí ti</span>
                <span className="text-[10px] text-gray-400 font-semibold leading-tight">Chưa giảm nhiều</span>
              </button>

              <button
                type="button"
                id="worse-btn"
                onClick={() => handleFeedbackSelect('worse')}
                className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2 ${
                  feedback === 'worse'
                    ? 'bg-red-50 border-red-400 shadow-md scale-102 font-black'
                    : 'bg-white border-gray-200 hover:border-red-200'
                }`}
              >
                <div className="text-3xl">😢</div>
                <span className="text-xs font-black text-red-700">Mỏi ê ẩm thêm</span>
                <span className="text-[10px] text-gray-400 font-semibold leading-tight">SOS quá thốn</span>
              </button>
            </div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3"
              >
                <div className="flex justify-between items-center text-xs font-black text-[#7a5435]">
                  <span>ĐỘ ĐAU LÚC NÀY: ({painAfter}/10)</span>
                  <span className="text-[10px] text-gray-400">Ban đầu: {painBefore}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painAfter}
                  onChange={(e) => setPainAfter(parseInt(e.target.value))}
                  className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-[#EE6C4D]"
                />
                <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                  <span>Khỏe khắn phây phây 🥳</span>
                  <span>Đau buốt nhức nhối 😭</span>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => onSkipPlan(painAfter)}
                className="text-xs text-gray-400 font-extrabold hover:text-gray-600 underline"
              >
                Lưu nhanh lịch sử, bỏ qua plan ❌
              </button>
              <button
                type="button"
                id="go-next-checkout"
                onClick={handleCheckoutSubmit}
                className="px-6 py-2.5 rounded-full bg-[#EE6C4D] border-2 border-[#7c5637] text-white font-black text-xs flex items-center gap-1 hover:bg-orange-600 transition-all cursor-pointer shadow-md"
              >
                Tiếp Tục <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PLAN INVITE CO-EM PROMPT */}
        {step === 'invite' && (
          <motion.div
            key="invite"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-6 text-center"
          >
            <MascotCharacter
              pose="expert"
              speechBubble="Ăn quả nhớ kẻ trồng cây, bớt mỏi nhớ lấy 'Cô Em'! Đồng nghiệp có muốn xây dựng lộ trình nương chiều thân cốt 3 HOẶC 7 ngày dứt điểm?"
            />

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="font-black text-lg text-[#2D3436]">Rủ Rê Kiến Tạo Thói Quen Nhỏ</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Cô em sẽ dựa vào 3 câu trắc nghiệm tính cách thói quen để thiết kế lộ trình rèn cốt, nhắc nhở ngọt lịm mỗi ngày đúng boong giờ mỏi cơ.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div
                onClick={() => setSelectedPlan('3day')}
                className={`p-4 rounded-2xl border-2 cursor-pointer text-left transition-all relative ${
                  selectedPlan === '3day'
                    ? 'bg-[#BCEDDA] border-[#406d60] shadow-md scale-102'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">⚡</div>
                <h4 className="font-black text-xs text-[#2D3436]">Lộ Trình 3 Ngày</h4>
                <p className="text-[10px] text-gray-500 font-bold mt-1 leading-normal">"Cứu Cốt Cấp Tốc" dọn bão deadline</p>
                {selectedPlan === '3day' && <span className="absolute top-2 right-2 text-xs">🟢</span>}
              </div>

              <div
                onClick={() => setSelectedPlan('7day')}
                className={`p-4 rounded-2xl border-2 cursor-pointer text-left transition-all relative ${
                  selectedPlan === '7day'
                    ? 'bg-[#BCEDDA] border-[#406d60] shadow-md scale-102'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">🌟</div>
                <h4 className="font-black text-xs text-[#2D3436]">Lộ Trình 7 Ngày</h4>
                <p className="text-[10px] text-gray-500 font-bold mt-1 leading-normal">"Trẻ Hóa Thân Cốt" dẻo giai bất hủ</p>
                {selectedPlan === '7day' && <span className="absolute top-2 right-2 text-xs">🟢</span>}
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                id="skip-invite-btn"
                onClick={() => onSkipPlan(painAfter)}
                className="px-5 py-2.5 rounded-full border-2 border-gray-300 bg-white font-bold text-xs hover:bg-gray-100 cursor-pointer text-gray-600"
              >
                Nại từ, bận deadline quá cưng ❌
              </button>
              <button
                type="button"
                id="accept-invite-btn"
                onClick={handleInviteAccept}
                className="px-6 py-2.5 rounded-full bg-[#EE6C4D] border-2 border-[#7c5637] text-white font-black text-xs flex items-center gap-1 shadow-md hover:bg-orange-600 cursor-pointer text-center"
              >
                Oki, triển luôn cưng ơi! <Sparkles className="w-4 h-4 fill-white text-yellow-300 shrink-0" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: 3-5 QUESTIONS QUESTIONNAIRE */}
        {step === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-0.5 rounded-full uppercase tracking-widest inline-block">
                Câu Hỏi Tút Tát Lộ Trình 📝
              </span>
              <h3 className="font-black text-base text-[#2D3436]">Tùy Biến Thách Thức Điểm Huyệt</h3>
            </div>

            <div className="space-y-4">
              {/* Q1 */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#7a5435] uppercase block">
                  1. Một ngày bạn ngồi lỳ cúng bái máy tính mấy tiếng thế?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'under_4', txt: 'Dưới 4h 🚶', desc: 'Có đi có dạo' },
                    { val: '4_to_8', txt: '4 - 8h 💻', desc: 'Cày cuốc bình thường' },
                    { val: 'over_8', txt: 'Trên 8h 🦸', desc: 'Chiến thần bất tử' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setQ1(opt.val)}
                      className={`p-2 rounded-xl text-center border-2 transition-all block ${
                        q1 === opt.val
                          ? 'bg-[#BCEDDA] border-[#406d60] font-black shadow-sm'
                          : 'bg-white border-gray-100 text-xs'
                      }`}
                    >
                      <span className="text-xs font-bold block">{opt.txt}</span>
                      <span className="text-[9px] text-[#2D3436] font-semibold">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2 */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#7a5435] uppercase block">
                  2. Khung giờ vàng khớp xương gõ gào thê lương nhất?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'morning-10', txt: '10h Sáng (Check mail ngộp thở) 📨' },
                    { val: 'afternoon-14', txt: '14h Chiều (Đờ đẫn mới thức dậy) 🥱' },
                    { val: 'afternoon-17', txt: '17h Chiều (Tan sở rệu rã) 🚗' },
                    { val: 'night-21', txt: '21h Tối (Nằm giường thảnh thơi) 🛌' }
                  ].map(opt => {
                    const isSelected = q2 === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => {
                          setQ2(opt.val);
                          setIsCustomTimeActive(false);
                        }}
                        className={`p-2.5 rounded-xl text-left border-2 transition-all text-xs font-semibold cursor-pointer ${
                          isSelected && !isCustomTimeActive
                            ? 'bg-[#BCEDDA] border-[#406d60] font-black shadow-sm'
                            : 'bg-white border-gray-100 hover:border-slate-200'
                        }`}
                      >
                        {opt.txt}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Precise Hour Picker */}
                <div
                  className={`p-3 rounded-2xl border-2 transition-all space-y-2 ${
                    isCustomTimeActive
                      ? 'bg-[#BCEDDA] border-[#406d60] shadow-sm'
                      : 'bg-white border-gray-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomTimeActive(true);
                        setQ2(`custom-${customTime}`);
                      }}
                      className="text-xs font-black text-[#2D3436] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>⏰ Tự Chọn Giờ Nhắc Nhở Cụ Thể:</span>
                    </button>
                    <span className="text-[9px] text-[#406d60] bg-emerald-50 px-2 py-0.5 rounded-md font-black">
                      Chính xác 💯
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomTime(val);
                        setIsCustomTimeActive(true);
                        setQ2(`custom-${val}`);
                      }}
                      onFocus={() => {
                        setIsCustomTimeActive(true);
                        setQ2(`custom-${customTime}`);
                      }}
                      className="px-3 py-1.5 bg-white border-2 border-slate-300 rounded-xl text-xs font-black text-gray-700 focus:border-[#EE6C4D] focus:outline-none cursor-pointer"
                    />
                    <span className="text-[11px] text-gray-500 font-bold leading-normal">
                      Nhắc tôi tập lúc <strong className="text-[#EE6C4D] font-black underline">{customTime}</strong> hàng ngày nhe!
                    </span>
                  </div>
                </div>
              </div>

              {/* Q3 */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-[#7a5435] uppercase block">
                  3. Thích Cô Em nhắc nhở bảo ban theo style giọng điệu nào?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'sweet', txt: 'Dịu dàng 🌸', desc: 'Sếp ơi, cưng vai' },
                    { val: 'funny', txt: 'Nhây mặn 🤪', desc: 'Dựng sườn xúm xít' },
                    { val: 'strict', txt: 'Thét deadline 🔥', desc: 'Có đứng lên gõ dại!' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setQ3(opt.val)}
                      className={`p-2 rounded-xl text-center border-2 transition-all block ${
                        q3 === opt.val
                          ? 'bg-[#BCEDDA] border-[#406d60] font-black shadow-sm'
                          : 'bg-white border-gray-100'
                      }`}
                    >
                      <span className="text-xs font-bold block">{opt.txt}</span>
                      <span className="text-[9px] text-[#2D3436] font-semibold">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep('invite')}
                className="px-4 py-2 rounded-full border-2 border-gray-300 font-bold text-xs bg-white text-gray-500"
              >
                Quay lại
              </button>
              <button
                type="button"
                id="submit-questionnaire"
                onClick={handleFormSubmit}
                className="flex-1 px-5 py-3 rounded-full bg-[#EE6C4D] border-2 border-[#7c5637] text-white font-black text-xs hover:bg-orange-600 shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                Tạo Kế Hoạch Đút Túi <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS PROFILE CONGRATULATION PAGE */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center py-2"
          >
            {hasActivePlan ? (
              <>
                <MascotCharacter
                  pose="sticker"
                  speechBubble="Siu cấp dẻo dai luôn sếp ơi! Tập tành chăm dực vầy là Cô Em cưng sếp xỉu up xỉu down luôn hà!"
                />

                <div className="space-y-2">
                  <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-3xl">
                    🎖️
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-800">Hoàn Thành Ngày {activePlanDay} Theo Lộ Trình!</h3>
                  <p className="text-xs text-gray-500 font-bold max-w-sm mx-auto">
                    Chiếc xương sườn kiêu hãnh của sếp đã bớt sầu thảm hơn rồi dấy! Bản đồ dẻo cốt đang dóng ấn ngày thành công!
                  </p>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-dashed border-emerald-300 text-left space-y-1.5 max-w-sm mx-auto">
                  <span className="text-[10px] font-black text-[#7a5435] uppercase tracking-wider block">📅 Lộ trình hoạt động:</span>
                  <div className="text-xs space-y-1 font-bold text-gray-700">
                    <p>• Lộ trình: <span className="text-indigo-600">{activePlanType === '7day' ? '7 Ngày Trẻ Hóa' : '3 Ngày Cấp Tốc'}</span></p>
                    <p>• Trạng thái: <span className="text-emerald-700">Đã phục hồi xong Ngày {activePlanDay} ({activePlanType === '7day' ? '7' : '3'} ngày)</span></p>
                  </div>
                </div>

                <button
                  type="button"
                  id="finish-assessment-plan"
                  onClick={() => {
                    if (onActivePlanDayCompleted) {
                      onActivePlanDayCompleted(painAfter);
                    } else {
                      onSkipPlan(painAfter);
                    }
                  }}
                  className="w-full sm:w-auto px-10 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 text-white font-black text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center mx-auto gap-2"
                >
                  Đóng Ấn Ngày {activePlanDay} 🏆
                </button>
              </>
            ) : (
              <>
                <MascotCharacter
                  pose="sticker"
                  speechBubble={
                    q3 === 'strict'
                      ? 'Kéo quần lên, sườn lưng được dán hói rồi cưng! Nhắc nhở đanh đá kích kích bắt đầu kích hoạt lầy nhầy nha!'
                      : q3 === 'sweet'
                      ? 'Cô em đã cất giấu Lộ trình ngọt ngào vào tim rồi nè! Mỗi ngày sếp vào với em tút tát xương cơ nhoa!'
                      : 'Ghim kế hoạch dẻo dai thành xướng rồi nha đồng nghiệp hỡi! Lên dây cót múa quạt xả mỏi nào!'
                  }
                />

                <div className="space-y-2">
                  <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-3xl">
                    🏆
                  </div>
                  <h3 className="font-extrabold text-lg text-emerald-800">Khởi Tạo Kế Hoạch Thành Công!</h3>
                  <p className="text-xs text-gray-500 font-bold max-w-sm mx-auto">
                    Lộ trình <strong className="text-[#EE6C4D]">{selectedPlan === '7day' ? '7 Ngày Trẻ Hóa' : '3 Ngày Cứu Cốt'}</strong> của bạn đã được gắn cố định vào trang chủ. Hãy hoàn thành đều đặn nhé!
                  </p>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-dashed border-emerald-300 text-left space-y-1.5 max-w-sm mx-auto">
                  <span className="text-[10px] font-black text-[#7a5435] uppercase tracking-wider block">📌 Profile Cảm Hứng Phục Hồi:</span>
                  <div className="text-xs space-y-1 font-bold text-gray-700">
                    <p>• Mục tiêu: <span className="text-indigo-600">{selectedPlan === '7day' ? '7 ngày kiên định' : '3 ngày khẩn thở'}</span></p>
                    <p>• Thời lượng ngồi: <span className="text-[#EE6C4D]">{q1 === 'over_8' ? 'Chiến thần sâm húp (>8h)' : q1 === '4_to_8' ? 'Nhân viên siêng năng (4-8h)' : 'Thảnh thơi dạo bộ (<4h)'}</span></p>
                    <p>• Giọng nhắc: <span className="text-emerald-700">{q3 === 'strict' ? 'Đanh đá quất roi' : q3 === 'funny' ? 'Mặn mà hài hước' : 'Nịnh nọt ngọt ngào'}</span></p>
                  </div>
                </div>

                <button
                  type="button"
                  id="finish-assessment-plan"
                  onClick={handleDone}
                  className="w-full sm:w-auto px-10 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 text-white font-black text-sm shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center mx-auto gap-2"
                >
                  Phần thưởng của sếp đây! <Award className="w-4 h-4 text-yellow-200" />
                </button>
              </>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
