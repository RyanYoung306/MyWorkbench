import {SidebarProvider} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/app-sidebar"
import Header from "@/components/Header"
import React, { useState } from "react";
import ChatTab from "./components/ChatTab/ChatTab";
import SavedLinksTab from "./components/SavedLinks/SavedLinksTab";


interface LayoutProps {
    children: React.ReactNode,
    onSelectChat: () => void,
    onSelectLinks?: () => void
}

export default function Layout({children}: LayoutProps) {
    const [activeTab, setActiveTab] = useState('LLM');

    return (
        <SidebarProvider>
            <div className="flex">
                <AppSidebar onSelectTab={setActiveTab} activeTab={activeTab} />
                <div className="flex flex-col w-full">
                    <Header/>
                    <main>
                        {children}
                        {activeTab === 'LLM' && <ChatTab />}
                        {activeTab === 'SavedLinks' && <SavedLinksTab />}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}