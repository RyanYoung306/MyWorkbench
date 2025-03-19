import './App.css'
import ChatTab from './components/ChatTab/ChatTab';
import SavedLinks from './components/SavedLinks/SavedLinksTab';
import { ConnectionProvider } from './contexts/ConnectionContext';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ThemeProvider } from './components/theme-provider';
import Layout from "@/layout.tsx";

function App() {

  return (
    <>
        <ThemeProvider defaultTheme="system" storageKey="myworkbench-theme">
                <ConnectionProvider>
                    <div className="w-full mx-auto">
                        <Layout/>
                    </div>
                </ConnectionProvider>

        </ThemeProvider>
    </>
  )
}

export default App


{/*<Layout>*/}
{/*<Tabs defaultValue="chat" className="w-full">*/}
{/*    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">*/}
{/*        <TabsTrigger value="chat">Chat</TabsTrigger>*/}
{/*        <TabsTrigger value="grammar">Grammar Checker</TabsTrigger>*/}
{/*    </TabsList>*/}

{/*    <TabsContent value="chat" className="mt-0">*/}
{/*        <ChatTab />*/}
{/*    </TabsContent>*/}

{/*    /!*<TabsContent value="grammar" className="mt-0">*!/*/}
{/*    /!*    <GrammarTab />*!/*/}
{/*    /!*</TabsContent>*!/*/}
{/*</Tabs>*/}
{/*</Layout>*/}
