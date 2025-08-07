// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ifcixonigaudcpamflfl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY2l4b25pZ2F1ZGNwYW1mbGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNzg4MzAsImV4cCI6MjA2ODY1NDgzMH0.X4bfUUafMQN8_2tM2xwOTiW6v8z4I3rk_zv6OoAAUKc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
