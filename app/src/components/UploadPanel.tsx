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
        <div className="w-full p-[20px] rounded-[18px] bg-gradient-to-b from-[#0f1f3f] to-[#0a1530] shadow-[0_0_40px_rgba(0,140,255,0.15)] text-white">
            <h2 className="mb-[18px] font-bold text-[16px] tracking-wider">UPLOAD PANEL</h2>

            <div className="space-y-[12px]">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center bg-gradient-to-b from-[#122b55] to-[#0c1f3f] rounded-[14px] p-[14px]">
                        <div className={`w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-[20px] mr-[12px] ${file.bg}`}>
                            {file.icon}
                        </div>
                        <div className="flex-1">
                            <strong className="block text-[14px] font-bold">{file.name}</strong>
                            <span className="text-[12px] opacity-70 italic">{file.time}</span>
                        </div>
                        <FileText className="w-[18px] h-[18px] opacity-70 text-cyan-400" />
                    </div>
                ))}
            </div>

            <div className="mt-[16px] p-[26px_16px] border-2 border-dashed border-[#1ec8ff] rounded-[14px] text-center text-[#9ee7ff] cursor-pointer hover:bg-cyan-500/5 transition-colors group">
                <Upload className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-[13px]">Arraste arquivos ou clique para selecionar</p>
            </div>
        </div>
    );
};

export default UploadPanel;
