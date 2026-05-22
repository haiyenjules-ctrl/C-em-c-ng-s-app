-- ====================================================================
-- SUPABASE SCHEMA SETUP FOR CÔ EM CÔNG SỞ 💃🏼
-- Copy and execute this complete script in your Supabase SQL Editor!
-- ====================================================================

-- 1. Create Exercises table for dynamic workout updates & switches
CREATE TABLE IF NOT EXISTS public.exercises (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    area TEXT NOT NULL,
    duration INTEGER NOT NULL,
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    common_mistakes JSONB NOT NULL DEFAULT '[]'::jsonb,
    contraindications JSONB NOT NULL DEFAULT '[]'::jsonb,
    location_style TEXT NOT NULL, -- 'Desk' | 'Floor' | 'Any'
    exercise_type TEXT NOT NULL,  -- 'stretch' | 'mobility' | 'massage' | 'breathing' | 'eye'
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create User Profiles for active plans & streak data synchronization
CREATE TABLE IF NOT EXISTS public.user_profiles (
    user_id TEXT PRIMARY KEY, -- Anonymous user ID stored in localStorage or Authenticated ID
    name TEXT NOT NULL DEFAULT 'Bạn Đồng Nghiệp',
    streak INTEGER NOT NULL DEFAULT 0,
    total_minutes INTEGER NOT NULL DEFAULT 0,
    completed_days_count INTEGER NOT NULL DEFAULT 0,
    selected_plan TEXT, -- '3day' | '7day' | null
    plan_start_date TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create User Sessions table to store exercise completion history & session times
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    routine_id TEXT NOT NULL,
    pain_before INTEGER NOT NULL,
    pain_after INTEGER NOT NULL,
    completed_exercises JSONB NOT NULL DEFAULT '[]'::jsonb, -- Completed Exercise IDs array
    skipped_exercises JSONB NOT NULL DEFAULT '[]'::jsonb, -- Skipped Exercise IDs array
    painful_exercises JSONB NOT NULL DEFAULT '[]'::jsonb, -- Flagged as painful Exercise IDs
    duration_spent INTEGER NOT NULL, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create User Tracking Events table to capture step clicking details and tab interactions
CREATE TABLE IF NOT EXISTS public.user_tracking_events (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- e.g. 'tab_navigation' | 'plan_activated' | 'session_completed'
    details JSONB NOT NULL DEFAULT '{}'::jsonb, -- Additional payload data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- RLS (Row Level Security) Policies Configuration
-- For ease of testing, public inserts/selects are enabled.
-- You can tighten these up with Supabase Auth as the project scale.
-- ====================================================================

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tracking_events ENABLE ROW LEVEL SECURITY;

-- Exercises Security Policies (Public read, admin write)
CREATE POLICY "Enable read access for all users" ON public.exercises 
    FOR SELECT TO public USING (true);

CREATE POLICY "Enable all modifications for anyone in testing" ON public.exercises 
    FOR ALL TO public USING (true) WITH CHECK (true);

-- User Profiles Security Policies
CREATE POLICY "Enable read access for user profile" ON public.user_profiles 
    FOR SELECT TO public USING (true);

CREATE POLICY "Enable inserts and updates for user profile" ON public.user_profiles 
    FOR ALL TO public USING (true) WITH CHECK (true);

-- User Sessions Security Policies
CREATE POLICY "Enable insert for user sessions" ON public.user_sessions 
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Enable read access for own sessions" ON public.user_sessions 
    FOR SELECT TO public USING (true);

-- User Tracking Events Security Policies
CREATE POLICY "Enable insert for analytics events" ON public.user_tracking_events 
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Enable read access for analytics" ON public.user_tracking_events 
    FOR SELECT TO public USING (true);

-- ====================================================================
-- Useful indexes for querying tracking metadata
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_type ON public.user_tracking_events (event_type);
CREATE INDEX IF NOT EXISTS idx_tracking_events_user_id ON public.user_tracking_events (user_id);
