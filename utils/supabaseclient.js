import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dkavjnokcamyqaxcdtoy.supabase.co'; // ← must match your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYXZqbm9rY2FteXFheGNkdG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjA0OTIsImV4cCI6MjA2MTMzNjQ5Mn0.u5Oox7YEHUOJ3tjLeHGG79iMZ5rh7emxKst2GKVmm6I'; // ← must be the anon public key

export const supabase = createClient(supabaseUrl, supabaseKey);