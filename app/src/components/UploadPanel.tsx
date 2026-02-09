'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const UploadPanel = () => {
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const fileInputNoite = useRef<HTMLInputElement>(null);
    const fileInputManha = useRef<HTMLInputElement>(null);

    const handleClick = (ref: React.RefObject<HTMLInputElement | null>) => {
        ref.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'noite' | 'manha') => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploading(prev => ({ ...prev, [type]: true }));

        try {
            const date = new Date().toISOString().split('T')[0];
            const newUrls: string[] = [];

            // 1. Upload para o Storage (todos os arquivos)
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const timestamp = Date.now();
                const fileName = `${date}_${type}_${timestamp}_${i}.${file.name.split('.').pop()}`;

                const { error: uploadError } = await supabase.storage
                    .from('prints')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('prints')
                    .getPublicUrl(fileName);

                newUrls.push(publicUrl);
            }

            // 2. Buscar dados atuais para não sobrescrever
            const { data: existingData, error: fetchError } = await supabase
                .from('analises_diarias')
                .select(`print_${type}`)
                .eq('data', date)
                .single();

            // Se não encontrar (PGRST116), tudo bem, assumimos array vazio
            // Mas upsert vai criar se não existir

            let currentUrls: string[] = [];
            const column = `print_${type}`;

            if (existingData && (existingData as any)[column]) {
                // Garantir que é array, caso venha algo diferente (mas o banco já é text[])
                const data = (existingData as any)[column];
                currentUrls = Array.isArray(data)
                    ? data
                    : [data].filter(Boolean); // Fallback para legado se não migrou direito
            }

            const updatedUrls = [...currentUrls, ...newUrls];

            // 3. Atualizar no Banco de Dados
            const { error: dbError } = await supabase
                .from('analises_diarias')
                .upsert({
                    data: date,
                    [column]: updatedUrls
                }, { onConflict: 'data' });

            if (dbError) throw dbError;

            alert(`✅ ${newUrls.length} print(s) ${type === 'noite' ? 'da Noite' : 'da Manhã'} enviado(s) com sucesso!`);

        } catch (error: any) {
            console.error('Erro no upload:', error);
            const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
            alert(`❌ Erro ao enviar imagem: ${errorMessage}`);
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
            // Limpar input
            if (event.target) event.target.value = '';
        }
    };

    return (
        <div className="upload-panel">
            <h2>UPLOAD PANEL</h2>

            {/* Inputs Ocultos */}
            <input
                type="file"
                ref={fileInputNoite}
                className="hidden"
                onChange={(e) => handleFileChange(e, 'noite')}
                accept="image/*"
                multiple
                style={{ display: 'none' }}
            />
            <input
                type="file"
                ref={fileInputManha}
                className="hidden"
                onChange={(e) => handleFileChange(e, 'manha')}
                accept="image/*"
                multiple
                style={{ display: 'none' }}
            />

            {/* Novo Botão - Nova Análise */}
            <Link href="/analise-diaria" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="upload-item" style={{
                    border: '1px solid rgba(0, 212, 255, 0.4)',
                    background: 'rgba(0, 212, 255, 0.08)',
                    cursor: 'pointer'
                }}>
                    <div className="icon" style={{
                        background: 'linear-gradient(135deg, #00D4FF, #007bc0)',
                        boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)'
                    }}>
                        📝
                    </div>
                    <div className="text">
                        <strong style={{ color: '#00D4FF', fontSize: '16px' }}>Nova Análise</strong>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Preencher Slopes (20:30)</span>
                    </div>
                    <div className="file-icon" style={{ color: '#00D4FF', fontWeight: 'bold' }}>➔</div>
                </div>
            </Link>

            {/* MFC Noite - Clicável para Upload */}
            <div className="upload-item"
                onClick={() => handleClick(fileInputNoite)}
                style={{ cursor: 'pointer', opacity: uploading['noite'] ? 0.5 : 1 }}
            >
                <div className="icon night">🌙</div>
                <div className="text">
                    <strong>MFC Noite</strong>
                    <span>{uploading['noite'] ? 'Enviando...' : 'Clique para Upload (20:30)'}</span>
                </div>
                <div className="file-icon">
                    {uploading['noite'] ? '⏳' : '📷'}
                </div>
            </div>

            {/* MFC Manhã - Clicável para Upload */}
            <div className="upload-item"
                onClick={() => handleClick(fileInputManha)}
                style={{ cursor: 'pointer', opacity: uploading['manha'] ? 0.5 : 1 }}
            >
                <div className="icon morning">☀️</div>
                <div className="text">
                    <strong>MFC Manhã</strong>
                    <span>{uploading['manha'] ? 'Enviando...' : 'Clique para Upload (06:30)'}</span>
                </div>
                <div className="file-icon">
                    {uploading['manha'] ? '⏳' : '📷'}
                </div>
            </div>

            {/* Link para Resultado Bonoto */}
            <Link href="/resultado-diario" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="upload-item" style={{ cursor: 'pointer' }}>
                    <div className="icon result">📊</div>
                    <div className="text">
                        <strong>Resultado Bonoto</strong>
                        <span>Preencher Resultado (Dia seguinte)</span>
                    </div>
                    <div className="file-icon">➔</div>
                </div>
            </Link>

            <div className="upload-drop">
                <span className="arrow">⬆️</span>
                <p>Arraste arquivos ou clique para selecionar</p>
            </div>
        </div>
    );
};

export default UploadPanel;
