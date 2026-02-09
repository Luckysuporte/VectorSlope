import { supabase, AnaliseDiaria } from './supabase';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'NZD'];
const TIMEFRAMES = ['MN1', 'W1', 'D1', 'H4', 'H1'];

interface SlopeData {
    [key: string]: {
        [key: string]: string | number;
    };
}

export interface PatternMatch {
    date: string;
    similarity: number; // 0 to 100%
    data: AnaliseDiaria;
}

export async function findSimilarPatterns(currentSlopes: SlopeData): Promise<PatternMatch[]> {
    try {
        // 1. Buscar histórico
        const { data: history, error } = await supabase
            .from('analises_diarias')
            .select('*')
            .order('data', { ascending: false });

        if (error) throw error;
        if (!history || history.length === 0) return [];

        // 2. Calcular similaridade para cada registro
        const matches = history.map((record: any) => {
            let totalDiff = 0;
            let comparisons = 0;

            CURRENCIES.forEach(currency => {
                TIMEFRAMES.forEach(tf => {
                    // Mapear input para coluna do banco (ex: noite_usd_mn1)
                    // Input: currency=USD, tf=MN1 -> DB: noite_usd_mn1
                    const dbColumn = `noite_${currency.toLowerCase()}_${tf.toLowerCase()}`;

                    const currentValue = parseFloat(currentSlopes[currency]?.[tf] as string || '0');
                    const historyValue = record[dbColumn];

                    if (!isNaN(currentValue) && historyValue !== undefined && historyValue !== null) {
                        // Diferença ao quadrado (Euclidean distance part)
                        const diff = Math.pow(currentValue - historyValue, 2);
                        totalDiff += diff;
                        comparisons++;
                    }
                });
            });

            if (comparisons === 0) return { date: record.data, similarity: 0, data: record };

            // Euclidean distance
            const distance = Math.sqrt(totalDiff);

            // Converter distância em similaridade (quanto menor a distância, maior a similaridade)
            // Uma distância de 0 = 100% similaridade
            // Ajuste empírico: assumindo que slopes variam pouco, ex: -1 a 1.
            // Distância máxima teórica depende do número de pontos.
            const maxPossibleDist = Math.sqrt(comparisons * Math.pow(2, 2)); // Pior caso aprox

            const similarity = Math.max(0, 100 - (distance * 10)); // Ajuste simples para visualização

            return {
                date: record.data,
                similarity: Number(similarity.toFixed(1)),
                data: record
            };
        });

        // 3. Ordenar por similaridade e pegar os top 5
        return matches
            .sort((a, b) => b.similarity - a.similarity)
            .filter(m => m.similarity > 70) // Filtrar resultados muito ruins
            .slice(0, 5);

    } catch (error) {
        console.error('Erro ao buscar padrões similares:', error);
        return [];
    }
}

export interface PredictionResult {
    currency: string;
    direction: 'COMPRA' | 'VENDA' | 'NEUTRO'; // Mapeado de 'Força'/'Fraqueza' se possível, ou simplificado
    confidence: number;
    reason: string;
}

export function getSuggestionFromPatterns(matches: PatternMatch[]): PredictionResult | null {
    if (matches.length === 0) return null;

    // Contar frequência das moedas sugeridas pelo Bonoto nos dias similares
    const stats: Record<string, { count: number, totalPoints: number, configs: string[] }> = {};

    matches.forEach(match => {
        const moeda = match.data.bonoto_moeda; // Ex: 'JPY'
        const resultado = match.data.bonoto_resultado || 0;
        const config = match.data.bonoto_config || '';

        if (moeda) {
            if (!stats[moeda]) {
                stats[moeda] = { count: 0, totalPoints: 0, configs: [] };
            }
            stats[moeda].count++;
            stats[moeda].totalPoints += resultado;
            stats[moeda].configs.push(config);
        }
    });

    // Encontrar a moeda mais frequente/melhor
    let bestCurrency = '';
    let maxScore = -Infinity;

    Object.entries(stats).forEach(([currency, data]) => {
        // Score simples: Frequência * (Pontos médios > 0 ? 1 : 0.5)
        // Isso é uma heurística básica
        const avgPoints = data.totalPoints / data.count;
        const score = data.count + (avgPoints > 0 ? 1 : 0); // Prioriza quem deu lucro

        if (score > maxScore) {
            maxScore = score;
            bestCurrency = currency;
        }
    });

    if (!bestCurrency) return null;

    const bestStats = stats[bestCurrency];
    const confidence = Math.min(99, Math.round((bestStats.count / matches.length) * 100)); // % de vezes que apareceu nos matches

    // Tentar inferir direção baseada na config (ex: "A Favor", "Contra", ou se temos campo de direção)
    // Por enquanto assumimos que o Bonoto opera a favor do viés, então se ele sugeriu JPY, é o foco.
    // Vamos tentar deduzir se é Força ou Fraqueza baseado no lucro? Não, isso depende do trade.
    // Vamos deixar genérico ou tentar pegar do campo 'bonoto_config' se tiver "Venda"/"Compra"

    // Simplificação: Se a moeda aparece, é o foco.
    return {
        currency: bestCurrency,
        direction: 'NEUTRO', // Placeholder, precisaria de mais dados para saber se é Compra/Venda
        confidence,
        reason: `Apareceu em ${bestStats.count} dos ${matches.length} dias similares`
    };
}
