import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import LinkCollection from "@/components/SavedLinks/link-collection"
import AddCollectionDialog from "@/components/SavedLinks/add-collection-dialog"

export default function SavedLinksTab() {
  const [activeTab, setActiveTab] = useState("personal")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [collections, setCollections] = useState({
    personal: [
      {
        id: "productivity",
        title: "Productivity",
        links: [
          { id: "1", title: "Notion", url: "https://notion.so" },
          { id: "2", title: "Trello", url: "https://trello.com" },
          { id: "3", title: "Google Calendar", url: "https://calendar.google.com" },
          { id: "4", title: "Todoist", url: "https://todoist.com" },
        ],
      },
      {
        id: "fun",
        title: "Fun",
        links: [
          { id: "5", title: "YouTube", url: "https://youtube.com" },
          { id: "6", title: "Netflix", url: "https://netflix.com" },
          { id: "7", title: "Spotify", url: "https://spotify.com" },
          { id: "8", title: "Reddit", url: "https://reddit.com" },
        ],
      },
      {
        id: "news",
        title: "News",
        links: [
          { id: "9", title: "BBC", url: "https://bbc.com" },
          { id: "10", title: "CNN", url: "https://cnn.com" },
          { id: "11", title: "The Guardian", url: "https://theguardian.com" },
        ],
      },
    ],
    work: [
      {
        id: "development",
        title: "Development",
        links: [
          { id: "12", title: "GitHub", url: "https://github.com" },
          { id: "13", title: "Stack Overflow", url: "https://stackoverflow.com" },
          { id: "14", title: "MDN Web Docs", url: "https://developer.mozilla.org" },
        ],
      },
      {
        id: "design",
        title: "Design",
        links: [
          { id: "15", title: "Figma", url: "https://figma.com" },
          { id: "16", title: "Dribbble", url: "https://dribbble.com" },
          { id: "17", title: "Behance", url: "https://behance.net" },
        ],
      },
    ],
  })

  const handleAddCollection = (title: string) => {
    setCollections((prev) => ({
      ...prev,
      [activeTab]: [
        ...prev[activeTab as keyof typeof prev],
        {
          id: title.toLowerCase().replace(/\s+/g, "-"),
          title,
          links: [],
        },
      ],
    }))
    setShowAddDialog(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">SavedLinks</h1>
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections[activeTab as keyof typeof collections]?.map((collection) => (
          <LinkCollection key={collection.id} title={collection.title} links={collection.links} />
        ))}
      </div>

      <div className="fixed bottom-6 right-6">
        <Button onClick={() => setShowAddDialog(true)} size="lg" className="rounded-full h-14 w-14">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add Collection</span>
        </Button>
      </div>

      <AddCollectionDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} onAdd={handleAddCollection} />
    </div>
  )
}
