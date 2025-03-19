import { Calendar, Home, Inbox, Search, Settings, Link, Bot } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    // {
    //     title: "Home",
    //     url: "#",
    //     icon: Home,
    // },
    {
        title: "LLM",
        icon: Bot,
    },
    {
        title: "SavedLinks",
        icon: Link,
    },
    // {
    //     title: "Calendar",
    //     url: "#",
    //     icon: Calendar,
    // },
    // {
    //     title: "Search",
    //     url: "#",
    //     icon: Search,
    // },
    // {
    //     title: "Settings",
    //     url: "#",
    //     icon: Settings,
    // },
]

interface AppSidebarProps {
    onSelectTab: (tab: string) => void;
    activeTab: string;
}

export function AppSidebar({ onSelectTab, activeTab }: AppSidebarProps)  {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    {/*<SidebarGroupLabel>Application</SidebarGroupLabel>*/}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={activeTab === item.title}
                                        onClick={() => onSelectTab(item.title)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
