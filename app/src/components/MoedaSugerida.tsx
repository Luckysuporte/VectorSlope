'use client';

const MoedaSugerida = () => {
    const pairs = [
        { name: 'AUDJPY', action: 'BUY' },
        { name: 'CADJPY', action: 'BUY' },
        { name: 'CHFJPY', action: 'BUY' },
        { name: 'EURJPY', action: 'BUY' },
        { name: 'GBPJPY', action: 'BUY' },
        { name: 'NZDJPY', action: 'BUY' },
        { name: 'USDJPY', action: 'BUY' },
    ];

    // 87% = 452 * 0.13 = ~59 offset
    const percentage = 87;
    const circumference = 452;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="suggested-currency">
            {/* Header */}
            <div className="top">
                <span>MOEDA SUGERIDA</span>
                <small>Hoje</small>
            </div>

            {/* Moeda Principal */}
            <h1>JPY</h1>

            {/* Status */}
            <div className="status">
                ⚡ FRAQUEZA
            </div>

            {/* Progress Ring */}
            <div className="progress-ring">
                <svg width="170" height="170">
                    <circle cx="85" cy="85" r="72"></circle>
                    <circle
                        cx="85"
                        cy="85"
                        r="72"
                        style={{ strokeDashoffset: offset }}
                    ></circle>
                </svg>
                <div className="value">{percentage}%</div>
            </div>

            {/* Subtítulo */}
            <p className="subtitle">Pares Sugeridos (VENDA/COMPRA)</p>

            {/* Lista de Pares */}
            <div className="pairs">
                {pairs.map((pair) => (
                    <div key={pair.name} className="pair">
                        <span>{pair.name}</span>
                        <button>{pair.action}</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoedaSugerida;
