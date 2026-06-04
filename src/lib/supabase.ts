import { createClient } from "@supabase/supabase-js";

let browserClient: ReturnType<typeof createClient> | null = null;

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  if (browserClient) return browserClient;

  browserClient = createClient(
    cleanSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL as string),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );

  return browserClient;
}

function cleanSupabaseUrl(url: string) {
  let cleaned = url
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/$/, "");

  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }

  const parsed = new URL(cleaned);
  const hostname = parsed.hostname.includes(".") ? parsed.hostname : `${parsed.hostname}.supabase.co`;

  return `https://${hostname}`;
}
