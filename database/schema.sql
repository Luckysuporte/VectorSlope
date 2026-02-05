-- ============================================
-- VECTORSLOPE - ESTRUTURA DO BANCO DE DADOS
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Tabela de referência dos timeframes
CREATE TABLE IF NOT EXISTS timeframes (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  ordem INTEGER NOT NULL
);

-- Inserir os 5 timeframes
INSERT INTO timeframes (codigo, nome, ordem) VALUES
  ('MN1', 'Mensal', 1),
  ('W1', 'Semanal', 2),
  ('D1', 'Diário', 3),
  ('H4', '4 horas', 4),
  ('H1', '1 hora', 5)
ON CONFLICT (codigo) DO NOTHING;

-- Tabela de moedas
CREATE TABLE IF NOT EXISTS moedas (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL
);

INSERT INTO moedas (codigo, nome) VALUES
  ('USD', 'Dólar Americano'),
  ('EUR', 'Euro'),
  ('GBP', 'Libra Esterlina'),
  ('CHF', 'Franco Suíço'),
  ('JPY', 'Iene Japonês'),
  ('AUD', 'Dólar Australiano'),
  ('CAD', 'Dólar Canadense'),
  ('NZD', 'Dólar Neozelandês')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- MFC NOITE (Upload às 20:30)
-- Slopes dos gráficos antes do Bonoto operar
-- ============================================
CREATE TABLE IF NOT EXISTS mfc_noite (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  timeframe TEXT NOT NULL,
  usd DECIMAL(5,2),
  eur DECIMAL(5,2),
  gbp DECIMAL(5,2),
  chf DECIMAL(5,2),
  jpy DECIMAL(5,2),
  aud DECIMAL(5,2),
  cad DECIMAL(5,2),
  nzd DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(data, timeframe)
);

-- ============================================
-- MFC MANHÃ (Upload às 06:30)
-- Slopes dos gráficos após fechamento
-- ============================================
CREATE TABLE IF NOT EXISTS mfc_manha (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  timeframe TEXT NOT NULL,
  usd DECIMAL(5,2),
  eur DECIMAL(5,2),
  gbp DECIMAL(5,2),
  chf DECIMAL(5,2),
  jpy DECIMAL(5,2),
  aud DECIMAL(5,2),
  cad DECIMAL(5,2),
  nzd DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(data, timeframe)
);

-- ============================================
-- RESULTADO BONOTO (Portfolio do dia)
-- Resultado das operações do Bonoto
-- ============================================
CREATE TABLE IF NOT EXISTS resultado_bonoto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL UNIQUE,
  moeda TEXT NOT NULL,
  configuracao TEXT NOT NULL CHECK (configuracao IN ('Força', 'Fraqueza')),
  lucro_total DECIMAL(15,2) NOT NULL,
  qtd_trades INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_mfc_noite_data ON mfc_noite(data);
CREATE INDEX IF NOT EXISTS idx_mfc_noite_timeframe ON mfc_noite(timeframe);
CREATE INDEX IF NOT EXISTS idx_mfc_manha_data ON mfc_manha(data);
CREATE INDEX IF NOT EXISTS idx_mfc_manha_timeframe ON mfc_manha(timeframe);
CREATE INDEX IF NOT EXISTS idx_resultado_data ON resultado_bonoto(data);
CREATE INDEX IF NOT EXISTS idx_resultado_moeda ON resultado_bonoto(moeda);
