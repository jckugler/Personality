import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string;
          name: string;
          manager_name: string;
          manager_email: string;
          invite_code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          manager_name: string;
          manager_email: string;
          invite_code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          manager_name?: string;
          manager_email?: string;
          invite_code?: string;
          created_at?: string;
        };
      };
      participants: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          email: string;
          is_manager: boolean;
          red_score: number;
          yellow_score: number;
          green_score: number;
          blue_score: number;
          x_coord: number | string;
          y_coord: number | string;
          created_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          name: string;
          email: string;
          is_manager?: boolean;
          red_score?: number;
          yellow_score?: number;
          green_score?: number;
          blue_score?: number;
          x_coord?: number;
          y_coord?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          name?: string;
          email?: string;
          is_manager?: boolean;
          red_score?: number;
          yellow_score?: number;
          green_score?: number;
          blue_score?: number;
          x_coord?: number;
          y_coord?: number;
          created_at?: string;
        };
      };
      responses: {
        Row: {
          id: string;
          participant_id: string;
          question_id: number;
          answer_value: number;
          color: "Red" | "Yellow" | "Green" | "Blue";
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_id: string;
          question_id: number;
          answer_value: number;
          color: "Red" | "Yellow" | "Green" | "Blue";
          created_at?: string;
        };
        Update: {
          id?: string;
          participant_id?: string;
          question_id?: number;
          answer_value?: number;
          color?: "Red" | "Yellow" | "Green" | "Blue";
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let browserClient: SupabaseClient<Database> | null = null;

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  if (browserClient) return browserClient;

  browserClient = createClient<Database>(
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
