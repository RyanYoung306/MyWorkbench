import React from 'react';
import { MessageSquare } from 'lucide-react';

const Header = () => {
    return (
        <header className="flex justify-center items-center gap-3 py-6">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-slate-800">DeepSeek Local Interface</h1>
        </header>
    );
};

export default Header;