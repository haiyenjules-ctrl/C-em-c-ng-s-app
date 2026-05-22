/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserAssessment,
  Routine,
  Exercise,
  RoutineSession,
  UserProfile
} from './types';
import { MascotCharacter } from './components/MascotCharacter';
import { AssessmentFlow } from './components/AssessmentFlow';
import { RoutinePlayerComponent } from './components/RoutinePlayerComponent';
import { QuickReliefSearch } from './components/QuickReliefSearch';
import { CaringChart } from './components/CaringChart';
import { SubscriptionModal } from './components/SubscriptionModal';
import { CheckoutAndPlanInvite } from './components/CheckoutAndPlanInvite';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { EXERCISES } from './data/exercises';
import {
  isSupabaseConfigured,
  fetchExercisesFromSupabase,
  trackEventInSupabase,
  saveUserProfileToSupabase,
  saveRoutineSessionToSupabase,
  seedExercisesToSupabase,
  getOrGenerateUserId
} from './lib/supabase';
import {
  Home,
  Compass,
  TrendingDown,
  Settings,
  Flame,
  Clock,
  Sparkles,
  Calendar,
  AlertTriangle,
  Award,
  LogOut,
  MapPin,
  RefreshCw,
  Heart,
  ChevronRight,
  Info
} from 'lucide-react';

const MASCOT_QUOTES = [
  'Hế nhô đồng nghiệp! Lại gù lưng còng cổ gõ phím cúng dường tư bản rồi hả dợ? Để Cô Em bày mưu làm bài dãn bả vai sướng đét nha!',
  'Deadline dập dồn dằn vặt xương hông rồi đúng hơm cưng ơi? Đừng có bẻ lưng răng rắc gãy cốt sườn! Vào đây Cô Em trị liệu xịn xò nè!',
  'Dòm màn hình riết mắt dại như gà đực rồi đó nha! Úp tay sưởi ấm bọng mắt tầm 30 giây để khôi phục thần nhãn đi nè!',
  'Đau ở đâu, Cô Em bứng sạch đau nhức ở đó cho nha! Task việc thì vô tận chớ cột sống thắt lưng có một cái hà!',
  'Sếp mới thúc task hả? Thở bong bóng trút mệt mỏi ngay đi kẻo bốc quả đầu óc lầm lỡ đó nhen đồng nghiệp thân yêu!'
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'relief' | 'progress' | 'profile'>('today');
  const [assessment, setAssessment] = useState<UserAssessment | null>(() => {
    try {
      const saved = localStorage.getItem('co_em_assessment');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('co_em_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Bạn Đồng Nghiệp',
      streak: 0,
      totalMinutes: 0,
      completedDaysCount: 0,
      selectedPlan: '3day',
      planStartDate: new Date().toISOString(),
      history: []
    };
  });

  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [isPlayingRoutine, setIsPlayingRoutine] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlaySingleExercise, setActivePlaySingleExercise] = useState<Exercise | null>(null);
  const [activeDetailExercise, setActiveDetailExercise] = useState<Exercise | null>(null);
  const [customImages, setCustomImages] = useState<{ [key: string]: string }>(() => {
    try {
      return JSON.parse(localStorage.getItem('co_em_custom_images') || '{}');
    } catch {
      return {};
    }
  });

  const saveCustomImage = (exerciseId: string, url: string) => {
    const updated = { ...customImages, [exerciseId]: url };
    setCustomImages(updated);
    localStorage.setItem('co_em_custom_images', JSON.stringify(updated));
  };

  const [motto, setMotto] = useState(MASCOT_QUOTES[0]);
  const [isSubOpen, setIsSubOpen] = useState(false);
  const [checkoutSession, setCheckoutSession] = useState<{
    completedIds: string[];
    skippedIds: string[];
    painfulIds: string[];
    durationSpent: number;
    routineName: string;
  } | null>(null);

  const [previewPlan, setPreviewPlan] = useState<'3day' | '7day' | '14day_vip'>(() => {
    return profile.selectedPlan || '3day';
  });
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [waitlistEmailError, setWaitlistEmailError] = useState<string | null>(null);
  const [activationSuccess, setActivationSuccess] = useState<string | null>(null);

  const [dbExercises, setDbExercises] = useState<Exercise[]>(EXERCISES);
  const [dbStatus, setDbStatus] = useState({
    configured: false,
    syncing: false,
    message: ''
  });

  useEffect(() => {
    const initDatabase = async () => {
      const isConfigured = isSupabaseConfigured();
      setDbStatus(prev => ({ ...prev, configured: isConfigured }));

      if (isConfigured) {
        setDbStatus(prev => ({ ...prev, syncing: true, message: 'Đang tải bài tập dẻo dai từ Supabase...' }));
        try {
          const fetched = await fetchExercisesFromSupabase();
          setDbExercises(fetched);
          setDbStatus(prev => ({ ...prev, message: `Hệ thống sẵn sàng! Đã nạp thành công ${fetched.length} bài tập.` }));
        } catch (err) {
          console.warn('Supabase fetch failed, continuing with offline catalog:', err);
          setDbStatus(prev => ({ ...prev, message: 'Khởi động Supabase lỗi nhẹ, dùng tạm bộ bài tập dự phòng offline nha!' }));
        } finally {
          setDbStatus(prev => ({ ...prev, syncing: false }));
        }
      } else {
        setDbStatus(prev => ({ ...prev, message: 'Đang hoạt động ở chế độ Offline-First.' }));
      }
    };
    initDatabase();
  }, []);

  useEffect(() => {
    if (profile.selectedPlan) {
      setPreviewPlan(profile.selectedPlan as '3day' | '7day');
    }
  }, [profile.selectedPlan]);

  // Trigger changing random speech sayings from Cô Em mascot & tracking metrics
  useEffect(() => {
    const idx = Math.floor(Math.random() * MASCOT_QUOTES.length);
    setMotto(MASCOT_QUOTES[idx]);
    trackEventInSupabase('tab_navigation', { destinationTab: activeTab, userAgent: navigator.userAgent });
  }, [activeTab]);

  // Sync state with LocalStorage
  useEffect(() => {
    if (assessment) {
      localStorage.setItem('co_em_assessment', JSON.stringify(assessment));
    } else {
      localStorage.removeItem('co_em_assessment');
    }
  }, [assessment]);

  useEffect(() => {
    localStorage.setItem('co_em_profile', JSON.stringify(profile));
    if (isSupabaseConfigured()) {
      saveUserProfileToSupabase(profile);
    }
  }, [profile]);

  // Request Express server backend routine generation using Gemini API
  const handleRequestRoutine = async (currentAssessment: UserAssessment) => {
    setIsGenerating(true);
    setAssessment(currentAssessment);

    // Build blocklist for exercises previously marked too painful
    const skipHistory: string[] = [];
    profile.history.forEach((session) => {
      if (session.painfulExercises) {
        skipHistory.push(...session.painfulExercises);
      }
    });

    try {
      const res = await fetch('/api/generate-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment: currentAssessment, skipHistory }),
      });

      if (!res.ok) throw new Error('API server unreachable');
      const data = await res.json();

      if (data.routine) {
        setActiveRoutine(data.routine);
      } else {
        throw new Error('No routine returned');
      }
    } catch (err) {
      console.warn('API error, falling back locally to rule-based generation client-side...', err);
      // Client-side local assessment rule builder
      const fallbackRoutine = buildLocalRuleBasedRoutine(currentAssessment, skipHistory);
      setActiveRoutine(fallbackRoutine);
    } finally {
      setIsGenerating(false);
    }
  };

  const buildLocalRuleBasedRoutine = (
    currentAssessment: UserAssessment,
    blocklist: string[]
  ): Routine => {
    const { painArea, location, availableTime } = currentAssessment;
    let candidates = dbExercises.filter((ex) => {
      if (blocklist.includes(ex.id)) return false;
      if (location === 'Văn phòng' && ex.locationStyle === 'Floor') return false;
      return ex.area.toLowerCase() === painArea.toLowerCase();
    });

    if (candidates.length === 0) {
      candidates = dbExercises.filter((ex) => !blocklist.includes(ex.id));
    }

    const maxSeconds = availableTime * 60;
    let selected: Exercise[] = [];
    let currentSum = 0;

    for (const ex of candidates) {
      if (currentSum + ex.duration <= maxSeconds) {
        selected.push(ex);
        currentSum += ex.duration;
      }
    }

    if (selected.length === 0) {
      selected = candidates.slice(0, 2);
    }

    const durationMin = Math.ceil(currentSum / 60) || 1;

    return {
      id: `local_${Date.now()}`,
      name: `Routine ${durationMin} Phút Khẩn Cấp Bớt Đau ${painArea}`,
      description: 'Bài nương chiều phục hồi nhanh tự động tính toán bởi hệ thống hỗ trợ.',
      exercises: selected,
      rationale: `Lớp AI bận cướp trà sữa sữa tươi trân châu đường đen rồi! Cô Em tự bốc dán cho bạn mấy bài xịn xò này để bớt nhức cơ ${painArea} kịp cứu bão dự án nha!`
    };
  };

  const handleRoutineCompleted = (details: {
    completedIds: string[];
    skippedIds: string[];
    painfulIds: string[];
    durationSpent: number;
  }) => {
    setIsPlayingRoutine(false);
    setActivePlaySingleExercise(null);

    setCheckoutSession({
      completedIds: details.completedIds,
      skippedIds: details.skippedIds,
      painfulIds: details.painfulIds,
      durationSpent: details.durationSpent,
      routineName: activeRoutine?.name || 'Routine Trị Liệu'
    });
  };

  const saveCompletedSessionAndCreatePlan = (
    sessionDetails: {
      completedIds: string[];
      skippedIds: string[];
      painfulIds: string[];
      durationSpent: number;
      routineName: string;
    },
    planType: '3day' | '7day',
    answers: any
  ) => {
    // Create session record
    const newSession: RoutineSession = {
      routineId: activeRoutine?.id || 'single_play',
      painBefore: assessment?.painScore || 5,
      painAfter: Math.max(1, (assessment?.painScore || 5) - 3), // assume improved!
      completedExercises: sessionDetails.completedIds,
      skippedExercises: sessionDetails.skippedIds,
      painfulExercises: sessionDetails.painfulIds,
      createdAt: new Date().toISOString(),
      durationSpent: sessionDetails.durationSpent
    };

    const addedMinutes = Math.ceil(sessionDetails.durationSpent / 60) || 1;
    const isNewDay = profile.history.length === 0 || 
      new Date(profile.history[0].createdAt).toDateString() !== new Date().toDateString();

    setProfile((prev) => ({
      ...prev,
      streak: isNewDay ? prev.streak + 1 : prev.streak,
      totalMinutes: prev.totalMinutes + addedMinutes,
      completedDaysCount: 1, // First day finished with this routine!
      selectedPlan: planType,
      planStartDate: new Date().toISOString(),
      history: [newSession, ...prev.history]
    }));

    if (isSupabaseConfigured()) {
      saveRoutineSessionToSupabase(newSession);
      trackEventInSupabase('session_completed', {
        routineId: newSession.routineId,
        painBefore: newSession.painBefore,
        painAfter: newSession.painAfter,
        planChoice: planType,
        exercisesCount: newSession.completedExercises.length,
        durationSeconds: newSession.durationSpent
      });
    }

    setCheckoutSession(null);
    setActiveRoutine(null);
    setActiveTab('today');
  };

  const saveSessionAndSkipPlan = (
    sessionDetails: {
      completedIds: string[];
      skippedIds: string[];
      painfulIds: string[];
      durationSpent: number;
      routineName: string;
    },
    painAfter: number
  ) => {
    // Create session record
    const newSession: RoutineSession = {
      routineId: activeRoutine?.id || 'single_play',
      painBefore: assessment?.painScore || 5,
      painAfter: painAfter,
      completedExercises: sessionDetails.completedIds,
      skippedExercises: sessionDetails.skippedIds,
      painfulExercises: sessionDetails.painfulIds,
      createdAt: new Date().toISOString(),
      durationSpent: sessionDetails.durationSpent
    };

    const addedMinutes = Math.ceil(sessionDetails.durationSpent / 60) || 1;
    const isNewDay = profile.history.length === 0 || 
      new Date(profile.history[0].createdAt).toDateString() !== new Date().toDateString();

    setProfile((prev) => ({
      ...prev,
      streak: isNewDay ? prev.streak + 1 : prev.streak,
      totalMinutes: prev.totalMinutes + addedMinutes,
      completedDaysCount: isNewDay ? prev.completedDaysCount + 1 : prev.completedDaysCount,
      history: [newSession, ...prev.history]
    }));

    if (isSupabaseConfigured()) {
      saveRoutineSessionToSupabase(newSession);
      trackEventInSupabase('session_completed', {
        routineId: newSession.routineId,
        painBefore: newSession.painBefore,
        painAfter: newSession.painAfter,
        planChoice: profile.selectedPlan || 'none',
        exercisesCount: newSession.completedExercises.length,
        durationSeconds: newSession.durationSpent
      });
    }

    setCheckoutSession(null);
    setActiveRoutine(null);
    setActiveTab('today');
  };

  const handleReset = () => {
    if (confirm('Ủa thiệt luôn hả cưng? Xóa hết lịch sử dữ liệu là Cô Em dỗi dại quên luôn bắp thịt sầu thương đó nghe nhúm sếp ơi!')) {
      setAssessment(null);
      setActiveRoutine(null);
      setProfile({
        name: 'Bạn Đồng Nghiệp',
        streak: 0,
        totalMinutes: 0,
        completedDaysCount: 0,
        selectedPlan: '3day',
        planStartDate: new Date().toISOString(),
        history: []
      });
      localStorage.clear();
    }
  };

  // Convert a single exercise play action into a small virtual routine
  const startSingleExercisePlay = (exercise: Exercise) => {
    const virtualRoutine: Routine = {
      id: `single_${exercise.id}_${Date.now()}`,
      name: `${exercise.name} (Tập nhanh)`,
      description: exercise.description,
      exercises: [exercise],
      rationale: 'Trị liệu đơn điểm khẩn cấp giải cứu nhanh sầu ẩm.'
    };
    setActiveRoutine(virtualRoutine);
    setIsPlayingRoutine(true);
  };

  // Helper: calculate weekly status (Monday -> Sunday)
  const getCurrentWeekStatus = () => {
    const weekDays = [
      { label: 'Thứ 2', short: 'Hai', done: false },
      { label: 'Thứ 3', short: 'Ba', done: false },
      { label: 'Thứ 4', short: 'Tư', done: false },
      { label: 'Thứ 5', short: 'Năm', done: false },
      { label: 'Thứ 6', short: 'Sáu', done: false },
      { label: 'Thứ 7', short: 'Bảy', done: false },
      { label: 'Chủ Nhật', short: 'CN', done: false },
    ];

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    // Calculate Monday of the current week
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);

    // Scan Monday -> Sunday
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = d.toDateString();

      weekDays[i].done = profile.history.some((h) => {
        return new Date(h.createdAt).toDateString() === dStr;
      });
    }

    return weekDays;
  };

  // Helper: compute dynamically unlocked badges with detailed progress tracking
  const getBadgeStatistics = () => {
    const completedIds = profile.history.map(h => h.completedExercises || []).flat();
    const uniqueCompletedIds = Array.from(new Set(completedIds));
    const exercisesCompleted = dbExercises.filter(ex => uniqueCompletedIds.includes(ex.id));

    const neckShoulderCount = exercisesCompleted.filter(ex => ex.area === 'Cổ vai gáy').length;
    const wristCount = exercisesCompleted.filter(ex => ex.area === 'Cổ tay').length;
    const backCount = exercisesCompleted.filter(ex => ex.area === 'Lưng trên' || ex.area === 'Thắt lưng').length;
    const eyeCount = exercisesCompleted.filter(ex => ex.area === 'Mắt' || ex.type === 'eye').length;
    const breathingCount = exercisesCompleted.filter(ex => ex.type === 'breathing' || ex.type === 'massage').length;

    return [
      {
        id: 'badge_neck',
        title: 'Mộc Cốt Vương 🦒',
        description: 'Phục khởi gân cổ, bái biệt vai gáy còng cúi.',
        requirement: 'Hoàn thành ít nhất 2 bài tập Cổ vai gáy',
        current: neckShoulderCount,
        target: 2,
        unlocked: neckShoulderCount >= 2,
        color: 'bg-[#FFEBEE] border-[#FFCDD2] text-rose-800'
      },
      {
        id: 'badge_wrist',
        title: 'Thủ Chỉ Thần Thông 💅',
        description: 'Gõ phím lả lướt, cổ tay vững chãi không run sệt.',
        requirement: 'Tập xong ít nhất 2 bài khớp/cơ Cổ tay',
        current: wristCount,
        target: 2,
        unlocked: wristCount >= 2,
        color: 'bg-[#E0F7FA] border-[#B2EBF2] text-cyan-800'
      },
      {
        id: 'badge_back',
        title: 'Thần Lực Cột Sống 🦾',
        description: 'Xương sườn dẻo dai, tư thế kiêu hãnh cản deadline.',
        requirement: 'Vượt qua 2 động tác Lưng trên / Thắt lưng',
        current: backCount,
        target: 2,
        unlocked: backCount >= 2,
        color: 'bg-[#FFF3E0] border-[#FFE0B2] text-amber-800'
      },
      {
        id: 'badge_eye',
        title: 'Tinh Hoa Thần Nhãn 👁️',
        description: 'Mắt ngời tia chớp, rành rẽ rà soát lỗi chính tả.',
        requirement: 'Thư giãn xong ít nhất 1 bài tập bảo dưỡng Mắt',
        current: eyeCount,
        target: 1,
        unlocked: eyeCount >= 1,
        color: 'bg-[#EDE7F6] border-[#D1C4E9] text-purple-800'
      },
      {
        id: 'badge_breathing',
        title: 'Bất Bại Tĩnh Tâm 🌬️',
        description: 'Hít sâu thở thong thả, gạt sếp to tiếng ra ngoài tai.',
        requirement: 'Nạp năng lượng bằng 1 bài thở bong bóng / mát xa đầu gáy',
        current: breathingCount,
        target: 1,
        unlocked: breathingCount >= 1,
        color: 'bg-[#E8F5E9] border-[#C8E6C9] text-emerald-800'
      },
      {
        id: 'badge_streak',
        title: 'Chiến Sĩ Kiên Trì 📅',
        description: 'Đồng hành chăm sóc thân cốt liên miên không lỡ nhịp.',
        requirement: 'Đạt chuỗi streak tập luyện từ 2 ngày liên tục',
        current: profile.streak,
        target: 2,
        unlocked: profile.streak >= 2,
        color: 'bg-[#FFFDE7] border-[#FFF9C4] text-yellow-850'
      }
    ];
  };

  // Calculate plan status days
  const planTotalDays = profile.selectedPlan === '7day' ? 7 : 3;
  const planCompletedDays = Math.min(planTotalDays, profile.completedDaysCount);

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#2D3436] font-sans pb-28">
      {/* Top Header Bar with delightful Vietnamese Brand Design aesthetics */}
      <header className="sticky top-0 z-40 bg-[#FFFBF2]/90 backdrop-blur-md border-b-2 border-[#7c5637] h-16 flex items-center px-4 md:px-8 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ffcba4] p-0.5 border border-[#7c5637] flex items-center justify-center overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPLzWgvoaGl2lSjsJuS2MHid6CVqngP7R2bSkqpYfZBNIXJ1rHH7WgGqj1dNeb5XyiX5kT4Ce9vEkVyeh0gIrhPb57eNhpdz-v8zV-MyOI1rBnHA2LJTmCF8UIzLH4NbT-H5lOWNUb5AWv6CamMIqRA9UOrDeON-S6v6kukFI1-nksv5pRQlvzVryInW4KhoyBV9WeOAd_zwFxgf7tSPVtYnQB1r9AxQrjWcQJ7pHDsK7ZvRF43ZW3jTbkDfHw4QBfoWFSJDRG6__a"
              alt="Mascot Logo"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="font-black text-base text-[#7c5637] leading-none flex items-center gap-1">
              Cô Em Công Sở <span className="text-[10px] text-[#EE6C4D] bg-orange-100 border border-orange-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold rotate-3">Cartoon</span>
            </h1>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block mt-0.5">Your witty office bestie</span>
          </div>
        </div>

        {/* Dynamic Streak Badge Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-orange-100 border border-orange-200 text-[#EE6C4D] px-3.5 py-1.5 rounded-full font-black text-xs shadow-sm">
            <Flame className="w-4 h-4 fill-[#EE6C4D]" />
            <span>{profile.streak} ngày</span>
          </div>
          <button
            onClick={() => setIsSubOpen(true)}
            className="hidden sm:flex bg-[#BCEDDA] text-[#406d60] border-2 border-[#406d60] font-black text-xs px-4 py-1.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Nâng Cấp VIP 🌟
          </button>
        </div>
      </header>

      {/* Main Container Views Wrapper */}
      <main className="max-w-4xl mx-auto px-4 pt-6 pb-20">
        <AnimatePresence mode="wait">
          {checkoutSession ? (
            /* ACTIVE CHECKOUT & REWARD PLAN SELECTION STREAM */
            <motion.div
              key="checkout-flow"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-4"
            >
              <CheckoutAndPlanInvite
                painBefore={assessment?.painScore || 5}
                routineName={checkoutSession.routineName}
                onPlanCreated={(planType, answers) => {
                  saveCompletedSessionAndCreatePlan(checkoutSession, planType, answers);
                }}
                onSkipPlan={(painAfter) => {
                  saveSessionAndSkipPlan(checkoutSession, painAfter);
                }}
              />
            </motion.div>
          ) : isPlayingRoutine && activeRoutine ? (
            /* ACTIVE ROUTINE PLAYER STREAM */
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-4"
            >
              <RoutinePlayerComponent
                routine={activeRoutine}
                onComplete={handleRoutineCompleted}
                customImages={customImages}
                onCancel={() => {
                  if (confirm('Ủa sấp mặt bận quá hả dợ? Bỏ ngang dở chừng là phí công Cô Em nãy giờ nhai bọt nương chiều nha cưng? Thôi bỏ thì bấm OK nha!')) {
                    setIsPlayingRoutine(false);
                    setActiveRoutine(null);
                  }
                }}
              />
            </motion.div>
          ) : (
            /* TABBED DASHBOARD CONTROLS */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* TAB 1: TODAY EXCLUSIVE ZONE */}
              {activeTab === 'today' && (
                <div className="space-y-6">
                  {/* Greeting Mascot Spotlight */}
                  <div className="bg-[#FFFBF2] border-2 border-[#7c5637] rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center gap-6">
                    <MascotCharacter
                      pose="expert"
                      speechBubble={motto}
                      className="shrink-0 scale-95"
                    />
                    <div className="space-y-4 text-center md:text-left flex-1 bg-[#FFFBF2]">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-[#7a5435] uppercase tracking-wider block">
                          Chào ngày mới sảng khoái
                        </span>
                        <h2 className="font-extrabold text-2xl text-[#2D3436]">
                          Chào thân thương, {profile.name}!
                        </h2>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-bold">
                        Hôm nay bạn tập luyện được <strong className="text-[#EE6C4D] text-sm font-black">{profile.totalMinutes} phút</strong> tích hợp sương sương rồi đó. Hãy kiên trì chăm sóc cột sống của mình đều đặn từng hiệp nha!
                      </p>
                    </div>
                  </div>

                  {!assessment ? (
                    /* Show 3 compact questions + Inline Search directly in clean flat sequence */
                    <div className="space-y-6">
                      <div className="bg-white border-2 border-[#7c5637] rounded-3xl p-5 md:p-6 shadow-md space-y-5">
                        <div className="border-b-2 border-dashed border-gray-100 pb-2">
                          <h3 className="font-black text-sm text-[#7a5435] uppercase tracking-wider flex items-center gap-1.5">
                            🏥 Hôm nay bạn đau mỏi như thế nào dợ?
                          </h3>
                        </div>
                        <AssessmentFlow onComplete={handleRequestRoutine} />
                      </div>

                      {/* Direct inline layout search link button */}
                      <div className="text-center pt-2 pb-1">
                        <button
                          onClick={() => setActiveTab('relief')}
                          className="px-6 py-3.5 bg-white border-2 border-[#7c5637] hover:border-[#EE6C4D] hover:text-[#EE6C4D] text-[#7c5637] rounded-full text-xs font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                        >
                          🔍 Tìm kiếm bài tập nhanh →
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Active Generated Routine showcase block */
                    <div className="space-y-4">
                      {isGenerating ? (
                        /* AI GENERATING TRANSITION LOADER PANEL */
                        <div className="bg-[#FFFBF2] border-2 border-dashed border-[#FBAE94] rounded-3xl p-10 text-center space-y-6">
                          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                            <RefreshCw className="w-12 h-12 text-[#EE6C4D] animate-spin" />
                            <span className="absolute text-xl">☕</span>
                          </div>
                          <div className="space-y-2">
                            <span className="bg-[#BCEDDA] text-[#406d60] border border-[#a1d0c1] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-extrabold pb-0.5">
                              Cô Em AI đang múa cọ pha trà sữa...
                            </span>
                            <h4 className="font-black text-sm text-[#2D3436] pt-1">
                              Sấp ngửa soạn bài nương chiều cột sống cho cưng đây!
                            </h4>
                            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed italic font-semibold">
                              "Mát-xa cung mọc, bóp vai bệ vệ, giãn gối gầy hông... Chờ Cô Em tí ti thôi để bưng bài dọn mỏi mệt tới sếp nhé!"
                            </p>
                          </div>
                        </div>
                      ) : activeRoutine ? (
                        /* Generated routine ready to play */
                        <div className="bg-white border-2 border-[#2D3436] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(45,52,54,1)] space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Column: Mascot & Professional Speech prescription */}
                            <div className="lg:col-span-5 flex flex-col justify-between bg-[#FFFBF2] border-2 border-[#2D3436] rounded-2xl p-5 space-y-4">
                              <div className="space-y-3">
                                <span className="bg-[#FFD2E5] text-[#2D3436] border-2 border-[#2D3436] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block shadow-[1.5px_1.5px_0px_0px_rgba(45,52,54,1)]">
                                  Lời khuyên từ Cô Em 🌸
                                </span>
                                <h4 className="font-sans font-black text-base text-[#7c5637] leading-snug">
                                  {activeRoutine.name}
                                </h4>
                                <p className="text-xs text-gray-600 leading-relaxed font-bold">
                                  “{activeRoutine.description}”
                                </p>
                              </div>

                              <div className="border-t border-dashed border-slate-300 pt-3 space-y-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase block">
                                  Liệu trình khuyên dùng
                                </span>
                                <p className="text-xs text-slate-700 italic font-medium leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-200">
                                  “{activeRoutine.rationale}”
                                </p>
                              </div>

                              <div className="flex justify-center pt-2">
                                <div className="w-20 h-20 rounded-full bg-[#ffcba4] p-0.5 border-2 border-[#2D3436] overflow-hidden">
                                  <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPLzWgvoaGl2lSjsJuS2MHid6CVqngP7R2bSkqpYfZBNIXJ1rHH7WgGqj1dNeb5XyiX5kT4Ce9vEkVyeh0gIrhPb57eNhpdz-v8zV-MyOI1rBnHA2LJTmCF8UIzLH4NbT-H5lOWNUb5AWv6CamMIqRA9UOrDeON-S6v6kukFI1-nksv5pRQlvzVryInW4KhoyBV9WeOAd_zwFxgf7tSPVtYnQB1r9AxQrjWcQJ7pHDsK7ZvRF43ZW3jTbkDfHw4QBfoWFSJDRG6__a"
                                    alt="Mascot avatar"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Right Column: Workout schedule sequence list */}
                            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center flex-wrap gap-2">
                                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                                    Danh Sách Tuyển Tập Động Tác
                                  </span>
                                  <span className="bg-[#BCEDDA] text-[#2D3436] border-2 border-[#2D3436] px-2.5 py-0.5 rounded-lg text-[10px] font-black shadow-[1.5px_1.5px_0px_0px_rgba(45,52,54,1)]">
                                    Tổng: {activeRoutine.exercises.reduce((sum, e) => sum + e.duration, 0)}s • {activeRoutine.exercises.length} bài
                                  </span>
                                </div>

                                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                                  {activeRoutine.exercises.map((ex, idx) => (
                                    <div
                                      key={ex.id}
                                      onClick={() => setActiveDetailExercise(ex)}
                                      className="p-3 bg-slate-50 hover:bg-[#FFFBF2] rounded-xl border-2 border-slate-200 hover:border-[#EE6C4D] flex items-center gap-3 mr-1 cursor-pointer transition-all active:scale-[0.99] group"
                                      title="Xem chi tiết động tác"
                                    >
                                      <span className="w-6 h-6 rounded-lg bg-[#2D3436] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-[1px_1px_0px_0px_rgba(45,52,54,0.2)] group-hover:bg-[#EE6C4D]">
                                        {idx + 1}
                                      </span>
                                      
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                          <span className="font-extrabold text-xs text-[#2D3436] truncate group-hover:text-[#EE6C4D]">
                                            {ex.name}
                                          </span>
                                          <span className="text-[10px] font-black text-[#EE6C4D] shrink-0">
                                            ⏱️ {ex.duration}s
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                                          {ex.description}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-3 pt-2">
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <button
                                    onClick={() => {
                                      setAssessment(null);
                                      setActiveRoutine(null);
                                    }}
                                    className="px-5 py-3 rounded-full border-2 border-[#2D3436] font-black text-xs hover:bg-gray-100 transition-colors cursor-pointer text-gray-700 bg-white"
                                  >
                                    🔄 Khảo sát vùng khác
                                  </button>
                                  <button
                                    onClick={() => setIsPlayingRoutine(true)}
                                    className="flex-1 bg-[#EE6C4D] text-white border-2 border-[#2D3436] rounded-full py-3.5 text-sm font-black flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(45,52,54,1)] hover:bg-[#EE6C4D]/90 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(45,52,54,1)] transition-all cursor-pointer"
                                  >
                                    Bắt đầu Trị Liệu Ngay 🚀
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Fallback assessment trigger */
                        <div className="text-center py-6">
                          <button
                            onClick={() => handleRequestRoutine(assessment)}
                            className="px-6 py-3 bg-[#EE6C4D] text-white rounded-full font-black text-sm"
                          >
                            Tạo Lại Routine Trị Liệu 🔄
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: EXPLORE & QUICK SEARCH ZONE */}
              {activeTab === 'relief' && (
                <div className="space-y-4">
                  <div className="text-center max-w-md mx-auto space-y-1 py-2">
                    <h2 className="font-black text-xl text-[#2D3436]">Kho Tàng Bài Phục Hồi Tại Chỗ</h2>
                    <p className="text-xs text-gray-400 font-semibold">
                      Cô em có sẵn 30+ bài tự luyện cấp tốc cho từng vùng kẹt khí. Nhấn đại một bài là làm tức khắc mướt mườn mượt nha!
                    </p>
                  </div>
                  <QuickReliefSearch onSelectExercise={setActiveDetailExercise} />
                </div>
              )}

              {/* TAB 3: PROGRESS & HISTORY CHARTS */}
              {activeTab === 'progress' && (
                <div className="space-y-6">
                  {/* Habit & Weekly Loyalty Calendar Card (Reaches retention & streak goals) */}
                  <div className="bg-white border-2 border-slate-200 rounded-[32px] p-6 shadow-sm space-y-5">
                    <div className="flex justify-between items-center flex-wrap gap-3">
                      <div>
                        <h3 className="font-black text-[#2D3436] text-base flex items-center gap-1.5">
                          <Calendar className="w-5 h-5 text-[#EE6C4D]" /> Hành Trình Gắn Bó & Chuỗi Thói Quen 🎯
                        </h3>
                        <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                          Đồng hành bảo vệ xương gân khỏi sự càn quét của deadline công sở mỗi ngày
                        </p>
                      </div>
                      <div className="flex gap-2.5">
                        <span className="px-3 py-1 bg-[#EE6C4D]/10 text-[#EE6C4D] rounded-full text-xs font-black border border-[#EE6C4D]/25 flex items-center gap-1">
                          🔥 Streak: {profile.streak} ngày
                        </span>
                        <span className="px-3 py-1 bg-[#BCEDDA] text-[#3a675a] rounded-full text-xs font-black border border-[#BCEDDA]/50">
                          Đồng hành: {Math.max(1, Array.from(new Set(profile.history.map(h => new Date(h.createdAt).toDateString()))).length)} ngày
                        </span>
                      </div>
                    </div>

                    {/* Interactive Weekly Habit Timeline Tracker */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-3 text-center">
                        Lịch rèn cốt tuần này (Thứ hai → Chủ nhật)
                      </span>
                      
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                        {getCurrentWeekStatus().map((day, idx) => {
                          const isToday = new Date().getDay() === (idx === 6 ? 0 : idx + 1);
                          return (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-xl border-2 text-center flex flex-col items-center justify-center gap-1 transition-all ${
                                day.done
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm'
                                  : isToday
                                  ? 'bg-orange-50 border-[#EE6C4D] text-[#EE6C4D] animate-pulse'
                                  : 'bg-white border-gray-100 text-gray-400'
                              }`}
                            >
                              <span className="text-[10px] font-black tracking-tight">{day.label}</span>
                              <span className="text-sm font-bold">
                                {day.done ? '✅' : isToday ? '⚡' : '💤'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {/* Overview Stats Bento Grid Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white border-2 border-slate-100 p-4 rounded-3xl text-center space-y-1">
                      <span className="text-2xl block">🔥</span>
                      <span className="text-base font-black text-[#2D3436] block">{profile.streak} ngày</span>
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Streak dẻo dai</span>
                    </div>
                    <div className="bg-white border-2 border-slate-100 p-4 rounded-3xl text-center space-y-1">
                      <span className="text-2xl block">⏱️</span>
                      <span className="text-base font-black text-[#2D3436] block">{profile.totalMinutes} phút</span>
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Tích lũy thư giãn</span>
                    </div>
                    <div className="bg-white border-2 border-slate-100 p-4 rounded-3xl text-center space-y-1">
                      <span className="text-2xl block">🏆</span>
                      <span className="text-base font-black text-[#2D3436] block">{profile.completedDaysCount} ngày</span>
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Chăm bón bản thân</span>
                    </div>
                    <div className="bg-white border-2 border-slate-100 p-4 rounded-3xl text-center space-y-1">
                      <span className="text-2xl block">💎</span>
                      <span className="text-base font-black text-[#2D3436] block">{profile.history.filter(h => h.painfulExercises.length > 0).length} bài</span>
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Quá đau né tránh</span>
                    </div>
                  </div>

                  {/* Render the Custom Native SVG Caring Chart */}
                  <CaringChart history={profile.history} />

                  {/* Bộ Sưu Tập Huy Hiệu Của Sếp dẻo dai */}
                  <div className="bg-white border-2 border-slate-200 rounded-[32px] p-6 shadow-sm space-y-4">
                    <div>
                      <h4 className="font-black text-sm text-[#2D3436] flex items-center gap-1.5">
                        <span className="text-xl">🏅</span> Bộ Sưu Tập Huy Hiệu Của Bạn
                      </h4>
                      <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                        Huy hiệu tự động mở khóa bừng sáng khi bạn đạt các cột mốc dãn cơ dẻo cốt thực tế!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {getBadgeStatistics().map((badge) => (
                        <div
                          key={badge.id}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2.5 ${
                            badge.unlocked
                              ? `${badge.color} shadow-[2px_2px_0px_0px_rgba(45,52,54,0.15)]`
                              : 'bg-gray-50/70 border-gray-100 text-gray-400 opacity-60'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-start">
                              <span className="text-xl">{badge.unlocked ? badge.title.split(' ').pop() : '🔒'}</span>
                              <span className="text-[9px] font-black uppercase tracking-wider bg-white/70 px-1.5 py-0.5 rounded border border-gray-200/50">
                                {badge.unlocked ? 'Đã Nhận ✨' : 'Chưa Nhận'}
                              </span>
                            </div>
                            <h5 className="font-extrabold text-xs text-gray-800 mt-1 block">
                              {badge.title}
                            </h5>
                            <p className="text-[10px] leading-relaxed font-bold text-gray-500">
                              {badge.description}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  badge.unlocked ? 'bg-current' : 'bg-gray-300'
                                }`}
                                style={{ width: `${Math.min(100, (badge.current / badge.target) * 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[9px] font-extrabold uppercase">
                              <span>Yêu cầu: {badge.requirement}</span>
                              <span className="shrink-0">{badge.current}/{badge.target}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Historical Session List logs */}
                  <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                    <h4 className="font-black text-[#2D3436] text-sm flex items-center gap-1.5">
                      <Calendar className="w-5 h-5 text-[#EE6C4D]" /> Nhật Ký Chăm Sóc Bản Thân Lành Mạnh
                    </h4>

                    <div className="space-y-2.5 divide-y divide-gray-100">
                      {profile.history.map((session, index) => (
                        <div key={index} className="pt-2.5 flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <span className="font-extrabold text-[#2D3436] block">
                              Ghi nhận buổi tập mỏi cơ {session.routineId.includes('local') ? 'Cấp cứu' : 'AI đồng pha'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-semibold block">
                              {new Date(session.createdAt).toLocaleString('vi-VN')} | Đã dãn {Math.ceil(session.durationSpent / 60) || 1} phút
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-gray-500 bg-gray-50 px-2 py-1 rounded-full border inline-block">
                              Độ mỏi: {session.painBefore}/10 → <strong className="text-emerald-700">{session.painAfter}/10</strong>
                            </span>
                          </div>
                        </div>
                      ))}

                      {profile.history.length === 0 && (
                        <div className="text-center py-6 text-xs text-gray-400 italic">
                          "Trống rỗng sầu thương... Hãy tập thử bài Quick Start ngoài kia để ghi nhật ký sướng mên nhé!"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PROFILE SETTINGS & MEDICAL MEDICAL DISCLAIMERS */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="bg-[#FFFBF2] border-2 border-[#7c5637] rounded-3xl p-6 shadow-md space-y-6">
                    <div className="border-b pb-3 flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h3 className="font-sans font-black text-lg text-[#2D3436] flex items-center gap-1.5 animate-bounce-subtle">
                          Thử Thách Độ Dẻo Cột Sống Cùng Cô Em 💃🏼
                        </h3>
                        <p className="text-[11px] text-gray-555 font-bold mt-0.5">
                          Nơi nạp cấu trúc xương dẻo dai khỏe đẹp để Cô Em lo hết giáo án dãn cơ cứu rỗi thắt lưng văn phòng nha sếp yêu!
                        </p>
                      </div>
                    </div>

                    {/* Compact personal nickname configuration */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-2 border-[#7c5637] rounded-2xl p-4 shadow-sm">
                      <div>
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Danh tánh sếp sấm sét</span>
                        <h4 className="text-xs font-black text-[#7c5637] leading-none mt-0.5">{profile.name} (Thần dãn cơ đỉnh chóp 🧘‍♀️)</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black text-gray-550 uppercase tracking-wider">Đổi biệt danh cưng xỉu:</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value || 'Bạn Đồng Nghiệp' }))}
                          placeholder="Nhập tên..."
                          className="bg-slate-50 border-2 border-slate-200 focus:border-[#EE6C4D] text-xs font-bold rounded-xl px-3 py-1.5 w-36 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Choices Card Grid */}
                    <div className="space-y-3">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                        ⚡ CHỌN LỘ TRÌNH ĐỂ KHẢO SÁT & KÍCH HOẠT:
                      </label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Plan Option 1: 3 Day Free */}
                        <div
                          onClick={() => {
                            setPreviewPlan('3day');
                            setActivationSuccess(null);
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 relative select-none ${
                            previewPlan === '3day'
                              ? 'bg-emerald-50/75 border-emerald-500 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.15)] ring-2 ring-emerald-400/20'
                              : 'bg-white border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-[#3a675a] px-2 py-0.5 rounded border border-emerald-250">
                                Miễn Phí 🚀
                              </span>
                              {profile.selectedPlan === '3day' && (
                                <span className="text-[9px] font-black text-emerald-800 bg-white border border-emerald-400 px-1.5 py-0.5 rounded-full">
                                  Đang Tập ✅
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-black text-sm text-[#7c5637] pt-1">
                              3 Ngày Cấp Tốc
                            </h4>
                            <p className="text-[10px] leading-relaxed text-gray-500 font-bold">
                              Phục vương bắp cơ tức thời, băm mỏi bả vai dập dồn trong 3 bài vàng khẩn thở.
                            </p>
                          </div>
                          <div className="text-[9px] font-extrabold text-[#3a675a] border-t border-dashed border-emerald-200/50 pt-2 flex justify-between">
                            <span>⏱️ ~3-5 phút/ngày</span>
                            <span>Huy hiệu 🦒</span>
                          </div>
                        </div>

                        {/* Plan Option 2: 7 Day Free */}
                        <div
                          onClick={() => {
                            setPreviewPlan('7day');
                            setActivationSuccess(null);
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 relative select-none ${
                            previewPlan === '7day'
                              ? 'bg-orange-50/50 border-[#EE6C4D] shadow-[4px_4px_0px_0px_rgba(238,108,77,0.15)] ring-2 ring-orange-400/20'
                              : 'bg-white border-slate-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black uppercase tracking-wider bg-orange-100 text-[#EE6C4D] px-2 py-0.5 rounded border border-orange-200/50">
                                Miễn Phí 🚀
                              </span>
                              {profile.selectedPlan === '7day' && (
                                <span className="text-[9px] font-black text-[#EE6C4D] bg-white border border-[#EE6C4D]/40 px-1.5 py-0.5 rounded-full">
                                  Đang Tập ✅
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-black text-sm text-[#7c5637] pt-1">
                              7 Ngày Trẻ Hóa
                            </h4>
                            <p className="text-[10px] leading-relaxed text-gray-550 font-bold">
                              Xây chắc thói quen dẻo cốt xương sườn, phục dũng thể lực dài hơi trước bão task việc.
                            </p>
                          </div>
                          <div className="text-[9px] font-extrabold text-[#EE6C4D] border-t border-dashed border-orange-200/50 pt-2 flex justify-between">
                            <span>⏱️ ~5-10 phút/ngày</span>
                            <span>Huy hiệu 🏅</span>
                          </div>
                        </div>

                        {/* Plan Option 3: 14 Day VIP Waitlist */}
                        <div
                          onClick={() => {
                            setPreviewPlan('14day_vip');
                            setActivationSuccess(null);
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 relative select-none ${
                            previewPlan === '14day_vip'
                              ? 'bg-amber-50/80 border-[#A16207] shadow-[4px_4px_0px_0px_rgba(245,158,11,0.15)] ring-2 ring-amber-400/20'
                              : 'bg-white border-slate-200 hover:border-amber-300 opacity-80'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                                VIP 👑
                              </span>
                              <span className="text-[8px] font-extrabold text-amber-950 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">
                                Chờ Cải Tiến ⌛
                              </span>
                            </div>
                            <h4 className="font-serif font-black text-sm text-[#7c5637] pt-1">
                              14 Ngày Thượng Hạng VIP
                            </h4>
                            <p className="text-[10px] leading-relaxed text-gray-550 font-bold">
                              Chế độ quý tộc dãn cơ cực đại giúp sếp văn phòng tỏa hào quang rực rỡ từ trong ra ngoài.
                            </p>
                          </div>
                          <div className="text-[9px] font-extrabold text-[#7c5637] border-t border-dashed border-amber-200/60 pt-2 flex justify-between">
                            <span>Đang soạn giáo án cực mới!</span>
                            <span>VIP ✨</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Details UI Section based on select selection */}
                    <div className="bg-white border-2 border-dashed border-[#7c5637]/30 rounded-2xl p-5 space-y-4 shadow-sm">
                      {previewPlan === '3day' && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-250 px-2.5 py-1 rounded">
                              📋 THỜI KHÓA BIỂU CỨU KHỚP 3 NGÀY KỲ DIỆU
                            </span>
                            <span className="text-[10px] font-black text-gray-400">NHANH GỌN TRÁNH BẠI TRẬN</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex gap-3 items-center bg-[#FFFBF2]/40 border-2 border-[#7c5637]/15 p-3 rounded-xl hover:border-emerald-300 transition-colors">
                              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                              <div className="flex-1 min-w-0">
                                <span className="font-extrabold text-xs text-gray-800 block">Ngày 1: Tiêu Diệt "Cổ Rùa" Gù Chữ C</span>
                                <span className="text-[10px] text-gray-550 font-bold block mt-0.5">Giải nén chiếc cổ chịu mỏi cực hạn từ màn hình laptop/điện thoại dốc hết tim gan.</span>
                              </div>
                            </div>
                            <div className="flex gap-3 items-center bg-[#FFFBF2]/40 border-2 border-[#7c5637]/15 p-3 rounded-xl hover:border-emerald-300 transition-colors">
                              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                              <div className="flex-1 min-w-0">
                                <span className="font-extrabold text-xs text-gray-800 block">Ngày 2: Cứu Vớt Thắt Lưng Rạn Rứt</span>
                                <span className="text-[10px] text-gray-550 font-bold block mt-0.5">Dãn eo sườn căng đầy, giải phóng năng lượng trì trệ từ ghế văn phòng cứng nhắc.</span>
                              </div>
                            </div>
                            <div className="flex gap-3 items-center bg-[#FFFBF2]/40 border-2 border-[#7c5637]/15 p-3 rounded-xl hover:border-emerald-300 transition-colors">
                              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                              <div className="flex-1 min-w-0">
                                <span className="font-extrabold text-xs text-gray-800 block">Ngày 3: Khai Sáng Thần Nhãn, Nạp Kính Quang</span>
                                <span className="text-[10px] text-gray-550 font-bold block mt-0.5">Úp lòng bàn tay sưởi ấm màng bọc mắt, luyện liếc nhìn đa chiều thông tuệ.</span>
                              </div>
                            </div>
                          </div>

                          {profile.selectedPlan === '3day' ? (
                            <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-800 rounded-xl p-3.5 text-center text-xs font-black flex items-center justify-center gap-1.5 mt-2 shadow-[2px_2px_0px_0px_rgba(16,185,129,0.1)] animate-bounce-subtle">
                              <span>🌟 LỒNG NGỰC ĐÃ SẴN SÀNG! ĐANG LUYỆN LỘ TRÌNH NÀY NGOÀI TRANG CHỦ!</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setProfile(p => ({
                                  ...p,
                                  selectedPlan: '3day',
                                  completedDaysCount: 0,
                                  planStartDate: new Date().toISOString()
                                }));
                                setActivationSuccess('Lên xe sếp ơi! Đã kích hoạt Lộ trình 3 Ngày Cứu Lưng Cấp Kỳ thành công rực rỡ. Nhanh chân phóng qua tab "Hôm Nay" để Cô Em nắn góp gáy mỏi ngay nha!');
                                trackEventInSupabase('plan_activated', { planType: '3day', ts: new Date().toISOString() });
                              }}
                              className="w-full bg-[#EE6C4D] border-2 border-[#7c5637] text-white py-3 rounded-xl font-black text-xs hover:bg-[#EE6C4D]/90 active:scale-95 transition-all text-center cursor-pointer shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] block"
                            >
                              🎯 KHAI MẠCH THÔNG CỐT: KÍCH HOẠT LỘ TRÌNH 3 NGÀY (MIỄN PHÍ)
                            </button>
                          )}
                        </div>
                      )}

                      {previewPlan === '7day' && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-2">
                            <span className="text-[10px] font-black uppercase text-orange-850 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded">
                              📋 THỜI KHÓA BIỂU KIÊN TRÌ RÌ RÌ 7 NGÀY
                            </span>
                            <span className="text-[10px] font-black text-gray-400">7 NGÀY ĐỔI VẬN CHIẾC LƯNG</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                            <div className="flex gap-2.5 items-center bg-[#FFFBF2]/40 border-2 border-[#7c5637]/15 p-2.5 rounded-xl text-left">
                              <span className="w-5 h-5 rounded bg-orange-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">1</span>
                              <span className="font-extrabold text-[11px] text-[#7c5637] truncate">Hóa giải sút gáy gót, xoa bóp đầu sọ</span>
                            </div>
                            <div className="flex gap-2.5 items-center bg-[#FFFBF2]/40 border-2 border-[#7c5637]/15 p-2.5 rounded-xl text-left">
                              <span className="w-5 h-5 rounded bg-orange-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">2</span>
                              <span className="font-extrabold text-[11px] text-[#7c5637] truncate">Vá dãn liên sườn bả vai mỏi nhừ</span>
                            </div>
                            <div className="flex gap-2.5 items-center bg-[#FFFBF2]/40 border-2 border-[#7c5637]/15 p-2.5 rounded-xl text-left">
                              <span className="w-5 h-5 rounded bg-orange-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">3</span>
                              <span className="font-extrabold text-[11px] text-[#7c5637] truncate">Khớp tay bệ phóng di chuột êm ái</span>
                            </div>
                            <div className="flex gap-2.5 items-center bg-[#FFFBF2]/40 border-2 border-[#7c5637]/15 p-2.5 rounded-xl text-left">
                              <span className="w-5 h-5 rounded bg-orange-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">4</span>
                              <span className="font-extrabold text-[11px] text-[#7c5637] truncate">Ưỡn ngực xòe căng bẻ xiêu cái gù</span>
                            </div>
                            <div className="flex gap-2.5 items-center bg-[#FFFBF2]/40 border-2 border-[#7c5637]/15 p-2.5 rounded-xl text-left">
                              <span className="w-5 h-5 rounded bg-orange-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">5</span>
                              <span className="font-extrabold text-[11px] text-[#7c5637] truncate">Dãn liên hông xua tan mệt rã rời</span>
                            </div>
                            <div className="flex gap-2.5 items-center bg-[#FFFBF2]/40 border-2 border-[#7c5637]/15 p-2.5 rounded-xl text-left">
                              <span className="w-5 h-5 rounded bg-orange-500 text-white font-black text-[10px] flex items-center justify-center shrink-0">6</span>
                              <span className="font-extrabold text-[11px] text-[#7c5637] truncate">Khai tinh thần nhãn sáng rực tìm bug</span>
                            </div>
                            <div className="flex gap-2.5 items-center bg-[#EBF7F2] border-2 border-emerald-300 p-2.5 rounded-xl text-left sm:col-span-2">
                              <span className="w-5 h-5 rounded bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">7</span>
                              <span className="font-extrabold text-[11px] text-[#2c6c4c] font-black">Hồi phục tối thượng, gân cốt bất tử! 🧘‍♀️</span>
                            </div>
                          </div>

                          {profile.selectedPlan === '7day' ? (
                            <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-800 rounded-xl p-3.5 text-center text-xs font-black flex items-center justify-center gap-1.5 mt-2 shadow-[2px_2px_0px_0px_rgba(16,185,129,0.1)]">
                              <span>🌟 CHIẾC CỘT SỐNG KIÊN ĐỊNH ĐÃ KHỞI CHẠY NGOÀI TRANG CHỦ!</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setProfile(p => ({
                                  ...p,
                                  selectedPlan: '7day',
                                  completedDaysCount: 0,
                                  planStartDate: new Date().toISOString()
                                }));
                                setActivationSuccess('Ái chà chà! Sếp lựa chọn lộ trình rèn dũa 7 ngày bền bỉ là chuẩn bài luôn. Cô Em xin quỳ rạp bái phục, xách chiếu qua tab "Hôm Nay" tập liền nha!');
                                trackEventInSupabase('plan_activated', { planType: '7day', ts: new Date().toISOString() });
                              }}
                              className="w-full bg-[#EE6C4D] border-2 border-[#7c5637] text-white py-3 rounded-xl font-black text-xs hover:bg-[#EE6C4D]/90 active:scale-95 transition-all text-center cursor-pointer shadow-[3px_3px_0px_0px_rgba(45,52,54,1)] block"
                            >
                              🎯 TRÙNG TU CỘT SỐNG: KÍCH HOẠT LỘ TRÌNH 7 NGÀY (CỰNG XỈU)
                            </button>
                          )}
                        </div>
                      )}

                      {previewPlan === '14day_vip' && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-dashed border-amber-300 pb-2">
                            <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
                              👑 LỘ TRÌNH 14 NGÀY VIP (SẮP RA MẮT)
                            </span>
                            <span className="text-[10px] font-black text-amber-600">PREMIUM UPCOMING</span>
                          </div>

                          <div className="bg-[#FFFDF6] border border-amber-200/60 rounded-xl p-4 text-xs font-bold text-amber-900 space-y-3 leading-relaxed">
                            <p>
                              🌟 <strong>Giáo án 14 Ngày Thượng Hạng VIP</strong> đang gắt gao soạn thảo! Cô Em đang tích cực nghiên cứu để mang lại nhiều bài dãn cơ sâu và vô vàn tính năng bổ ích hỗ trợ thói quen làm việc lành mạnh.
                            </p>
                            <p className="text-[10px] text-gray-500 font-semibold">
                              Điền thư điện tử dưới đây làm người tiên phong đăng ký hàng chờ. Cô Em sẽ tự gửi thư mời siêu hời giảm giá khi VIP chính thức ra mắt nhé:
                            </p>

                            {isWaitlisted ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-center"
                              >
                                <span className="text-xs font-black text-emerald-800 block">✓ ĐÃ LƯU HÀNG CHỜ SUPER VIP!</span>
                                <span className="text-[9px] text-emerald-700 block mt-0.5">Cô Em sẽ gửi thư rực rỡ tới {waitlistEmail} ngay khi cải tiến xong nhé!</span>
                              </motion.div>
                            ) : (
                              <div className="space-y-1.5">
                                <div className="flex gap-2">
                                  <input
                                    type="email"
                                    value={waitlistEmail}
                                    onChange={(e) => {
                                      setWaitlistEmail(e.target.value);
                                      if (waitlistEmailError) setWaitlistEmailError(null);
                                    }}
                                    placeholder="Nhập địa chỉ email bảo mật..."
                                    className={`flex-1 bg-white border ${
                                      waitlistEmailError ? 'border-red-400 focus:border-red-500' : 'border-amber-300 focus:border-amber-500'
                                    } focus:ring-1 focus:ring-amber-450 placeholder-gray-400 rounded-xl px-3 py-2 text-xs focus:outline-none transition-all font-semibold`}
                                  />
                                  <button
                                    onClick={() => {
                                      if (waitlistEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(waitlistEmail)) {
                                        setIsWaitlisted(true);
                                        setWaitlistEmailError(null);
                                      } else {
                                        setWaitlistEmailError('Ui da! Thư điện tử gõ thiếu nét hay sao á sếp yêu, gõ lại giúp Cô Em nhé! 😘');
                                      }
                                    }}
                                    className="bg-amber-600 hover:bg-amber-750 text-white border border-amber-800 rounded-xl px-4 py-2 font-black text-xs active:scale-95 transition-all text-center cursor-pointer shrink-0"
                                  >
                                    Đóng Dấu Chờ 🚀
                                  </button>
                                </div>
                                {waitlistEmailError && (
                                  <span className="text-[10px] text-red-500 font-bold block animate-pulse">
                                    {waitlistEmailError}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Activation Success dynamic warning alert */}
                    {activationSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center gap-3"
                      >
                        <span className="text-2xl shrink-0">🎉</span>
                        <div>
                          <p className="text-xs font-black text-emerald-850">{activationSuccess}</p>
                          <button
                            onClick={() => setActiveTab('today')}
                            className="text-[10px] font-black text-emerald-700 hover:underline mt-1 block uppercase tracking-wider"
                          >
                            Xách chiếu qua trang chủ tập ngay bài Ngày 1 →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Supabase Cloud Sync & Metrics Central */}
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-[#7c5637] uppercase tracking-wider flex items-center gap-1">
                          ☁️ Hệ Tháp Lưu Trữ Supabase Cloud
                        </label>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          dbStatus.configured 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {dbStatus.configured ? '● Đã Kết Nối' : '○ Ngoại Tuyến (Offline)'}
                        </span>
                      </div>

                      <div className="bg-slate-50 border-2 border-slate-200/55 rounded-2xl p-4 text-xs space-y-2.5">
                        <div className="flex justify-between items-center bg-white border border-slate-205 px-3 py-2 rounded-xl">
                          <span className="font-bold text-gray-400 text-[10px]">Mã Định Danh Cá Nhân (User ID)</span>
                          <span className="font-mono text-gray-700 text-[10px] bg-slate-100 px-2 py-0.5 rounded select-all font-semibold">
                            {getOrGenerateUserId()}
                          </span>
                        </div>

                        <p className="text-[10px] text-gray-550 leading-relaxed">
                          {dbStatus.configured 
                            ? '🎉 Supabase đã liên kết thành công! Hoạt động như streaks, tiến trình dãn cơ, lịch sử routine, chuyển tab hay lộ trình 3/7 ngày của sếp sẽ tự động đồng bộ hóa lên mây tức thì.' 
                            : '⚠️ Sếp chưa cài đặt biến môi trường Supabase URL & Anon Key. Ứng dụng đang chạy offline an toàn. Muốn chuyển sang cloud sync, sếp nhấn Settings cài VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY nhe!'}
                        </p>

                        {dbStatus.configured && (
                          <div className="pt-2 border-t border-dashed border-slate-200 flex flex-col gap-2">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Điều khiển dữ liệu nâng cao</span>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={async () => {
                                  if (confirm('Sếp muốn đẩy 50 bài tập phục hồi chính quy gốc lên Supabase để tự sướng/edit từ DB đúng hông?')) {
                                    setDbStatus(prev => ({ ...prev, syncing: true, message: 'Đang gieo hạt 50 bài tập dãn cơ lên mây...' }));
                                    const success = await seedExercisesToSupabase();
                                    if (success) {
                                      alert('Đã đồng bộ thành công! Sếp có thể tự do chỉnh sửa, bật tắt bài tập trực tiếp từ bảng "exercises" của Supabase dồi á!');
                                      const fetched = await fetchExercisesFromSupabase();
                                      setDbExercises(fetched);
                                      setDbStatus(prev => ({ ...prev, message: `Thành công! Đã đồng bộ ${fetched.length} bài.` }));
                                    } else {
                                      alert('Thất bại khi đẩy dữ liệu seeding. Sếp kiểm tra lại RLS hoặc schema bảng exercises trong Supabase nhe!');
                                    }
                                    setDbStatus(prev => ({ ...prev, syncing: false }));
                                  }
                                }}
                                disabled={dbStatus.syncing}
                                className="flex-1 bg-teal-50 hover:bg-teal-100 border-2 border-teal-500 text-teal-800 rounded-xl py-2 px-3 hover:shadow-sm font-black text-[11px] active:scale-95 transition-all text-center cursor-pointer disabled:opacity-50"
                              >
                                {dbStatus.syncing ? '⌛ Đang đồng bộ...' : '🚀 Seeding 50 Bài Tập'}
                              </button>

                              <button
                                onClick={async () => {
                                  setDbStatus(prev => ({ ...prev, syncing: true }));
                                  const fetched = await fetchExercisesFromSupabase();
                                  setDbExercises(fetched);
                                  alert(`Đã làm mới thành công ${fetched.length} bài tập từ Supabase!`);
                                  setDbStatus(prev => ({ ...prev, syncing: false, message: `Khởi tạo xong! Nạp ${fetched.length} bài tập.` }));
                                }}
                                disabled={dbStatus.syncing}
                                className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-gray-700 rounded-xl py-2 px-3.5 font-black text-[11px] active:scale-95 transition-all text-center cursor-pointer disabled:opacity-50"
                              >
                                🔄 Làm mới
                              </button>
                            </div>
                          </div>
                        )}

                        {dbStatus.message && (
                          <div className="text-[10px] font-bold text-[#EE6C4D] bg-orange-50 border border-orange-100 rounded-lg p-2 flex items-center gap-1 select-all">
                            <span className="animate-spin text-xs">🌀</span> {dbStatus.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reset bottom panel */}
                    <div className="border-t pt-4 flex justify-between items-center">
                      <button
                        onClick={handleReset}
                        className="px-5 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-650 font-extrabold text-xs active:scale-95 transition-transform cursor-pointer"
                      >
                        Xóa Sổ Quá Khứ, Làm Lại Cuộc Đời 🧹
                      </button>
                    </div>
                  </div>

                  {/* Strict Medical Disclaimer and Info Details */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6 space-y-3 text-xs leading-relaxed text-orange-900 font-medium">
                    <h4 className="font-black text-orange-850 flex items-center gap-1 text-sm">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-orange-600" /> Tuyên Bố Miễn Trừ Trách Nhiệm Y Khoa (Strict Disclaimer)
                    </h4>
                    <p>
                      Chào đồng nghiệp thân thương! "Cô Em Công Sở" dẫu là người tận tụy nương chiều chăm sóc cơ bắp của bạn, song Cô Em sực nhớ bản thân <strong>KHÔNG PHẢI</strong> là bác sĩ, giám định y khoa phục hồi chức năng hay chuyên gia trị liệu được cấp chứng chỉ bệnh viện.
                    </p>
                    <p>
                      Mọi nội dung, bài tập, routine AI, massage trị liệu và mẹo trong ứng dụng này chỉ mang tính chất <strong>gợi ý chăm sóc, thư giãn lành mạnh tại chỗ làm</strong> cho các triệu chứng căng cơ thông thường do ngồi say sưa nhiều giờ. Nếu bạn bị đau dai dẳng dữ dội, thoái hóa đốt sống cấp tính hoặc có bất kỳ dấu hiệu bệnh lý nguy hiểm liên quan tới đĩa đệm, thần kinh cột sống, vui lòng lập tức tìm kiếm sự chăm sóc y khoa có thẩm quyền tại các bệnh viện uy tín.
                    </p>
                    <p className="text-[10px] text-gray-400 pt-2 text-center italic">
                      "Hãy là một đồng nghiệp thông thái, khỏe mạnh để gánh deadline vinh quang nha!"
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sweet Bottom Navigation Drawer / Tab Bar */}
      {!isPlayingRoutine && (
        <nav className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#ffcba4] py-3 shadow-[0_-8px_30px_rgba(124,86,55,0.06)] flex justify-around">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'today'
                ? 'text-[#EE6C4D] font-black'
                : 'text-gray-400 font-bold hover:text-gray-500'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Hôm nay</span>
          </button>
          <button
            onClick={() => setActiveTab('relief')}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'relief'
                ? 'text-[#EE6C4D] font-black'
                : 'text-gray-400 font-bold hover:text-gray-500'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Tìm bài tập</span>
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'progress'
                ? 'text-[#EE6C4D] font-black'
                : 'text-gray-400 font-bold hover:text-gray-500'
            }`}
          >
            <TrendingDown className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Tiến độ</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'text-[#EE6C4D] font-black'
                : 'text-gray-400 font-bold hover:text-gray-500'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Cá Nhân</span>
          </button>
        </nav>
      )}

      {/* Subscription Pricing Intent Waitlist Modal Popup overlay */}
      <SubscriptionModal isOpen={isSubOpen} onClose={() => setIsSubOpen(false)} />

      {/* Dynamic Exercise Detail Modal Frame matching drawing exactly */}
      <ExerciseDetailModal
        isOpen={activeDetailExercise !== null}
        exercise={activeDetailExercise}
        onClose={() => setActiveDetailExercise(null)}
        onStartExercise={startSingleExercisePlay}
        customImages={customImages}
        onSaveCustomImage={saveCustomImage}
      />
    </div>
  );
}
