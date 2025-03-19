import {SidebarProvider} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/app-sidebar"
import Header from "@/components/Header"
import { useState } from "react";
import ChatTab from "./components/ChatTab/ChatTab";
import SavedLinksTab from "./components/SavedLinks/SavedLinksTab";


export default function Layout() {
    const [activeTab, setActiveTab] = useState('LLM');

    return (
        <SidebarProvider>
            <div className="flex">
                <AppSidebar onSelectTab={setActiveTab} activeTab={activeTab} />
                <div className="flex flex-col w-full">
                    <Header/>
                    <main>
                        {activeTab === 'LLM' && <ChatTab />}
                        {activeTab === 'SavedLinks' && <SavedLinksTab />}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}