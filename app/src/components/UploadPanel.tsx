'use client';

const UploadPanel = () => {
    return (
        <div className="upload-panel">
            <h2>UPLOAD PANEL</h2>

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

            <div className="upload-item">
                <div className="icon result">📊</div>
                <div className="text">
                    <strong>Resultado Bonoto</strong>
                    <span>Upload às Portfolio do dia</span>
                </div>
                <div className="file-icon">📄</div>
            </div>

            <div className="upload-drop">
                <span className="arrow">⬆️</span>
                <p>Arraste arquivos ou clique para selecionar</p>
            </div>
        </div>
    );
};

export default UploadPanel;
