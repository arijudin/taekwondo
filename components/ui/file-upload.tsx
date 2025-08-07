"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { uploadFileToGCP, getFileTypeFromUrl, formatFileSize, type FileUploadOptions } from "@/lib/utils/file-upload"
import { Upload, X, File, Image, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  label: string
  value?: string
  onChange: (url: string | null) => void
  options?: FileUploadOptions
  required?: boolean
  description?: string
  accept?: string
}

export function FileUpload({ 
  label, 
  value, 
  onChange, 
  options = {}, 
  required = false, 
  description,
  accept 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }, 100)

    try {
      const result = await uploadFileToGCP(file, options)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success && result.url) {
        onChange(result.url)
        setTimeout(() => {
          setUploadProgress(0)
          setIsUploading(false)
        }, 500)
      } else {
        setError(result.error || 'Upload failed')
        setIsUploading(false)
        setUploadProgress(0)
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError('Upload failed. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange(null)
    setError(null)
  }

  const getFileIcon = (url: string) => {
    const type = getFileTypeFromUrl(url)
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />
      case 'pdf':
        return <FileText className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Unknown file'
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {value ? (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            {getFileIcon(value)}
            <span className="text-sm font-medium truncate max-w-xs">
              {getFileName(value)}
            </span>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              disabled={isUploading}
              accept={accept}
              className="hidden"
              id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Choose File'}
            </Button>
          </div>

          {isUploading && (
            <div className="space-y-1">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-gray-500 text-center">{uploadProgress}% uploaded</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
