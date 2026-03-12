


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT,
    plan        TEXT NOT NULL DEFAULT 'free',   -- free | pro | agency
    scripts_used INT NOT NULL DEFAULT 0,
    hooks_used   INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (new.id, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();



CREATE TABLE IF NOT EXISTS public.scripts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    topic           TEXT NOT NULL,
    niche           TEXT NOT NULL,
    platform        TEXT NOT NULL DEFAULT 'tiktok',
    duration_seconds INT NOT NULL DEFAULT 30,
    hook            TEXT,
    content         JSONB NOT NULL,   -- Full script JSON (scenes array)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);



CREATE TABLE IF NOT EXISTS public.hook_variants (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic       TEXT NOT NULL,
    niche       TEXT NOT NULL,
    platform    TEXT NOT NULL DEFAULT 'tiktok',
    variants    JSONB NOT NULL,    -- Array of {hook, style, why_it_works}
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);



CREATE TABLE IF NOT EXISTS public.trend_data (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         TEXT NOT NULL,
    category     TEXT NOT NULL,    -- sound | hashtag | format | challenge
    platform     TEXT NOT NULL,    -- tiktok | instagram
    viral_score  INT NOT NULL DEFAULT 0,
    growth_rate  TEXT,
    description  TEXT,
    best_niches  TEXT[],
    fetched_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);



CREATE TABLE IF NOT EXISTS public.creator_profiles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    niche           TEXT NOT NULL,
    platform        TEXT NOT NULL,
    follower_count  INT NOT NULL DEFAULT 0,
    avg_views       INT NOT NULL DEFAULT 0,
    rate_per_video  NUMERIC(10,2) NOT NULL DEFAULT 0,
    contact_email   TEXT NOT NULL,
    portfolio_url   TEXT,
    bio             TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);



ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hook_variants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_data       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users own their profile"
    ON public.profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users own their scripts"
    ON public.scripts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their hooks"
    ON public.hook_variants FOR ALL USING (auth.uid() = user_id);


CREATE POLICY "Trends readable by all"
    ON public.trend_data FOR SELECT USING (auth.role() = 'authenticated');


CREATE POLICY "Creators readable by all"
    ON public.creator_profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Creators insert own profile"
    ON public.creator_profiles FOR INSERT WITH CHECK (true);
