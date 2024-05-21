const { createClient } = require("@supabase/supabase-js")
require('dotenv').config()

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

console.log(supabaseKey, supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase 
