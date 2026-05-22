/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Exercise } from '../types';
import { EXERCISES } from '../data/exercises';
import { Search, MapPin, Clock, Flame, AlertCircle, Sparkles, Heart } from 'lucide-react';

interface QuickReliefSearchProps {
  onSelectExercise: (exercise: Exercise) => void;
}

export const QuickReliefSearch: React.FC<QuickReliefSearchProps> = ({
  onSelectExercise,
}) => {
  const [query, setQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('Tất cả');
  const [selectedLocation, setSelectedLocation] = useState<string>('Tất cả');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('co_em_favs') || '[]');
    } catch {
      return [];
    }
  });

  const areas = ['Tất cả', 'Cổ vai gáy', 'Cổ tay', 'Lưng trên', 'Thắt lưng', 'Mắt', 'Đầu'];
  const locations = [
    { label: 'Tất cả bối cảnh', value: 'Tất cả' },
    { label: 'Tại bàn làm việc 🪑', value: 'Desk' },
    { label: 'Trải thảm / Sàn nhà 🧘‍♀️', value: 'Floor' },
    { label: 'Linh hoạt mọi bối cảnh 🌍', value: 'Any' }
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('co_em_favs', JSON.stringify(updated));
  };

  // Check query for red flags (Story 5: "tê lan xuống tay", "đau đầu dữ dội", etc.)
  const isQueryRisky = () => {
    const text = query.toLowerCase();
    return (
      text.includes('tê lan') ||
      text.includes('yếu cơ') ||
      text.includes('mất cảm giác') ||
      text.includes('tai nạn') ||
      text.includes('đau nhói dữ dội') ||
      text.includes('chấn thương mạnh') ||
      text.includes('đau đột ngột') ||
      text.includes('chóng mặt bất thường')
    );
  };

  // Filtering exercises
  const filteredExercises = EXERCISES.filter((ex) => {
    const matchesSearch =
      query === '' ||
      ex.name.toLowerCase().includes(query.toLowerCase()) ||
      ex.description.toLowerCase().includes(query.toLowerCase()) ||
      ex.area.toLowerCase().includes(query.toLowerCase()) ||
      ex.type.toLowerCase().includes(query.toLowerCase());

    const matchesArea = selectedArea === 'Tất cả' || ex.area === selectedArea;
    const matchesLocation = selectedLocation === 'Tất cả' || ex.locationStyle === selectedLocation;

    return matchesSearch && matchesArea && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFBF2] border-2 border-[#7c5637] rounded-3xl p-6 shadow-md space-y-4">
        <h3 className="font-black text-lg text-[#2D3436] flex items-center gap-2">
          <Search className="w-5 h-5 text-[#EE6C4D]" /> Cứu Cánh Đồng Nghiệp Khẩn Cấp
        </h3>
        <p className="text-xs text-gray-500 font-bold leading-relaxed">
          Đang đau vùng nào, ở bối cảnh nào gõ nhanh vào đây Cô Em tìm bài xịn giải vây tức tốc cho nha!
        </p>

        {/* Input search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm 'mỏi mắt', 'cổ vai gáy', 'bách hội', 'đau đầu'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border-2 border-[#7c5637] rounded-2xl p-3.5 pl-11 text-sm font-semibold focus:outline-none focus:border-[#EE6C4D] focus:ring-2 focus:ring-[#EE6C4D]/20 placeholder-gray-400"
          />
          <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
        </div>

        {/* Area filters */}
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase text-gray-500 block tracking-wider">
            Chọn Theo Vùng Đau:
          </span>
          <div className="flex flex-wrap gap-2">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1.5 rounded-full text-xs font-black border transition-all cursor-pointer ${
                  selectedArea === area
                    ? 'bg-[#EE6C4D] text-white border-[#7c5637]'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-orange-200'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Location filters */}
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase text-gray-500 block tracking-wider">
            Chọn Theo Bối Cảnh Luyện Tập:
          </span>
          <div className="flex flex-wrap gap-2">
            {locations.map((loc) => (
              <button
                key={loc.value}
                onClick={() => setSelectedLocation(loc.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  selectedLocation === loc.value
                    ? 'bg-[#BCEDDA] text-[#406d60] border-[#406d60]'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-200'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Warning gate for risky keyword search query */}
      {isQueryRisky() ? (
        <div className="p-6 bg-red-50 border-2 border-red-300 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <span className="font-extrabold text-sm uppercase tracking-wide">
              Cảnh Báo An Toàn Khẩn Cấp (Red Flag)!
            </span>
          </div>
          <p className="text-xs text-red-800 leading-relaxed font-bold">
            Chào đồng nghiệp thân thương! Cô Em phát hiện từ khóa tìm kiếm của bạn tiềm ẩn triệu chứng bệnh lý nặng (ví dụ chấn thương cột sống, triệu chứng tai biến hẹp hốc mắt v.v).
          </p>
          <div className="bg-white p-4 rounded-xl border border-red-200 text-xs space-y-2">
            <p className="font-bold text-gray-700">⚠️ Bạn nên sớm thực hiện các bước sau:</p>
            <ul className="list-disc pl-4 space-y-1.5 text-gray-600 font-semibold">
              <li>Ngừng ngay bất kỳ vận động bẻ vặn cổ, hông mạnh bạo tự phát.</li>
              <li>Đặt hẹn khám tầm soát X-Quang, MRI tại cơ sở phục hồi chức năng uy tín.</li>
              <li>Theo dõi thân nhiệt phòng mờ mắt chóng mặt đột ngột liên sườn dội đau.</li>
            </ul>
          </div>
          <p className="text-[10px] text-gray-500 font-bold italic text-center">
            "Sức khỏe cột sống là tài sản quý báu. Hãy tự bảo vệ mình bạn nhé!"
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-black text-gray-500 px-1">
            <span>TÌM THẤY {filteredExercises.length} ĐỘNG TÁC PHÙ HỢP GỢI Ý</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((ex) => {
              // Get custom mascot URL to show cozy cute illustrations
              const defaultMascotUrl = ex.id.includes('02') || ex.id.includes('04') || ex.id.includes('06') || ex.id.includes('08') || ex.id.includes('10')
                ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiIsqdrGNKKpNrIzNOxfKzns3c00K2nKoFk0ZHQEmUC_tyn1RWXoIhg6aaHRLgaxkYJkM4py2MosnhTTe4I__1u3UKq5WUrz2LGxyZ7rKMDnCBJAFTuzWEn1ezK8hDKPBt1z8-Tcct8qZD7DrdyDOWrFPpb84yIS_yaipjpOMz546MfTcMKCL1At_iGiG7fkAPssIm_q_fgnjledUdnICcoo-x1gI7Ypib06y3i1F1bWEAilH7LP3o7GQgi8688QxizcX35e848Nht' // expert/wink character
                : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPLzWgvoaGl2lSjsJuS2MHid6CVqngP7R2bSkqpYfZBNIXJ1rHH7WgGqj1dNeb5XyiX5kT4Ce9vEkVyeh0gIrhPb57eNhpdz-v8zV-MyOI1rBnHA2LJTmCF8UIzLH4NbT-H5lOWNUb5AWv6CamMIqRA9UOrDeON-S6v6kukFI1-nksv5pRQlvzVryInW4KhoyBV9WeOAd_zwFxgf7tSPVtYnQB1r9AxQrjWcQJ7pHDsK7ZvRF43ZW3jTbkDfHw4QBfoWFSJDRG6__a'; // sticker pose

              // Map locations to match screen EXACTLY: Desk -> CHAIR, Floor -> FLOOR, Any -> NONE/ANY
              const getLocationLabel = (style: string) => {
                if (!style) return 'NONE';
                const s = style.toLowerCase();
                if (s === 'desk') return 'CHAIR';
                if (s === 'floor') return 'FLOOR';
                return 'NONE';
              };

              return (
                <div
                  key={ex.id}
                  onClick={() => onSelectExercise(ex)}
                  id={`exercise-card-${ex.id}`}
                  className="bg-white border-2 border-[#2D3436] rounded-2xl p-4 transition-all shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] hover:shadow-[5px_5px_0px_0px_rgba(45,52,54,1)] hover:-translate-y-0.5 cursor-pointer flex gap-4 items-center relative group"
                >
                  {/* Image Block with bold cartoon border */}
                  <div className="w-[84px] h-[84px] sm:w-[94px] sm:h-[94px] shrink-0 border-2 border-[#2D3436] rounded-2xl overflow-hidden bg-[#FFFBF2] p-0.5 flex items-center justify-center relative">
                    <img
                      src={ex.imageUrl || defaultMascotUrl}
                      alt={ex.name}
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Content Detail block */}
                  <div className="flex-1 space-y-1.5 min-w-0 pr-8">
                    <h4 className="font-black text-sm sm:text-base text-[#7c5637] leading-tight truncate">
                      {ex.name}
                    </h4>
                    
                    <p className="text-[11px] sm:text-xs text-gray-500 italic font-bold leading-relaxed line-clamp-2">
                      “{ex.description}”
                    </p>

                    {/* Pill Badges with bold line borders and offset shadow */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2.5 py-0.5 border-2 border-[#2D3436] bg-[#FFD2E5] text-[#2D3436] rounded-lg text-[9px] sm:text-[10px] font-black tracking-wide uppercase shadow-[1.5px_1.5px_0px_0px_rgba(45,52,54,1)]">
                        {ex.duration}s
                      </span>
                      <span className="px-2.5 py-0.5 border-2 border-[#2D3436] bg-[#BCEDDA] text-[#2D3436] rounded-lg text-[9px] sm:text-[10px] font-black tracking-wide uppercase shadow-[1.5px_1.5px_0px_0px_rgba(45,52,54,1)]">
                        {getLocationLabel(ex.locationStyle)}
                      </span>
                      
                      <span className="px-2 py-0.5 border border-amber-300 bg-amber-50 text-amber-800 rounded-md text-[9px] font-black uppercase whitespace-nowrap ml-auto block sm:hidden md:block lg:hidden">
                        {ex.area}
                      </span>
                    </div>
                  </div>

                  {/* Top-Right Favorite Pin */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(ex.id, e)}
                    className="absolute top-3 right-3 p-1 rounded-full bg-white/80 hover:bg-red-50 border border-slate-100 transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                    title="Yêu thích bài tập"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(ex.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center p-8 bg-white border border-gray-100 rounded-2xl space-y-2">
              <span className="text-4xl block">🔍</span>
              <p className="font-bold text-gray-600 text-sm">Cô Em tìm không ra bài nào khớp hết!</p>
              <p className="text-xs text-gray-400">Hãy thử xóa bộ lọc hoặc tìm từ khóa đơn giản khác xem sao nha.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
