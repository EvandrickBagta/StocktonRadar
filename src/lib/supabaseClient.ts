import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are properly configured
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseUrl === 'your_supabase_project_url_here') {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not configured. Please set it in your .env.local file.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY' || supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured. Please set it in your .env.local file.');
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not configured. Please create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
