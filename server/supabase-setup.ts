import { createClient } from '@supabase/supabase-js';

const isTestEnv = process.env.NODE_ENV === 'test';

const supabaseUrl = isTestEnv
  ? process.env.TEST_SUPABASE_URL
  : process.env.SUPABASE_URL;
const supabaseKey = isTestEnv
  ? process.env.TEST_SUPABASE_KEY
  : process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export default createClient(
  supabaseUrl,
  supabaseKey
);
