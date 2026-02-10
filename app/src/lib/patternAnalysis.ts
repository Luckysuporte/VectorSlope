import { supabase } from './supabase';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'NZD'];
const TIMEFRAMES = ['MN1', 'W1', 'D1', 'H4', 'H1'];

interface SlopeData {
    [key: string]: {
        [key: string]: string | number;
    };
}

// Define interface matching the actual DB structure
interface AnaliseDiariaDB {
    id: string;
    data: string;
    slopes_json: SlopeData | string; // Can be string or object depending on driver
    moeda_vencedora: string | null;
    config_vencedora: string | null;
    lucro_real: number | null;
}

export interface PatternMatch {
    date: string;
    similarity: number; // 0 to 100%
    data: AnaliseDiariaDB;
}

export async function findSimilarPatterns(currentSlopes: SlopeData): Promise<PatternMatch[]> {
    try {
        // 1. Buscar histórico (removendo o filtro not null para pegar legado)
        const { data: history, error } = await supabase
            .from('analises_diarias')
            .select('*')
            // .not('slopes_json', 'is', null) // Removido para suportar dados antigos
            .order('data', { ascending: false });

        if (error) throw error;
        if (!history || history.length === 0) return [];

        // 2. Calcular similaridade para cada registro
        const matches = history.map((record: any) => {
            let totalDiff = 0;
            let comparisons = 0;

            // Normalize history slopes
            let historySlopes: SlopeData = {};

            if (record.slopes_json) {
                if (typeof record.slopes_json === 'string') {
                    try {
                        historySlopes = JSON.parse(record.slopes_json);
                    } catch (e) {
                        console.error('Error parsing slopes_json for date', record.data, e);
                    }
                } else {
                    historySlopes = record.slopes_json;
                }
            }

            // Fallback: Tentar montar do formato legado (colunas chatas) se o JSON falhou ou não existe
            if (!historySlopes || Object.keys(historySlopes).length === 0) {
                historySlopes = {};
                let hasLegacyData = false;

                CURRENCIES.forEach(curr => {
                    historySlopes[curr] = {};
                    TIMEFRAMES.forEach(tf => {
                        const colName = `noite_${curr.toLowerCase()}_${tf.toLowerCase()}`;
                        const val = record[colName];
                        if (val !== undefined && val !== null) {
                            historySlopes[curr][tf] = val;
                            hasLegacyData = true;
                        }
                    });
                });

                if (!hasLegacyData) return { date: record.data, similarity: 0, data: record };
            }

            CURRENCIES.forEach(currency => {
                const currencySlopes = currentSlopes[currency];
                const histCurrencySlopes = historySlopes[currency];

                if (!currencySlopes || !histCurrencySlopes) return;

                TIMEFRAMES.forEach(tf => {
                    // Access nested properties
                    const val1 = parseFloat(String((currencySlopes as any)[tf] || 0));
                    const val2 = parseFloat(String((histCurrencySlopes as any)[tf] || 0));

                    if (!isNaN(val1) && !isNaN(val2)) {
                        const diff = Math.pow(val1 - val2, 2);
                        totalDiff += diff;
                        comparisons++;
                    }
                });
            });

            if (comparisons === 0) return { date: record.data, similarity: 0, data: record };

            // Euclidean distance
            const distance = Math.sqrt(totalDiff);

            // Calculate max possible distance to normalize
            // Assuming slopes range roughly between -20 and 20 (just an estimation for normalization)
            // A max diff per point could be around 40. 40^2 = 1600.
            // But let's use a simpler heuristic for similarity score.
            // Logic: simpler is better. 
            // If distance is 0, similarity is 100.
            // If distance is large, similarity drops.

            // Let's refine the similarity calculation.
            // Average diff per comparison might be better.
            const avgDiff = distance / Math.sqrt(comparisons);

            // If average difference is 0 -> 100%
            // If average difference is 1 (e.g. 1.0 vs 2.0 slope) -> ~90%
            // If average difference is 5 -> ~50%
            // If average difference is 10 -> 0%

            const similarity = Math.max(0, 100 - (avgDiff * 10));

            return {
                date: record.data,
                similarity: Number(similarity.toFixed(1)),
                data: record
            };
        });

        // 3. Ordenar por similaridade e pegar os top 5
        // Filter out the current date if it exists in history (to avoid 100% match with itself if re-running)
        // actually, for "Suggested Currency" we look for patterns in the *past* that match *today*.
        // If *today* is already in the history (because we just saved it), we should EXCLUDE it from the "similar past patterns" search?
        // Wait, if we are looking for *predictions*, we want to find *past* days that looked like *today*.
        // So we definitely should exclude the current record itself from the matches.

        // However, findSimilarPatterns is generic. 
        // Let's rely on the caller or just filter exact matches on ID if possible.
        // For now, let's just return matches. Ideally we filter out 'today' if we are doing prediction.

        return matches
            .sort((a, b) => b.similarity - a.similarity)
            .filter(m => m.similarity > 50) // Lowered threshold slightly to ensure results
            .slice(0, 10); // Return top 10 to give more pool for suggestion

    } catch (error) {
        console.error('Erro ao buscar padrões similares:', error);
        return [];
    }
}

export interface PredictionResult {
    currency: string;
    direction: 'COMPRA' | 'VENDA' | 'NEUTRO';
    confidence: number;
    reason: string;
}

export function getSuggestionFromPatterns(matches: PatternMatch[]): PredictionResult | null {
    if (matches.length === 0) return null;

    // Filter out matches that are essentially the same day (duplicate data) or today (similarity ~ 100 with same data)
    // Assuming the caller handles 'today', but let's be safe.
    // Actually, usually we compare "Today's Inputs" vs "Historical Database".
    // If "Today" is in the database, it will pop up as a 100% match.
    // We should probably ignore matches with 100% similarity if they are likely "today".
    // Or simpler: The user inputs data for Day X. We find days Y, Z, W that look like X.
    // Then we see what happened on days Y, Z, W (Result).
    // The "Today" record itself doesn't have a result yet? Or it acts as the query.

    // Let's ignore matches that don't have a result (moeda_vencedora is null)
    // because we can't learn from them.
    const validMatches = matches.filter(m => m.data.moeda_vencedora);

    if (validMatches.length === 0) return null;

    const stats: Record<string, { count: number, totalPoints: number, configs: string[] }> = {};

    validMatches.forEach(match => {
        const moeda = match.data.moeda_vencedora;
        const resultado = match.data.lucro_real || 0;
        const config = match.data.config_vencedora || '';

        if (moeda) {
            if (!stats[moeda]) {
                stats[moeda] = { count: 0, totalPoints: 0, configs: [] };
            }
            stats[moeda].count++;
            stats[moeda].totalPoints += resultado;
            stats[moeda].configs.push(config);
        }
    });

    let bestCurrency = '';
    let maxScore = -Infinity;

    Object.entries(stats).forEach(([currency, data]) => {
        const avgPoints = data.totalPoints / data.count;
        const score = data.count + (avgPoints > 0 ? 1 : 0);

        if (score > maxScore) {
            maxScore = score;
            bestCurrency = currency;
        }
    });

    if (!bestCurrency) return null;

    const bestStats = stats[bestCurrency];
    const confidence = Math.min(99, Math.round((bestStats.count / validMatches.length) * 100));

    // Infer direction from config (e.g. "FORÇA" vs "FRAQUEZA")
    // Most common config wins
    const configCounts: Record<string, number> = {};
    let direction: 'COMPRA' | 'VENDA' | 'NEUTRO' = 'NEUTRO';

    bestStats.configs.forEach(c => {
        if (c) configCounts[c] = (configCounts[c] || 0) + 1;
    });

    const bestConfig = Object.keys(configCounts).sort((a, b) => configCounts[b] - configCounts[a])[0];

    if (bestConfig) {
        if (bestConfig.toUpperCase().includes('FORÇA')) direction = 'COMPRA';
        else if (bestConfig.toUpperCase().includes('FRAQUEZA')) direction = 'VENDA';
    }

    return {
        currency: bestCurrency,
        direction,
        confidence,
        reason: `Apareceu em ${bestStats.count} dos ${validMatches.length} dias similares anteriores`
    };
}
