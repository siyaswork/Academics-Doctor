import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
// Standardize on VITE_SUPABASE_ANON_KEY (commonly used with Vite + Supabase)
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase env vars. See .env.example')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '')
