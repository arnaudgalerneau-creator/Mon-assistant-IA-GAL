import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjliixheisrtntznqpci.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqbGlpeGhlaXNydG50em5xcGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTYwMzgsImV4cCI6MjA3NzM5MjAzOH0.DRxQL7kIjQQJDUpQsWxD_ec0j9bOkYZgeKCANg_XN-A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
