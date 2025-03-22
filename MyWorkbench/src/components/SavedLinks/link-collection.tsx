import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link, Trash2, Plus } from "lucide-react"
import { Link as LinkType, LinkCollection as LinkCollectionType } from "@/types/savedLinks"
import { addLink, removeLink, deleteCollection } from "@/services/savedLinksApi"
import AddLinkDialog from "./add-link-dialog"

interface LinkCollectionProps {
  title: string
  links: LinkType[]
  collectionId: string
  category: 'personal' | 'work'
  onUpdate: (collection: LinkCollectionType) => void
  onDelete: (collectionId: string) => void
}

export default function LinkCollection({
                                         title,
                                         links,
                                         collectionId,
                                         category,
                                         onUpdate,
                                         onDelete
                                       }: LinkCollectionProps) {
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleAddLink = async (linkTitle: string, url: string) => {
    try {
      const updatedCollection = await addLink(category, collectionId, linkTitle, url)
      if (updatedCollection) {
        onUpdate(updatedCollection)
      }
    } catch (error) {
      console.error("Failed to add link:", error)
    } finally {
      setShowAddLinkDialog(false)
    }
  }

  const handleRemoveLink = async (linkId: string) => {
    try {
      const updatedCollection = await removeLink(category, collectionId, linkId)
      if (updatedCollection) {
        onUpdate(updatedCollection)
      }
    } catch (error) {
      console.error("Failed to remove link:", error)
    }
  }

  const handleDeleteCollection = async () => {
    if (window.confirm(`Are you sure you want to delete the "${title}" collection?`)) {
      setIsDeleting(true)
      try {
        const success = await deleteCollection(category, collectionId)
        if (success) {
          onDelete(collectionId)
        }
      } catch (error) {
        console.error("Failed to delete collection:", error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const openLink = (url: string) => {
    // Ensure URL has http/https prefix
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`
    window.open(formattedUrl, '_blank')
  }

  return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
              onClick={handleDeleteCollection}
              disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {links.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No links added yet</p>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowAddLinkDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add your first link
                </Button>
              </div>
          ) : (
              <div className="space-y-2">
                {links.map((link) => (
                    <div
                        key={link.id}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/60 transition-colors"
                    >
                      <button
                          className="flex items-center gap-2 text-left flex-grow"
                          onClick={() => openLink(link.url)}
                      >
                        <Link className="h-4 w-4 flex-shrink-0 text-primary" />
                        <div>
                          <div className="font-medium">{link.title}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {link.url}
                          </div>
                        </div>
                      </button>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveLink(link.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                ))}
              </div>
          )}

          <div className="mt-4 flex justify-center">
            <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowAddLinkDialog(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </div>
        </CardContent>

        <AddLinkDialog
            open={showAddLinkDialog}
            onClose={() => setShowAddLinkDialog(false)}
            onAdd={handleAddLink}
        />
      </Card>
  )
}
