import { createClient } from '@supabase/supabase-js'

const base_url = 'https://qdhmobgrmpjmgawoupki.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkaG1vYmdybXBqbWdhd291cGtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MTI4MDMsImV4cCI6MjA0ODM4ODgwM30.gZbe5t0h8Y8GAd6ZQeMsKnaXOeAuFNilKnwt1QPmaBY'
const supabase = createClient(base_url, key)

export default supabase;