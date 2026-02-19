import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jtmywfyosjvvbzchmgma.supabase.co'
const supabaseAnonKey = 'sb_publishable_kSOeAE718Cmnr2pEczHbrA_c0U2O--c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
