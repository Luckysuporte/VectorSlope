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
        <nav className="w-full bg-slate-900/40 backdrop-blur-md border-b border-white/5 px-6 py-3">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#00b4ff] to-[#007bff] rounded-lg shadow-[0_0_15px_rgba(0,180,255,0.3)] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">V</span>
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">VectorSlope</span>
                </div>

                {/* Menu Items */}
                <div className="hidden md:flex items-center gap-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${item.active
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="text-[13px] font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#00b4ff] rounded-full shadow-[0_0_5px_#00b4ff]"></span>
                    </button>
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border border-white/10 shadow-lg">
                        <User className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
