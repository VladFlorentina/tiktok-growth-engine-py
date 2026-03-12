
ALTER TABLE public.trend_data
ADD COLUMN region TEXT DEFAULT 'global' NOT NULL;


ALTER TABLE public.creator_profiles
ADD COLUMN region TEXT DEFAULT 'global' NOT NULL;


CREATE INDEX idx_trend_data_region ON public.trend_data(region);
CREATE INDEX idx_creator_profiles_region ON public.creator_profiles(region);


UPDATE public.trend_data SET region = 'global' WHERE region IS NULL;
UPDATE public.creator_profiles SET region = 'global' WHERE region IS NULL;
