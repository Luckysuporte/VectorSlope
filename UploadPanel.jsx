// components/UploadPanel.jsx
import React from 'react';
import { Upload, FileText } from 'lucide-react';

const UploadPanel = () => {
  const files = [
    { name: 'MFC Noite', time: '20:30', icon: '🌙' },
    { name: 'MFC Manhã', time: '06:30', icon: '☀️' },
    { name: 'Resultado Bonoto', time: 'Portfolio do dia', icon: '📊' },
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-white mb-6">UPLOAD PANEL</h2>
      
      <div className="space-y-4">
        {files.map((file, index) => (
          <div key={index} className="group relative bg-gradient-to-r from-slate-800/50 to-slate-800/30 hover:from-slate-800/70 hover:to-slate-800/50 border border-cyan-500/10 hover:border-cyan-500/30 rounded-xl p-4 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl shadow-lg">
                {file.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-1">{file.name}</h3>
                <p className="text-xs text-slate-400">Upload às {file.time}</p>
              </div>
              <FileText className="w-5 h-5 text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer group">
        <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
        <p className="text-sm text-slate-400">Arraste arquivos ou clique para selecionar</p>
      </div>
    </div>
  );
};

export default UploadPanel;
