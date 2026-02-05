import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface AnaliseDiaria {
  id: number
  data: string
  // Slopes da noite
  noite_usd_mn1?: number
  noite_eur_mn1?: number
  noite_gbp_mn1?: number
  noite_chf_mn1?: number
  noite_jpy_mn1?: number
  noite_aud_mn1?: number
  noite_cad_mn1?: number
  noite_nzd_mn1?: number
  // ... outros campos
  bonoto_moeda?: string
  bonoto_config?: string
  bonoto_resultado?: number
  created_at: string
}

export interface HistoricoMFC {
  id: number
  data: string
  moeda: string
  melhor_config: string
  pontos: number
  created_at: string
}

export interface Padrao {
  id: number
  nome: string
  descricao?: string
  moeda_sugerida: string
  config_sugerida: string
  confianca: number
  vezes_identificado: number
  created_at: string
}
