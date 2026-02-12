
import { supabase } from '@/lib/supabase';

export interface AnalysisData {
    slopes: Record<string, Record<string, string>>;
    date: string; // Data da análise (para Official) ou criação (para Lab)
    source: 'OFFICIAL' | 'LAB';
    timestamp: number; // Para comparação fácil
}

export const fetchLatestAnalysis = async (): Promise<AnalysisData | null> => {
    try {
        // 1. Buscar a última análise OFICIAL (Rotina)
        const { data: official, error: officialError } = await supabase
            .from('analises_diarias')
            .select('slopes_json, updated_at, created_at, data')
            .order('data', { ascending: false })
            .limit(1)
            .single();

        // 2. Buscar a última análise de LABORATÓRIO (Extras)
        const { data: lab, error: labError } = await supabase
            .from('analises_extras')
            .select('slopes_json, created_at, description')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        let officialData: AnalysisData | null = null;
        let labData: AnalysisData | null = null;

        // Processar Oficial
        if (official && official.slopes_json) {
            // Usa updated_at se existir (migração nova), senão created_at
            const timeStr = official.updated_at || official.created_at;
            const timestamp = new Date(timeStr).getTime();

            let slopes = official.slopes_json;
            if (typeof slopes === 'string') {
                try { slopes = JSON.parse(slopes); } catch (e) { console.error('Error parsing official slopes', e); }
            }

            officialData = {
                slopes: slopes as Record<string, Record<string, string>>,
                date: official.data,
                source: 'OFFICIAL',
                timestamp
            };
        }

        // Processar Lab
        if (lab && lab.slopes_json) {
            const timestamp = new Date(lab.created_at).getTime();

            let slopes = lab.slopes_json;
            if (typeof slopes === 'string') {
                try { slopes = JSON.parse(slopes); } catch (e) { console.error('Error parsing lab slopes', e); }
            }

            labData = {
                slopes: slopes as Record<string, Record<string, string>>,
                date: new Date(lab.created_at).toISOString(),
                source: 'LAB',
                timestamp
            };
        }

        // Comparar e retornar a mais recente
        if (officialData && labData) {
            return officialData.timestamp > labData.timestamp ? officialData : labData;
        }

        return officialData || labData || null;

    } catch (error) {
        console.error('Erro no fetchLatestAnalysis:', error);
        return null;
    }
};
