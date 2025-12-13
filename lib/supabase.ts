import { createClient } from '@supabase/supabase-js';

// REPLACE THESE WITH YOUR ACTUAL SUPABASE PROJECT DETAILS
const SUPABASE_URL = 'https://ydbcjpgohxmkxpuceocc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkYmNqcGdvaHhta3hwdWNlb2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwODAxMTQsImV4cCI6MjA4MDY1NjExNH0.xBTUXIuJHIu4R1tZF8Zk3jUt9tIpoSd84TpgR5qGryE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
