'use client';

import Link from 'next/link';
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
            {/* Single Row Layout - Improved Spacing */}
            <div className="relative flex items-center justify-between h-14">
                {/* Left: Logo */}
                <div className="flex items-center gap-8 relative z-20">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#00b4ff] to-[#007bff] rounded-lg shadow-[0_0_15px_rgba(0,180,255,0.3)] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">V</span>
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight hidden sm:block">VectorSlope</span>
                    </Link>
                </div>

                {/* Center: Navigation Menu - Absolutely Centered */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block z-10 w-auto">
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                        {menuItems.map((item) => {
                            const href = item.label === 'Painel' ? '/' :
                                item.label === 'Histórico' ? '/historico' :
                                    item.label === 'Análise' ? '/analise-diaria' : '#';

                            return (
                                <Link
                                    key={item.label}
                                    href={href}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all text-sm font-medium
                                        ${item.active
                                            ? 'bg-slate-800/80 text-white shadow-sm border border-white/5'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <item.icon className={`w-4 h-4 ${item.active ? 'text-cyan-400' : 'text-slate-500'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Right: User Actions */}
                <div className="flex items-center gap-4 relative z-20">
                    <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#00b4ff] rounded-full shadow-[0_0_5px_#00b4ff]"></span>
                    </button>
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border border-white/10 shadow-lg cursor-pointer hover:border-white/30 transition-colors">
                        <User className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
