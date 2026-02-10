const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Caminhos
const ENV_PATH = path.join(__dirname, '../app/.env.local');
const DATA_PATH = path.join(__dirname, '../dados_mfc.txt');

// Função para ler variáveis de ambiente manualmente
function getEnvVars() {
    try {
        const content = fs.readFileSync(ENV_PATH, 'utf8');
        const env = {};
        content.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                env[key.trim()] = value.trim();
            }
        });
        return env;
    } catch (error) {
        console.error('Erro ao ler .env.local:', error.message);
        process.exit(1);
    }
}

async function main() {
    const env = getEnvVars();
    const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
    const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

    if (!supabaseUrl || !supabaseKey) {
        console.error('URL ou Key do Supabase não encontradas.');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Lendo arquivo de dados...');
    const fileContent = fs.readFileSync(DATA_PATH, 'utf8');
    const lines = fileContent.split('\n');

    let currentDay = null;
    let dailyData = {}; // { US: { d1: x, h4: x... } }
    let batch = [];
    let count = 0;

    // Mapeamento de moedas para garantir consistência
    const currencies = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'NZD'];

    // Regex para identificar linhas importantes
    const dateRegex = /RELATÓRIO DE FORÇA DA MOEDA - DIA: (\d{4}\.\d{2}\.\d{2})/;
    const timeframeRegex = /--- Timeframe: PERIOD_(D1|H4|H1|M15) ---/;
    const velaRegex = /^Última 1\s+\|/;
    const resultRegex = /Moeda: (\w+) \| Melhor configuração: (Força|Fraqueza)\s+\| Pontos: (\d+)/;

    let currentTimeframe = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 1. Identificar Data
        const dateMatch = line.match(dateRegex);
        if (dateMatch) {
            // Se já tem dados do dia anterior processados, mas não salvos (caso de erro lógico), reseta
            // Mas a inserção acontece no final do processamento do dia (ETAPA 2)
            currentDay = dateMatch[1].replace(/\./g, '-'); // 2022-09-02
            dailyData = {};
            currencies.forEach(c => dailyData[c] = { slope_d1: null, slope_h4: null, slope_h1: null, slope_m15: null });
            continue;
        }

        if (!currentDay) continue;

        // 2. Identificar Timeframe
        const tfMatch = line.match(timeframeRegex);
        if (tfMatch) {
            currentTimeframe = tfMatch[1]; // D1, H4, H1, M15
            continue;
        }

        // 3. Ler Slope da última vela (Vela 1)
        if (currentTimeframe && line.match(velaRegex)) {
            // Ex: Última 1    | 0.76    | 0.09    | -0.46   | ...
            const parts = line.split('|').map(p => p.trim()).filter(p => p !== '');
            // parts[0] é "Última 1"
            // parts[1] é USD, parts[2] é EUR, etc. na ordem das colunas
            // A ordem das colunas no cabeçalho é fixa: USD, EUR, GBP, CHF, JPY, AUD, CAD, NZD

            // Valores começam no índice 1
            const values = parts.slice(1);

            currencies.forEach((currency, index) => {
                if (dailyData[currency]) {
                    const val = parseFloat(values[index]) || 0;
                    if (currentTimeframe === 'D1') dailyData[currency].slope_d1 = val;
                    if (currentTimeframe === 'H4') dailyData[currency].slope_h4 = val;
                    if (currentTimeframe === 'H1') dailyData[currency].slope_h1 = val;
                    if (currentTimeframe === 'M15') dailyData[currency].slope_m15 = val;
                }
            });
            continue;
        }

        // 4. Identificar Resultado (Etapa 2) e consolidar para salvar
        if (line.includes('ETAPA 2: ANÁLISE DE PONTOS')) {
            // A partir daqui vem os resultados.
            // Vamos ler as próximas linhas até achar o próximo separador ou fim
            // Mas como estamos num loop linha a linha, vamos usar uma flag ou apenas detectar a linha de resultado
        }

        const resultMatch = line.match(resultRegex);
        if (resultMatch) {
            const coin = resultMatch[1];
            const config = resultMatch[2];
            const points = parseInt(resultMatch[3]);

            if (dailyData[coin]) {
                // Preparar objeto para inserção
                const record = {
                    data: currentDay,
                    moeda: coin,
                    slope_d1: dailyData[coin].slope_d1,
                    slope_h4: dailyData[coin].slope_h4,
                    slope_h1: dailyData[coin].slope_h1,
                    slope_m15: dailyData[coin].slope_m15,
                    resultado_config: config,
                    resultado_pontos: points
                };

                batch.push(record);
            }

            // Se o batch ficar grande, salva
            if (batch.length >= 100) {
                const { error } = await supabase.from('historico_padroes').insert(batch);
                if (error) console.error('Erro ao inserir lote:', error);
                else {
                    count += batch.length;
                    console.log(`Processados ${count} registros...`);
                }
                batch = [];
            }
        }
    }

    // Inserir sobras
    if (batch.length > 0) {
        const { error } = await supabase.from('historico_padroes').insert(batch);
        if (error) console.error('Erro ao inserir lote final:', error);
        else {
            count += batch.length;
            console.log(`Finalizado! Total de ${count} registros importados.`);
        }
    }
}

main();
