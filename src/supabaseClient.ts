import { createClient } from '@supabase/supabase-js';

// Replace these with YOUR real values
const supabaseUrl = 'https://ytclsdtzpgfcmgcdykfd.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Y2xzZHR6cGdmY21nY2R5a2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODQzNDYsImV4cCI6MjA2NzY2MDM0Nn0.xIZy0JJBfygScBOTm8A3zSlIqEJijALoxgIokboLDR8';

// Create a single Supabase client for your app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
