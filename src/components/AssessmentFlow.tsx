/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserAssessment } from '../types';
import { MascotCharacter } from './MascotCharacter';
import {
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AssessmentFlowProps {
  onComplete: (assessment: UserAssessment) => void;
  onCancel?: () => void;
  initialAssessment?: UserAssessment;
}

const RED_FLAGS = [
  { id: 'numb', label: 'Tê bì, ngứa ran lan từ cổ xuống tay hoặc từ lưng xuống hai chân' },
  { id: 'weak', label: 'Bủn rủn, yếu cơ đột ngột (cầm bút hay gõ phím bị trượt, khuỵu gối)' },
  { id: 'accident', label: 'Đau mỏi xuất hiện sau chấn thương hoặc va chạm mạnh gần đây' },
  { id: 'fever', label: 'Sốt cao kèm cứng cổ gáy đơ cứng, hoặc đầu nhức buốt đột ngột' }
];

const PAIN_AREAS = [
  { name: 'Cổ vai gáy', emoji: '🧘‍♀️', quote: 'Đầu nặng trĩu gánh cả giang sơn tập đoàn' },
  { name: 'Cổ tay', emoji: '⌨️', quote: 'Gõ phím mỏi nhừ, bấm chuột rung bẩy bẩy' },
  { name: 'Lưng trên', emoji: '🦸‍♀️', quote: 'Bả vai cứng đờ hóa đá mỏi quắn mắt' },
  { name: 'Thắt lưng', emoji: '🪑', quote: 'Ngồi lâu mỏi hông nhói lưng ê rã đùi' },
  { name: 'Mắt', emoji: '👀', quote: 'Dòm màn hình khô khát mệt đờ đẫn' },
  { name: 'Đầu', emoji: '💆‍♀️', quote: 'Suy sụp bốc hỏa, thái dương căng đứt óc' }
];

export const AssessmentFlow: React.FC<AssessmentFlowProps> = ({
  onComplete,
  onCancel,
  initialAssessment,
}) => {
  const [painArea, setPainArea] = useState<string>(initialAssessment?.painArea || 'Cổ vai gáy');
  const [painScore, setPainScore] = useState<number>(initialAssessment?.painScore || 5);
  const [location, setLocation] = useState<string>(initialAssessment?.location || 'Văn phòng');
  const [availableTime, setAvailableTime] = useState<number>(initialAssessment?.availableTime || 3);
  const [selectedFlags, setSelectedFlags] = useState<string[]>(initialAssessment?.redFlags || []);
  const [showRedFlagsDetails, setShowRedFlagsDetails] = useState(false);
  const [showSafetyWarning, setShowSafetyWarning] = useState(false);

  const getPainQuote = (score: number) => {
    if (score <= 3) return 'Hơi ê nhẹ, xoa dịu tí là mướt rượt nha cưng!';
    if (score <= 6) return 'Mỏi gồng cơ bắp, xương cốt đang dỗi dạo nhức nhối!';
    if (score <= 8) return 'Đau muốn thét, gánh gối gù lưng gãy dải giang sơn!';
    return 'SOS cấp cứu! Đầu óc mụ mị muốn bốc quẻ rụng rời!';
  };

  const handleNext = () => {
    // If user has chosen red flags, show safety warning gate first
    if (selectedFlags.length > 0 && !showSafetyWarning) {
      setShowSafetyWarning(true);
      return;
    }

    onComplete({
      painArea,
      painScore,
      location,
      availableTime,
      redFlags: selectedFlags,
    });
  };

  const toggleFlag = (flagId: string) => {
    if (selectedFlags.includes(flagId)) {
      setSelectedFlags(selectedFlags.filter((f) => f !== flagId));
    } else {
      setSelectedFlags([...selectedFlags, flagId]);
    }
  };

  if (showSafetyWarning) {
    return (
      <div id="safety-warning-card" className="max-w-xl mx-auto bg-red-50 border-2 border-red-500 rounded-3xl p-6 md:p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto border border-red-300">
          <AlertTriangle className="w-10 h-10 text-red-600 animate-pulse" />
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-black text-red-800">Cô Em Xin Phép Không Liều Nha!</h2>
          <p className="text-sm text-red-700 leading-relaxed font-semibold">
            Dấu hiệu bạn khai báo có thể cần được kiểm tra y khoa hoặc điều trị kịp thời. "Cô Em" khuyên chân thành mình không nên liều kéo dãn thô bạo lúc này.
          </p>
          <p className="text-xs text-red-600 leading-relaxed">
            Nếu triệu chứng đau tăng nhanh, tê rần rọc cánh tay/hai chân hoặc buốt óc đột ngột, mình hãy liên hệ cơ sở y tế chuyên môn ngay nhé cưng!
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200 text-left space-y-2">
          <span className="text-[11px] font-black text-red-600 uppercase tracking-widest block">Các triệu chứng cảnh báo đỏ đã chọn:</span>
          <ul className="list-disc pl-4 text-xs font-bold text-gray-700 space-y-1">
            {selectedFlags.map(id => (
              <li key={id}>{RED_FLAGS.find(f => f.id === id)?.label}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            type="button"
            id="back-btn"
            onClick={() => {
              setSelectedFlags([]);
              setShowSafetyWarning(false);
            }}
            className="px-6 py-2.5 rounded-full border-2 border-gray-300 font-extrabold text-xs hover:bg-gray-100 bg-white"
          >
            Bỏ chọn dấu hiệu (Tập Tiếp)
          </button>
          <button
            type="button"
            id="proceed-anyway"
            onClick={() => {
              onComplete({
                painArea,
                painScore,
                location,
                availableTime,
                redFlags: selectedFlags,
              });
            }}
            className="px-6 py-2.5 rounded-full bg-red-600 text-white font-black text-xs hover:bg-red-700 shadow-md transition-all active:scale-95"
          >
            Hiểu rồi, vẫn mần bài siêu nhẹ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="quick-assessment-card" className="space-y-5">
      <div className="space-y-4">
        {/* INPUT 1: Pain Area Selection */}
        <div>
          <label className="text-xs font-black text-[#7a5435] uppercase tracking-wider block mb-2">
            1. Bạn đang mỏi nhừ ở đâu?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PAIN_AREAS.map((item) => (
              <button
                key={item.name}
                type="button"
                id={`area-${item.name}`}
                onClick={() => setPainArea(item.name)}
                className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                  painArea === item.name
                    ? 'bg-[#BCEDDA] border-[#406d60] shadow-sm transform scale-[1.02] font-black'
                    : 'bg-white border-gray-200 hover:border-orange-200'
                }`}
              >
                <span className="text-xl block mb-0.5">{item.emoji}</span>
                <span className="text-xs text-[#2D3436] font-bold block">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* INPUT 2: Location Selector */}
        <div>
          <label className="text-xs font-black text-[#7a5435] uppercase tracking-wider block mb-2">
            2. Bạn đang ở bối cảnh nào?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Văn phòng', desc: 'Có sếp, cần kín kẽ!', emoji: '🏢' },
              { name: 'Ở nhà', desc: 'Sàn, giường tự do bung lụa!', emoji: '🏠' },
              { name: 'Nơi khác', desc: 'Xây xẩm ngoài đường, nhanh!', emoji: '🌳' }
            ].map((loc) => (
              <button
                key={loc.name}
                type="button"
                id={`loc-${loc.name}`}
                onClick={() => setLocation(loc.name)}
                className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                  location === loc.name
                    ? 'bg-[#BCEDDA] border-[#406d60] shadow-sm transform scale-[1.02] font-black'
                    : 'bg-white border-gray-200 hover:border-orange-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-sm">{loc.emoji}</span>
                  <span className="text-xs text-[#2D3436] font-bold">{loc.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* INPUT 3: Available Time Allocation */}
        <div>
          <label className="text-xs font-black text-[#7a5435] uppercase tracking-wider block mb-2">
            3. Quỹ thời gian bạn đang có?
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'Cấp cứu 1p', value: 1 },
              { label: 'Nhanh 3p', value: 3 },
              { label: 'Múp má 5p', value: 5 },
              { label: 'Sâu rộng 10p', value: 10 }
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                id={`time-${item.value}`}
                onClick={() => setAvailableTime(item.value)}
                className={`p-2 rounded-xl border-2 text-center transition-all ${
                  availableTime === item.value
                    ? 'bg-[#BCEDDA] border-[#406d60] shadow-sm font-black'
                    : 'bg-white border-gray-200 hover:border-orange-200'
                }`}
              >
                <span className="text-[11px] text-[#2D3436] font-extrabold block">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Pain Score Slider */}
        <div className="p-3 bg-white rounded-2xl border border-gray-200 space-y-2">
          <div className="flex justify-between items-center text-[11px] font-black text-gray-500 uppercase">
            <span>Mức đau ê ẩm ({painScore}/10)</span>
            <span className="text-xs text-[#EE6C4D] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
              {getPainQuote(painScore)}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={painScore}
            onChange={(e) => setPainScore(parseInt(e.target.value))}
            className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-[#EE6C4D]"
          />
        </div>

        {/* Red flags expandable drawer */}
        <div className="border border-red-100 rounded-2xl bg-red-50/20">
          <button
            type="button"
            id="red-flags-detector-btn"
            onClick={() => setShowRedFlagsDetails(!showRedFlagsDetails)}
            className="w-full p-3 flex justify-between items-center text-xs text-red-700 font-extrabold"
          >
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              Tôi có dính Cảnh Báo An Toàn khác không? {selectedFlags.length > 0 && <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[9px]">{selectedFlags.length}</span>}
            </span>
            {showRedFlagsDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showRedFlagsDetails && (
            <div className="p-3 pt-0 space-y-2 border-t border-red-100/50">
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-1">
                Khai thật để Cô Em loại bỏ các bài tập nguy cơ cao gây biến chứng, bảo vệ cột sống tôn quý tuyệt đối:
              </p>
              <div className="space-y-1.5">
                {RED_FLAGS.map((flag) => (
                  <label
                    key={flag.id}
                    onClick={() => toggleFlag(flag.id)}
                    className={`flex gap-2 items-start p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedFlags.includes(flag.id)
                        ? 'bg-red-50 border-red-300'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFlags.includes(flag.id)}
                      readOnly
                      className="mt-0.5 accent-red-600 shrink-0 w-3 h-3"
                    />
                    <span className="text-[10px] font-bold text-gray-700 leading-normal">
                      {flag.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2.5 pt-2">
        {onCancel && (
          <button
            type="button"
            id="cancel-assessment-btn"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full border-2 border-gray-300 font-bold text-xs hover:bg-gray-100"
          >
            Hủy bỏ
          </button>
        )}
        <button
          type="button"
          id="generate-routine-btn"
          onClick={handleNext}
          className="flex-1 px-6 py-3 rounded-full bg-[#EE6C4D] border-2 border-[#7c5637] text-white font-extrabold text-sm flex items-center justify-center gap-1.5 shadow-md hover:bg-orange-600 active:scale-95 transition-all cursor-pointer"
        >
          Tạo Lộ Trình Cấp Tốc <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
