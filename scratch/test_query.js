import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zwqjyagfffpqjdecayja.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cWp5YWdmZmZwcWpkZWNheWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NzM5MTMsImV4cCI6MjA5NzQ0OTkxM30.8PSKGLB1Oj4Pnp7YmI27XeHfhnuljJXSorelemeFBEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Querying questions from Supabase...');
  const { data, error } = await supabase.from('questions').select('*').limit(5);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Fetched Questions:');
    console.log(data);
  }
}

run();
