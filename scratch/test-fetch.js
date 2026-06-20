const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://zwqjyagfffpqjdecayja.supabase.co';
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cWp5YWdmZmZwcWpkZWNheWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NzM5MTMsImV4cCI6MjA5NzQ0OTkxM30.8PSKGLB1Oj4Pnp7YmI27XeHfhnuljJXSorelemeFBEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('Fetching questions from Supabase...');
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('Question_ID', { ascending: true })
    .limit(5);

  if (error) {
    console.error('Error fetching questions:', error);
    return;
  }

  console.log('Fetched questions:');
  console.log(JSON.stringify(data, null, 2));
}

main();
