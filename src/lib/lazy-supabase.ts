/**
 * Lazily imports the Supabase client to avoid loading the 166KB bundle
 * until it's actually needed (e.g., when fetching reviews or submitting forms).
 */
export const getSupabase = async () => {
  const { supabase } = await import('@/integrations/supabase/client');
  return supabase;
};
