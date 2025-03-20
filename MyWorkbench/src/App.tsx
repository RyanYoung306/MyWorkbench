import './App.css'
import { ConnectionProvider } from './contexts/ConnectionContext';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ThemeProvider } from './components/theme-provider';
import Layout from "@/layout.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";

function App() {

  return (
    <>
        <ThemeProvider defaultTheme="system" storageKey="myworkbench-theme">
            <SidebarProvider>
            <ConnectionProvider>
                    <div className="w-full mx-auto">
                        <Layout/>
                    </div>
            </ConnectionProvider>
            </SidebarProvider>
        </ThemeProvider>
    </>
  )
}

export default App
