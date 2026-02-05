'use client';

import { LayoutDashboard, BarChart3, Send, History, Settings, User, Bell } from 'lucide-react';

const Navbar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Painel', active: true },
        { icon: BarChart3, label: 'Análise', active: false },
        { icon: Send, label: 'Enviar', active: false },
        { icon: History, label: 'Histórico', active: false },
        { icon: Settings, label: 'Configurações', active: false },
    ];

    return (
        <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-cyan-500/20 px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">V</span>
                    </div>
                    <span className="text-xl font-bold text-white">VectorSlope</span>
                </div>

                {/* Menu Items */}
                <div className="flex items-center gap-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${item.active
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
                    </button>
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
