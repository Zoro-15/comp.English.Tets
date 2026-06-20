const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zwqjyagfffpqjdecayja.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cWp5YWdmZmZwcWpkZWNheWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NzM5MTMsImV4cCI6MjA5NzQ0OTkxM30.8PSKGLB1Oj4Pnp7YmI27XeHfhnuljJXSorelemeFBEY';

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

  console.log('Fetched questions successfully:');
  data.forEach(q => {
    console.log(`ID: ${q.Question_ID} | Correct: ${q.Correct_Answer_Index} | Option_0: ${q.Option_0} | Option_1: ${q.Option_1} | Option_2: ${q.Option_2} | Option_3: ${q.Option_3}`);
  });
}

main();
