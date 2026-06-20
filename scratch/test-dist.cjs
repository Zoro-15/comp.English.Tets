const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zwqjyagfffpqjdecayja.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cWp5YWdmZmZwcWpkZWNheWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NzM5MTMsImV4cCI6MjA5NzQ0OTkxM30.8PSKGLB1Oj4Pnp7YmI27XeHfhnuljJXSorelemeFBEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase
    .from('questions')
    .select('Correct_Answer_Index, Question_ID');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const counts = {};
  data.forEach(q => {
    const val = q.Correct_Answer_Index;
    counts[val] = (counts[val] || 0) + 1;
  });

  console.log('Value distribution of Correct_Answer_Index in the database:');
  console.log(counts);
}

main();
