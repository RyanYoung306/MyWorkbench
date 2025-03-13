import './App.css'
import Header from './components/Header';
import ChatTab from './components/ChatTab/ChatTab';
import { ConnectionProvider } from './contexts/ConnectionContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

function App() {

  return (
    <>
        <ConnectionProvider>
            <div className="container  mx-auto  max-w-full">
                <Header />

                <Tabs defaultValue="chat" className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                        <TabsTrigger value="chat">Chat</TabsTrigger>
                        <TabsTrigger value="grammar">Grammar Checker</TabsTrigger>
                    </TabsList>

                    <TabsContent value="chat" className="mt-0">
                        <ChatTab />
                    </TabsContent>

                    {/*<TabsContent value="grammar" className="mt-0">*/}
                    {/*    <GrammarTab />*/}
                    {/*</TabsContent>*/}
                </Tabs>
            </div>
        </ConnectionProvider>
    </>
  )
}

export default App
