import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gfowvioyefwbypjfccpa.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmb3d2aW95ZWZ3YnlwamZjY3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyODUxMDMsImV4cCI6MjA4ODg2MTEwM30.TGUvmNSY68B-Y8iY6oh29qTO5GqZFtGa9-NMX5uMzM0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
