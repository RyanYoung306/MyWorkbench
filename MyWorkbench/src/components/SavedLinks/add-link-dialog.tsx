import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface AddLinkDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (title: string, url: string) => void
}

export default function AddLinkDialog({ open, onClose, onAdd }: AddLinkDialogProps) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [errors, setErrors] = useState<{title?: string; url?: string}>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    const newErrors: {title?: string; url?: string} = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!url.trim()) {
      newErrors.url = "URL is required"
    } else if (!/^(https?:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/i.test(url)) {
      newErrors.url = "Please enter a valid URL"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear any errors
    setErrors({})

    // Add the link
    onAdd(title, url)

    // Reset form
    setTitle("")
    setUrl("")
  }

  const handleClose = () => {
    setTitle("")
    setUrl("")
    setErrors({})
    onClose()
  }

  return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Website"
                />
                {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                />
                {errors.url && (
                    <p className="text-sm text-destructive">{errors.url}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Add Link</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}