import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zwqjyagfffpqjdecayja.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cWp5YWdmZmZwcWpkZWNheWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NzM5MTMsImV4cCI6MjA5NzQ0OTkxM30.8PSKGLB1Oj4Pnp7YmI27XeHfhnuljJXSorelemeFBEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('Testing attempts table...');
  const { data: attemptsData, error: attemptsError } = await supabase.from('attempts').select('*').limit(1);
  console.log('attempts response:', { data: attemptsData, error: attemptsError });

  console.log('Testing test_attempts table...');
  const { data: testAttemptsData, error: testAttemptsError } = await supabase.from('test_attempts').select('*').limit(1);
  console.log('test_attempts response:', { data: testAttemptsData, error: testAttemptsError });

  console.log('Testing streaks table...');
  const { data: streaksData, error: streaksError } = await supabase.from('streaks').select('*').limit(1);
  console.log('streaks response:', { data: streaksData, error: streaksError });

  console.log('Testing user_streaks table...');
  const { data: userStreaksData, error: userStreaksError } = await supabase.from('user_streaks').select('*').limit(1);
  console.log('user_streaks response:', { data: userStreaksData, error: userStreaksError });
}

checkTables();
