import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import LinkCollection from "@/components/SavedLinks/link-collection"
import AddCollectionDialog from "@/components/SavedLinks/add-collection-dialog"
import { CategoryName, LinkCollection as LinkCollectionType } from "@/types/savedLinks"
import {
  fetchCollections,
  createCollection,
  initializeDefaultCollections
} from "@/services/savedLinksApi"

export default function SavedLinksTab() {
  const [activeTab, setActiveTab] = useState<CategoryName>("personal")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [collections, setCollections] = useState<{
    personal: LinkCollectionType[];
    work: LinkCollectionType[];
  }>({
    personal: [],
    work: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load collections on mount and when the active tab changes
  useEffect(() => {
    const loadCollections = async () => {
      setLoading(true)
      try {
        const data = await fetchCollections(activeTab)
        setCollections(prev => ({
          ...prev,
          [activeTab]: data
        }))
        setError(null)
      } catch (err) {
        console.error("Failed to load collections:", err)
        setError("Failed to load collections. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadCollections()
  }, [activeTab])

  // Initialize default collections when the component mounts
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDefaultCollections()
        // Load initial collections after initialization
        const personalData = await fetchCollections("personal")
        const workData = await fetchCollections("work")

        setCollections({
          personal: personalData,
          work: workData
        })
      } catch (err) {
        console.error("Failed to initialize collections:", err)
        setError("Failed to initialize default collections.")
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [])

  const handleAddCollection = async (title: string) => {
    try {
      const newCollection = await createCollection(activeTab, title)
      if (newCollection) {
        setCollections(prev => ({
          ...prev,
          [activeTab]: [...prev[activeTab], newCollection]
        }))
      }
    } catch (err) {
      console.error("Failed to add collection:", err)
      setError("Failed to add collection. Please try again.")
    } finally {
      setShowAddDialog(false)
    }
  }

  return (
      <div className="container w-full mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">SavedLinks</h1>
          <Tabs defaultValue="personal" value={activeTab} onValueChange={(value) => setActiveTab(value as CategoryName)} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading collections...</span>
            </div>
        ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              {error}
            </div>
        ) : collections[activeTab].length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No collections found. Add your first collection!</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Collection
              </Button>
            </div>
        ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
              {collections[activeTab].map((collection) => (
                  <LinkCollection
                      key={collection.id}
                      title={collection.title}
                      links={collection.links}
                      collectionId={collection.id}
                      category={activeTab}
                      onUpdate={(updatedCollection) => {
                        setCollections(prev => ({
                          ...prev,
                          [activeTab]: prev[activeTab].map(c =>
                              c.id === updatedCollection.id ? updatedCollection : c
                          )
                        }))
                      }}
                      onDelete={(id) => {
                        setCollections(prev => ({
                          ...prev,
                          [activeTab]: prev[activeTab].filter(c => c.id !== id)
                        }))
                      }}
                  />
              ))}
            </div>
        )}

        <div className="fixed bottom-6 right-6">
          <Button onClick={() => setShowAddDialog(true)} size="lg" className="rounded-full h-14 w-14">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add Collection</span>
          </Button>
        </div>

        <AddCollectionDialog
            open={showAddDialog}
            onClose={() => setShowAddDialog(false)}
            onAdd={handleAddCollection}
        />
      </div>
  )
}