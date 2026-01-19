-- Tabell för loggade måltider
CREATE TABLE IF NOT EXISTS public.meal_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,

    -- Här är knapparna: frukost, lunch, middag, mellanmål
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    
    -- Dina makronäringsämnen
    calories INTEGER NOT NULL DEFAULT 0,
    protein_g INTEGER DEFAULT 0,
    carbs_g INTEGER DEFAULT 0,
    fat_g INTEGER DEFAULT 0,
    
    eaten_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabell för Måltidsmallar (templates)
CREATE TABLE IF NOT EXISTS public.meal_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    total_kcal INTEGER DEFAULT 0,
    total_p INTEGER DEFAULT 0,
    total_c INTEGER DEFAULT 0,
    total_f INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabell för ingrediuenser i måltidsmallar
CREATE TABLE IF NOT EXISTS public.templte_ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES public.meal_templates(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    kcal INTEGER NOT NULL,
    p INTEGER DEFAULT 0,
    c INTEGER DEFAULT 0,
    f INTEGER DEFAULT 0,
);

-- Aktivera RLS
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_ingredients ENABLE ROW LEVEL SECURITY;

-- Policies för att säkerställa att användare bara kan hantera sina egna data
CREATE POLICY "Users can manage their own meal logs" ON public.meal_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own templates" ON public.meal_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage ingredients of their templates" ON public.template_ingredients FOR ALL USING (
    EXISTS (SELECT 1 FROM public.meal_templates WHERE id = template_id AND user_id = auth.uid())
);

-- Denna policy tillåter radering om user_id på raden matchar den inloggade användaren
CREATE POLICY "Users can delete their own meal logs" 
ON public.meal_logs 
FOR DELETE 
USING (auth.uid() = user_id);