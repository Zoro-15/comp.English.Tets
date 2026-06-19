import { createClient } from '@supabase/supabase-js';

// ============================================================================
// SUPABASE CONFIGURATION
// 
// Please insert your credentials below. Alternatively, you can define them in a
// .env file in the root directory as:
// PUBLIC_SUPABASE_URL=your_supabase_url
// PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
// ============================================================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE'; // <-- INSERT YOUR SUPABASE URL HERE
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE'; // <-- INSERT YOUR SUPABASE ANON KEY HERE

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

// Check if keys are actually configured and not placeholders
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== 'YOUR_SUPABASE_URL_HERE' && 
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE' &&
  supabaseAnonKey.trim() !== '';

let supabaseInstance = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Error initializing Supabase client:', err);
  }
}

export const supabase = supabaseInstance;
