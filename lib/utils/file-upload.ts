export interface FileUploadResult {
  success: boolean
  url?: string
  error?: string
}

export interface FileUploadOptions {
  folder?: string
  maxSize?: number // in bytes
  allowedTypes?: string[]
}

export async function uploadFileToGCP(
  file: File,
  options: FileUploadOptions = {}
): Promise<FileUploadResult> {
  try {
    const {
      folder = 'tournament-files',
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/*', 'application/pdf', '.png', '.jpg', '.jpeg', '.pdf']
    } = options

    // Validate file size
    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`
      }
    }

    // Validate file type
    const isValidType = allowedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''))
      }
      return file.type === type || file.name.toLowerCase().endsWith(type)
    })

    if (!isValidType) {
      return {
        success: false,
        error: 'File type not allowed'
      }
    }

    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    // Upload to our API endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || 'Upload failed'
      }
    }

    const data = await response.json()
    return {
      success: true,
      url: data.url
    }
  } catch (error) {
    console.error('File upload error:', error)
    return {
      success: false,
      error: 'Upload failed. Please try again.'
    }
  }
}

export function getFileTypeFromUrl(url: string): 'image' | 'pdf' | 'unknown' {
  const extension = url.split('.').pop()?.toLowerCase()
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
    return 'image'
  }
  
  if (extension === 'pdf') {
    return 'pdf'
  }
  
  return 'unknown'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
