'use client';

import Link from 'next/link';

const UploadPanel = () => {
    return (
        <div className="upload-panel">
            <h2>UPLOAD PANEL</h2>

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

            <div className="upload-item">
                <div className="icon night">🌙</div>
                <div className="text">
                    <strong>MFC Noite</strong>
                    <span>Upload às 20:30</span>
                </div>
                <div className="file-icon">📄</div>
            </div>

            <div className="upload-item">
                <div className="icon morning">☀️</div>
                <div className="text">
                    <strong>MFC Manhã</strong>
                    <span>Upload às 06:30</span>
                </div>
                <div className="file-icon">📄</div>
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
