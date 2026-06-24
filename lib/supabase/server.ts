import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export function getSupabaseProjectUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return url.replace('/rest/v1', '').replace(/\/$/, '');
}

export async function createSupabaseServerClient(response?: NextResponse) {
  const cookieStore = await cookies();
  return createServerClient(
    getSupabaseProjectUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (response) { response.cookies.set(name, value, options); }
            else { cookieStore.set(name, value, options); }
          });
        },
      },
    }
  );
}