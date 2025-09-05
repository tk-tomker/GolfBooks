
import { supabaseClient } from '../lib/supabaseClient'

export async function createClient() {
  const cookie = use(cookies);
  const cookieStore = await cookies()
  
  return supabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle server component context
          }
        },
      },
    }
  )
}