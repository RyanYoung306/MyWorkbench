import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Plus } from "lucide-react"
import { useState } from "react"
import AddLinkDialog from "./add-link-dialog"

interface Link {
  id: string
  title: string
  url: string
}

interface LinkCollectionProps {
  title: string
  links: Link[]
}

export default function LinkCollection({ title, links }: LinkCollectionProps) {
  const [collectionLinks, setCollectionLinks] = useState<Link[]>(links)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const handleAddLink = (title: string, url: string) => {
    setCollectionLinks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title,
        url: url.startsWith("http") ? url : `https://${url}`,
      },
    ])
    setShowAddDialog(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setShowAddDialog(true)} className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add Link</span>
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {collectionLinks.map((link) => (
            <li key={link.id} className="flex items-center">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm hover:underline text-blue-600 dark:text-blue-400"
              >
                <ExternalLink className="h-3 w-3 mr-2 flex-shrink-0" />
                {link.title}
              </a>
            </li>
          ))}
          {collectionLinks.length === 0 && <li className="text-sm text-gray-500 italic">No links added yet</li>}
        </ul>
      </CardContent>

      <AddLinkDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} onAdd={handleAddLink} />
    </Card>
  )
}

