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

-- Tabela de análises diárias (slopes de cada moeda por timeframe)
CREATE TABLE IF NOT EXISTS analises_diarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  timeframe TEXT NOT NULL REFERENCES timeframes(codigo),
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

-- Tabela de histórico MFC (resultado do dia)
CREATE TABLE IF NOT EXISTS historico_mfc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL UNIQUE,
  moeda_vencedora TEXT NOT NULL REFERENCES moedas(codigo),
  configuracao TEXT NOT NULL CHECK (configuracao IN ('Força', 'Fraqueza')),
  pontos INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de padrões identificados
CREATE TABLE IF NOT EXISTS padroes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  moeda TEXT NOT NULL REFERENCES moedas(codigo),
  configuracao TEXT NOT NULL CHECK (configuracao IN ('Força', 'Fraqueza')),
  taxa_acerto DECIMAL(5,2),
  total_ocorrencias INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_analises_data ON analises_diarias(data);
CREATE INDEX IF NOT EXISTS idx_analises_timeframe ON analises_diarias(timeframe);
CREATE INDEX IF NOT EXISTS idx_historico_data ON historico_mfc(data);
CREATE INDEX IF NOT EXISTS idx_historico_moeda ON historico_mfc(moeda_vencedora);
