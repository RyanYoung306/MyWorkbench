import {useSidebar} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/app-sidebar"
import Header from "@/components/Header"
import { useState } from "react";
import ChatTab from "./components/ChatTab/ChatTab";
import SavedLinksTab from "./components/SavedLinks/SavedLinksTab";


export default function Layout() {
    const [activeTab, setActiveTab] = useState('SavedLinks')
    const { open, openMobile, isMobile, toggleSidebar } = useSidebar()

    // Determine if we need to apply sidebar-open class to main content
    const sidebarIsOpen = isMobile ? openMobile : open

    return (
        <div className="min-h-screen">
            <Header />
            {/* Overlay that only appears on mobile when sidebar is open */}
            <div
                className={`sidebar-overlay ${(isMobile && openMobile) ? 'visible' : ''}`}
                onClick={toggleSidebar}
            ></div>

            <div className="flex">
                {/* Your sidebar component with fixed positioning */}
                <div className={`sidebar ${sidebarIsOpen ? 'open' : ''}`}>
                    <AppSidebar onSelectTab={setActiveTab} activeTab={activeTab} />
                </div>

                {/* Main content that doesn't get pushed off screen */}
                <main className={`main-content ${(!isMobile && open) ? 'sidebar-open' : ''}`}>
                    {activeTab === 'LLM' && <ChatTab />}
                    {activeTab === 'SavedLinks' && <SavedLinksTab />}
                </main>
            </div>
        </div>
    )
}