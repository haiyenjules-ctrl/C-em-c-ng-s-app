import { createClient } from '@supabase/supabase-js';
import { Exercise, UserProfile, RoutineSession } from '../types';
import { EXERCISES } from '../data/exercises';

// Clean up potential quotation marks and white spaces from variables injected via process/env
const rawUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const rawKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseUrl = rawUrl.trim().replace(/^['"]|['"]$/g, '');
export const supabaseAnonKey = rawKey.trim().replace(/^['"]|['"]$/g, '');

// Lazy initialization pattern to prevent startup crashes when keys are missing
let supabaseInstance: any = null;

// Generate or retrieve anonymous user ID for tracking metrics
export const getOrGenerateUserId = (): string => {
  let userId = localStorage.getItem('co_em_supabase_user_id');
  if (!userId) {
    userId = 'usr_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('co_em_supabase_user_id', userId);
  }
  return userId;
};

export const getSupabaseClient = () => {
  const isValidUrl = /^https?:\/\//i.test(supabaseUrl);
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || !isValidUrl) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
};

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseClient() !== null;
};

// 1. DYNAMIC EXERCISE MANAGEMENT & DOCK SYNC
export const fetchExercisesFromSupabase = async (): Promise<Exercise[]> => {
  const client = getSupabaseClient();
  if (!client) {
    console.info('🔌 Supabase is not configured yet. Using offline-first static exercises database.');
    return EXERCISES;
  }

  try {
    const { data, error } = await client
      .from('exercises')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    if (data && data.length > 0) {
      // Map database snake_case fields back into our typescript camelCase Exercise schema
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        area: row.area,
        duration: row.duration,
        instructions: Array.isArray(row.instructions) ? row.instructions : JSON.parse(row.instructions || '[]'),
        commonMistakes: Array.isArray(row.common_mistakes) ? row.common_mistakes : JSON.parse(row.common_mistakes || '[]'),
        contraindications: Array.isArray(row.contraindications) ? row.contraindications : JSON.parse(row.contraindications || '[]'),
        locationStyle: row.location_style,
        type: row.exercise_type,
        imageUrl: row.image_url || undefined,
      }));
    }

    console.warn('⚠️ Supabase exercises table is empty. Auto-seeding active exercises...');
    await seedExercisesToSupabase();
    return EXERCISES;
  } catch (err) {
    console.error('Error fetching exercises from Supabase. Falling back to local copy:', err);
    return EXERCISES;
  }
};

// Seeding engine to easily populate standard 50 exercises to newly provisioned Databases
export const seedExercisesToSupabase = async (): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const formatted = EXERCISES.map((ex) => ({
      id: ex.id,
      name: ex.name,
      description: ex.description,
      area: ex.area,
      duration: ex.duration,
      instructions: ex.instructions,
      common_mistakes: ex.commonMistakes,
      contraindications: ex.contraindications,
      location_style: ex.locationStyle,
      exercise_type: ex.type,
      image_url: ex.imageUrl || null,
      is_active: true
    }));

    const { error } = await client.from('exercises').upsert(formatted, { onConflict: 'id' });
    if (error) {
      console.error('Seeding failed:', error);
      return false;
    }
    console.log('🎉 Successfully seeded exercises to your Supabase instance!');
    return true;
  } catch (err) {
    console.error('Exception during seeding:', err);
    return false;
  }
};

// 2. METRICS TRACKING: Event Tracking (Clicks, views, steps, plans chosen, duration)
export const trackEventInSupabase = async (
  eventType: string,
  details: Record<string, any> = {}
): Promise<void> => {
  const userId = getOrGenerateUserId();
  const client = getSupabaseClient();

  console.log(`[Metric Tracked Logs] Event: ${eventType} | User: ${userId}`, details);

  if (!client) return;

  try {
    await client.from('user_tracking_events').insert([{
      user_id: userId,
      event_type: eventType,
      details: details,
      created_at: new Date().toISOString()
    }]);
  } catch (err) {
    console.warn('Failed to persist event metric to Supabase:', err);
  }
};

// 3. PERSISTENT USER PROFILES & SELECTED PLANS
export const saveUserProfileToSupabase = async (profile: UserProfile): Promise<void> => {
  const userId = getOrGenerateUserId();
  const client = getSupabaseClient();

  if (!client) return;

  try {
    const { error } = await client.from('user_profiles').upsert({
      user_id: userId,
      name: profile.name,
      streak: profile.streak,
      total_minutes: profile.totalMinutes,
      completed_days_count: profile.completedDaysCount,
      selected_plan: profile.selectedPlan,
      plan_start_date: profile.planStartDate,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    if (error) throw error;
  } catch (err) {
    console.warn('Failed to sync user profile to Supabase:', err);
  }
};

// 4. PERSISTENT EXERCISE SESSIONS / COMPLETED SESSIONS HISTORY
export const saveRoutineSessionToSupabase = async (session: RoutineSession): Promise<void> => {
  const userId = getOrGenerateUserId();
  const client = getSupabaseClient();

  if (!client) return;

  try {
    const { error } = await client.from('user_sessions').insert([{
      user_id: userId,
      routine_id: session.routineId,
      pain_before: session.painBefore,
      pain_after: session.painAfter,
      completed_exercises: session.completedExercises,
      skipped_exercises: session.skippedExercises,
      painful_exercises: session.painfulExercises,
      duration_spent: session.durationSpent,
      created_at: session.createdAt || new Date().toISOString()
    }]);

    if (error) throw error;
  } catch (err) {
    console.warn('Failed to persist completed route session to Supabase:', err);
  }
};
