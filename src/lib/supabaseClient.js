import { createBrowserClient } from "@supabase/ssr";

// Supabase-Client initialisieren
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createSupabaseBrowserClient = () => {
    return createBrowserClient(supabaseUrl, supabaseKey)
}