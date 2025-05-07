"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"

interface MultiFileUploadProps {
  onChange: (urls: string[]) => void
  value: string[]
  maxFiles?: number
}

export function MultiFileUpload({ onChange, value = [], maxFiles = 10 }: MultiFileUploadProps) {
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleAddImage = (url: string) => {
    onChange([...value, url])
    setIsAddingNew(false)
  }

  const handleRemoveImage = (index: number) => {
    const newUrls = [...value]
    newUrls.splice(index, 1)
    onChange(newUrls)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {value.map((url, index) => (
          <FileUpload key={index} value={url} onChange={() => {}} onRemove={() => handleRemoveImage(index)} />
        ))}

        {isAddingNew && <FileUpload value="" onChange={handleAddImage} onRemove={() => setIsAddingNew(false)} />}

        {!isAddingNew && value.length < maxFiles && (
          <Button
            onClick={() => setIsAddingNew(true)}
            variant="outline"
            className="h-[200px] w-full border-2 border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Photo
          </Button>
        )}
      </div>
    </div>
  )
}
