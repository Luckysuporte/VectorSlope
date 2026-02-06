'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const UploadPanel = () => {
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const fileInputNoite = useRef<HTMLInputElement>(null);
    const fileInputManha = useRef<HTMLInputElement>(null);

    const handleClick = (ref: React.RefObject<HTMLInputElement>) => {
        ref.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'noite' | 'manha') => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(prev => ({ ...prev, [type]: true }));

        try {
            const date = new Date().toISOString().split('T')[0];
            const timestamp = Date.now();
            const fileName = `${date}_${type}_${timestamp}.${file.name.split('.').pop()}`;

            // 1. Upload para o Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('prints')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Pegar URL Pública
            const { data: { publicUrl } } = supabase.storage
                .from('prints')
                .getPublicUrl(fileName);

            // 3. Atualizar no Banco de Dados
            const column = type === 'noite' ? 'print_noite' : 'print_manha';
            const { error: dbError } = await supabase
                .from('analises_diarias')
                .update({ [column]: publicUrl })
                .eq('data', date); // Assume que é o upload para o dia de HOJE

            if (dbError) throw dbError;

            alert(`✅ Print ${type === 'noite' ? 'da Noite' : 'da Manhã'} enviado com sucesso!`);

        } catch (error: any) {
            console.error('Erro no upload:', error);
            alert('❌ Erro ao enviar imagem: ' + error.message);
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
                style={{ display: 'none' }}
            />
            <input
                type="file"
                ref={fileInputManha}
                className="hidden"
                onChange={(e) => handleFileChange(e, 'manha')}
                accept="image/*"
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
                        <span style={{ color: '#rgba(255,255,255,0.7)' }}>Preencher Slopes (20:30)</span>
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
