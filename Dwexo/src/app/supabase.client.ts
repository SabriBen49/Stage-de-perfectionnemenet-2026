import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://wbbzcmbsabkghllsglfn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiYnpjbWJzYWJrZ2hsbHNnbGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTE5ODcsImV4cCI6MjA4MTEyNzk4N30.PwcDs94AREhxLQAwEW36RUeUM_fbSSRK63DCQqEswNs'
 
);
