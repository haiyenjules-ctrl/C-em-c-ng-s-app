/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RoutineSession } from '../types';
import { TrendingDown, Award, Calendar, ChevronRight } from 'lucide-react';

interface CaringChartProps {
  history: RoutineSession[];
}

export const CaringChart: React.FC<CaringChartProps> = ({ history }) => {
  // If we have history, show a beautiful SVG chart. Otherwise, show a cute empty state.
  const hasHistory = history && history.length > 0;

  // Let's take the last 7 sessions for comparison
  const recentSessions = [...history]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-7);

  // SVG Chart Dimensions
  const width = 500;
  const height = 200;
  const padding = 35;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Render SVG elements
  const pointsBefore: string[] = [];
  const pointsAfter: string[] = [];

  recentSessions.forEach((session, idx) => {
    const x = padding + (idx * chartWidth) / Math.max(recentSessions.length - 1, 1);
    
    // Pain score runs from 1 to 10 (inverted for SVG coords: top is 0, bottom is height-padding)
    const yBefore = padding + chartHeight - ((session.painBefore - 1) * chartHeight) / 9;
    const yAfter = padding + chartHeight - ((session.painAfter - 1) * chartHeight) / 9;

    pointsBefore.push(`${x},${yBefore}`);
    pointsAfter.push(`${x},${yAfter}`);
  });

  const getDayLabel = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-[#FFFBF2] border-2 border-[#7c5637] rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-black text-sm text-[#2D3436] flex items-center gap-1.5">
            <TrendingDown className="w-5 h-5 text-[#EE6C4D]" /> Biểu Đồ "Giảm Nhiệt" Cơn Đau
          </h4>
          <p className="text-[11px] text-gray-500 font-bold">
            So sánh cấp độ mỏi cơ xương trước (đỏ) & sau (xanh mint) khi tập luyện xoa dịu
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-full border">
            {recentSessions.length} buổi gần nhất
          </span>
        </div>
      </div>

      {!hasHistory ? (
        <div className="text-center py-10 border-2 border-dashed border-[#FBAE94] rounded-2xl bg-white space-y-2">
          <span className="text-3xl block">📉</span>
          <p className="text-xs font-extrabold text-[#7a5435] uppercase">Chưa có chỉ số thống kê</p>
          <p className="text-[11px] text-gray-400 leading-relaxed max-w-sm mx-auto">
            Hãy tập ít nhất 1 bài tập, ghi nhận check-in & check-out để Cô Em phác họa bức tranh khỏe mạnh mơn mởn của bạn nha!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Responsive SVG container */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto min-w-[320px] overflow-visible"
            >
              {/* Grid Background Y-lines */}
              {[1, 3, 5, 7, 10].map((score) => {
                const y = padding + chartHeight - ((score - 1) * chartHeight) / 9;
                return (
                  <g key={score} className="opacity-40">
                    <line
                      x1={padding}
                      y1={y}
                      x2={width - padding}
                      y2={y}
                      stroke="#82746b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding - 10}
                      y={y + 4}
                      className="text-[9px] font-black fill-gray-500 text-right"
                      textAnchor="end"
                    >
                      Cấp {score}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {recentSessions.map((session, idx) => {
                const x = padding + (idx * chartWidth) / Math.max(recentSessions.length - 1, 1);
                return (
                  <text
                    key={idx}
                    x={x}
                    y={height - padding + 18}
                    className="text-[9px] font-black fill-[#7a5435] text-center"
                    textAnchor="middle"
                  >
                    {getDayLabel(session.createdAt)}
                  </text>
                );
              })}

              {/* Graph Lines */}
              {recentSessions.length > 1 && (
                <>
                  {/* Line Before (Orange Red) */}
                  <polyline
                    fill="none"
                    stroke="#EE6C4D"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsBefore.join(' ')}
                  />
                  {/* Line After (Mint Green) */}
                  <polyline
                    fill="none"
                    stroke="#3a675a"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsAfter.join(' ')}
                  />
                </>
              )}

              {/* Points markers */}
              {recentSessions.map((session, idx) => {
                const x = padding + (idx * chartWidth) / Math.max(recentSessions.length - 1, 1);
                const yBefore = padding + chartHeight - ((session.painBefore - 1) * chartHeight) / 9;
                const yAfter = padding + chartHeight - ((session.painAfter - 1) * chartHeight) / 9;

                return (
                  <g key={idx}>
                    {/* Before dot */}
                    <circle
                      cx={x}
                      cy={yBefore}
                      r="5"
                      fill="#EE6C4D"
                      stroke="#white"
                      strokeWidth="1.5"
                      className="hover:scale-125 transition-transform"
                    />
                    {/* After dot */}
                    <circle
                      cx={x}
                      cy={yAfter}
                      r="5"
                      fill="#BCEDDA"
                      stroke="#3a675a"
                      strokeWidth="1.5"
                      className="hover:scale-125 transition-transform"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend indicator badges */}
          <div className="flex justify-center gap-6 text-[11px] font-heavy font-black">
            <span className="flex items-center gap-1.5 text-[#EE6C4D]">
              <span className="w-3 h-3 rounded-full bg-[#EE6C4D]"></span> Trước khi xoa dịu
            </span>
            <span className="flex items-center gap-1.5 text-[#3a675a]">
              <span className="w-3 h-3 rounded-full bg-[#BCEDDA] border border-[#3a675a]"></span> Sau khi bớt nhức
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
