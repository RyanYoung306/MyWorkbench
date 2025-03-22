import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LinkIcon, Trash2, Plus } from "lucide-react"
import type { Link as LinkType, LinkCollection as LinkCollectionType } from "@/types/savedLinks"
import { addLink, removeLink, getFaviconUrl, getDomainFromUrl } from "@/services/savedLinksApi"
import AddLinkDialog from "./add-link-dialog"
import ConfirmationDialog from "./ConfirmationDialog.tsx";

interface LinkCollectionProps {
  title: string
  links: LinkType[]
  collectionId: string
  category: "personal" | "work"
  onUpdate: (collection: LinkCollectionType) => void
  onDelete: (collectionId: string) => void
}

export default function LinkCollection({
                                         title,
                                         links,
                                         collectionId,
                                         category,
                                         onUpdate,
                                         onDelete,
                                       }: LinkCollectionProps) {
  const [showAddLinkDialog, setShowAddLinkDialog] = useState(false)
  const [faviconErrors, setFaviconErrors] = useState<Set<string>>(new Set())
  const [showDeleteLinkDialog, setShowDeleteLinkDialog] = useState(false)
  const [showDeleteCollectionDialog, setShowDeleteCollectionDialog] = useState(false)
  const [selectedLinkId, setSelectedLinkId] = useState<string>("")
  const [selectedLinkTitle, setSelectedLinkTitle] = useState("")
  const [collectionTitle, setCollectionTitle] = useState("")

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

  const handleOpenDeleteLinkDialog = (linkId: string, linkTitle: string) => {
    setSelectedLinkId(linkId)
    setSelectedLinkTitle(linkTitle)
    setShowDeleteLinkDialog(true)
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

  const handleConfirmDeleteLink = () => {
    handleRemoveLink(selectedLinkId)
    setShowDeleteLinkDialog(false)
    setSelectedLinkId("")
    setSelectedLinkTitle("")
  }

  const handleConfirmDeleteCollection = () => {
    onDelete(collectionId)
    setShowDeleteCollectionDialog(false)
  }

  const openLink = (url: string) => {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`
    window.open(formattedUrl, "_blank")
  }

  const handleFaviconError = (linkId: string) => {
    setFaviconErrors((prev) => new Set(prev).add(linkId))
  }

  return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                // Open a confirmation dialog and pass the title prop from the collection
                setCollectionTitle(title);
                setShowDeleteCollectionDialog(true);
              }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {links.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No links added yet</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowAddLinkDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add your first link
                </Button>
              </div>
          ) : (
              <div className="space-y-2">
                {links.map((link) => (
                    <div
                        key={link.id}
                        className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => openLink(link.url)}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && openLink(link.url)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {faviconErrors.has(link.id) ? (
                            <LinkIcon className="h-4 w-4 flex-shrink-0 text-primary" />
                        ) : (
                            <img
                                src={getFaviconUrl(category, collectionId, link.id, link) || "/placeholder.svg"}
                                alt=""
                                className="h-4 w-4 flex-shrink-0"
                                onError={() => handleFaviconError(link.id)}
                            />
                        )}
                        <div className="flex flex-col overflow-hidden">
                          <div className="font-medium truncate">{link.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{getDomainFromUrl(link.url)}</div>
                        </div>
                      </div>
                      <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-2"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleOpenDeleteLinkDialog(link.id, link.title)
                          }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                ))}
              </div>
          )}
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm" className="w-full" onClick={() => setShowAddLinkDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </div>
        </CardContent>
        <AddLinkDialog open={showAddLinkDialog} onClose={() => setShowAddLinkDialog(false)} onAdd={handleAddLink} />
        <ConfirmationDialog
            open={showDeleteLinkDialog}
            title="Confirm Delete Link"
            description={`This action cannot be undone. This will permanently delete the link: ${selectedLinkTitle}.`}
            onConfirm={handleConfirmDeleteLink}
            onCancel={() => setShowDeleteLinkDialog(false)}
        />
        <ConfirmationDialog
            open={showDeleteCollectionDialog}
            title="Confirm Delete Collection"
            description={`This action cannot be undone. This will permanently delete the collection: ${collectionTitle}.`}
            onConfirm={handleConfirmDeleteCollection}
            onCancel={() => setShowDeleteCollectionDialog(false)}
        />
      </Card>
  )
}

