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
            {/* Desktop Header Layout */}
            <div className="flex flex-col gap-4">
                {/* Top Row: Logo & User Actions */}
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#00b4ff] to-[#007bff] rounded-lg shadow-[0_0_15px_rgba(0,180,255,0.3)] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">V</span>
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">VectorSlope</span>
                    </Link>

                    {/* Right Side Actions */}
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

                {/* Bottom Row: Navigation Tabs */}
                {/* Similar to TableFlow style */}
                <div className="hidden md:flex items-center gap-1 border-t border-white/5 pt-2">
                    {menuItems.map((item) => {
                        const href = item.label === 'Painel' ? '/' :
                            item.label === 'Histórico' ? '/historico' :
                                item.label === 'Análise' ? '/analise-diaria' : '#';
                        // Determine active state based on path could be done here if using usePathname
                        // For now keeping simple 'active' prop from list if logical, but better to just style links. 
                        // The original code had `active: boolean` in the list but didn't use router.

                        return (
                            <Link
                                key={item.label}
                                href={href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium
                                    ${item.active
                                        ? 'text-cyan-400 bg-cyan-500/5'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }
                                    hover:translate-y-[-1px]
                                `}
                            >
                                <item.icon className={`w-4 h-4 ${item.active ? 'text-cyan-400' : 'text-slate-500'}`} />
                                <span>{item.label}</span>
                                {item.active && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 rounded-t-full opacity-0 group-hover:opacity-100"></span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
