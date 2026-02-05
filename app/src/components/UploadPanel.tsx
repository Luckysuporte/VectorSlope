'use client';

import { FileText, Upload } from 'lucide-react';

const UploadPanel = () => {
    const files = [
        {
            name: 'MFC Noite',
            time: 'Upload às 20:30',
            icon: '🌙',
            bg: 'bg-gradient-to-br from-[#00b4ff] to-[#007bff]'
        },
        {
            name: 'MFC Manhã',
            time: 'Upload às 06:30',
            icon: '☀️',
            bg: 'bg-gradient-to-br from-[#ffd43b] to-[#ff922b]'
        },
        {
            name: 'Resultado Bonoto',
            time: 'Upload às Portfolio do dia',
            icon: '📊',
            bg: 'bg-gradient-to-br from-[#4dabf7] to-[#339af0]'
        }
    ];

    return (
        <div className="w-full p-6 rounded-2xl bg-gradient-to-b from-[#0f1f3f] to-[#0a1530] border border-cyan-500/10 shadow-2xl text-white">
            <h2 className="mb-5 font-bold text-sm tracking-widest text-slate-200">UPLOAD PANEL</h2>

            <div className="space-y-3">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center bg-gradient-to-b from-[#122b55] to-[#0c1f3f] rounded-xl p-3 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mr-3 shadow-lg ${file.bg}`}>
                            {file.icon}
                        </div>
                        <div className="flex-1">
                            <strong className="block text-sm font-semibold group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{file.name}</strong>
                            <span className="text-[11px] text-slate-400">{file.time}</span>
                        </div>
                        <FileText className="w-5 h-5 text-cyan-400/50 group-hover:text-cyan-400 transition-colors" />
                    </div>
                ))}
            </div>

            <div className="mt-4 p-6 border-2 border-dashed border-cyan-500/20 rounded-xl text-center text-cyan-400/70 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all cursor-pointer group">
                <Upload className="w-7 h-7 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium">Arraste arquivos ou clique para selecionar</p>
            </div>
        </div>
    );
};

export default UploadPanel;
