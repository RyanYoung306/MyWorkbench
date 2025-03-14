import React from 'react';
import { MessageSquare } from 'lucide-react';
import {ThemeToggle} from "@/components/theme-toggle.tsx";

const Header = () => {
    return (
        <header className="flex items-center gap-3 py-6 bg-slate-900 border-b border-slate-800">
            <svg className="h-12 w-12 ml-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0F172A"/>
                        <stop offset="100%" stopColor="#1E293B"/>
                    </linearGradient>
                    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#94A3B8"/>
                        <stop offset="100%" stopColor="#64748B"/>
                    </linearGradient>
                </defs>

                {/* Background Circle */}
                <circle cx="32" cy="32" r="30" fill="url(#bgGradient)"/>

                {/* Stylized "W" for Workbench */}
                <path d="M16 20 L24 38 L32 24 L40 38 L48 20"
                      stroke="#F8FAFC"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"/>

                {/* Tech Element: Circuit Line */}
                {/*<path d="M16 44 L48 44"*/}
                {/*      stroke="url(#accentGradient)"*/}
                {/*      strokeWidth="3"*/}
                {/*      strokeLinecap="round"*/}
                {/*/>*/}

                {/* Connection Dots */}
                <circle cx="16" cy="44" r="3" fill="#F8FAFC"/>
                <circle cx="32" cy="44" r="3" fill="#F8FAFC"/>
                <circle cx="48" cy="44" r="3" fill="#F8FAFC"/>
            </svg>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:!text-[2.2em] text-slate-50 !text-[2.0em]">MyWorkbench</h1>
            <ThemeToggle />
        </header>
    );
};

export default Header;