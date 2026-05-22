/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Exercise {
  id: string;
  name: string;
  description: string;
  area: string; // 'Cổ vai gáy' | 'Cổ tay' | 'Lưng trên' | 'Thắt lưng' | 'Mắt' | 'Đầu'
  duration: number; // seconds
  instructions: string[];
  commonMistakes: string[];
  contraindications: string[];
  locationStyle: 'Desk' | 'Floor' | 'Any';
  type: 'stretch' | 'mobility' | 'massage' | 'breathing' | 'eye';
  imageUrl?: string; // Optional custom instruction card illustration url
}

export interface UserAssessment {
  painArea: string;
  painScore: number; // 1 to 10
  location: string; // 'Văn phòng' | 'Ở nhà' | 'Nơi khác'
  availableTime: number; // in minutes: 1, 3, 5, 10
  redFlags: string[]; // Red flag symptoms
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  rationale: string;
}

export interface RoutineSession {
  routineId: string;
  painBefore: number;
  painAfter: number;
  completedExercises: string[]; // Exercise IDs
  skippedExercises: string[]; // Exercise IDs
  painfulExercises: string[]; // Exercises flags as "too painful"
  createdAt: string;
  durationSpent: number; // seconds
}

export interface UserProfile {
  name: string;
  streak: number;
  totalMinutes: number;
  completedDaysCount: number;
  selectedPlan: '3day' | '7day' | null;
  planStartDate: string | null;
  history: RoutineSession[];
}
