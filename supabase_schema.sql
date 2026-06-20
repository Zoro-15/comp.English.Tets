-- 1. Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_code VARCHAR(4) UNIQUE NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  device_token TEXT NOT NULL
);

-- 2. Create test_attempts table
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_code VARCHAR(4) REFERENCES public.users(student_code) ON DELETE CASCADE,
  test_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  correct_questions INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Set up Enable Read/Write RLS (Row Level Security) policies for anonymous access
-- Note: Adjust policies based on your production security model if needed.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read/write access to users" 
  ON public.users 
  FOR ALL 
  TO anon 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow anonymous read/write access to test_attempts" 
  ON public.test_attempts 
  FOR ALL 
  TO anon 
  USING (true) 
  WITH CHECK (true);
