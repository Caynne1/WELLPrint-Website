import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ── Validate environment ──────────────────────────────────────
// Instead of silently falling back to a placeholder URL that will
// fail with cryptic errors, throw early so devs know what's wrong.

if (!supabaseUrl || !supabaseAnonKey) {
  const message =
    '[WellPrint] Missing Supabase environment variables.\n' +
    'Create a .env.local file in the project root with:\n\n' +
    '  VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=your-anon-key\n\n' +
    'Find these in Supabase Dashboard → Settings → API.'

  if (import.meta.env.PROD) {
    // In production, throw — this is a deployment misconfiguration
    throw new Error(message)
  } else {
    // In dev, warn prominently but don't crash the whole app
    console.error('═'.repeat(60))
    console.error(message)
    console.error('═'.repeat(60))
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 2, // Rate-limit realtime events
      },
    },
  }
)
