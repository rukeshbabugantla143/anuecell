'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Upload, Loader2, X, Images, FolderPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AlbumOption {
  id: string
  title: string
  cover_image_url?: string | null
}

interface GalleryUploaderProps {
  albums?: AlbumOption[]
  defaultAlbumId?: string
  variant?: 'primary' | 'outline' | 'compact'
  buttonText?: string
}

export default function GalleryUploader({ 
  albums = [], 
  defaultAlbumId = '',
  variant = 'primary',
  buttonText
}: GalleryUploaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(defaultAlbumId || (albums[0]?.id || ''))
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOpen = () => {
    setSelectedAlbumId(defaultAlbumId || (albums[0]?.id || ''))
    setIsOpen(true)
  }

  const handleFilesChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one photo to upload.')
      return
    }

    try {
      setUploading(true)
      const total = selectedFiles.length

      const selectedAlbum = albums.find((a) => a.id === selectedAlbumId)
      const albumTitle = selectedAlbum ? selectedAlbum.title : 'General'

      let firstPublicUrl: string | null = null

      for (let i = 0; i < total; i++) {
        setUploadProgress({ current: i + 1, total })
        const file = selectedFiles[i]
        const fileExt = file.name.split('.').pop()
        const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 15)
        const fileName = `gallery_${cleanName}_${Math.random().toString(36).substring(2, 8)}_${Date.now()}.${fileExt}`

        // Upload to Storage
        const { error: uploadError } = await supabase.storage
          .from('team-photos')
          .upload(fileName, file, { cacheControl: '3600', upsert: false })

        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('team-photos')
          .getPublicUrl(fileName)

        if (!firstPublicUrl) firstPublicUrl = publicUrl

        // Insert to gallery_items with album_id
        const { error: dbError } = await supabase
          .from('gallery_items')
          .insert([
            {
              title: file.name.replace(/\.[^/.]+$/, ''),
              media_url: publicUrl,
              media_type: 'image',
              category: albumTitle,
              album_id: selectedAlbumId ? selectedAlbumId : null,
              is_published: true
            }
          ])

        if (dbError) {
          throw new Error(`Database error saving ${file.name}: ${dbError.message}`)
        }
      }

      // If selected album doesn't have a cover image, set the first uploaded image as cover!
      if (selectedAlbum && !selectedAlbum.cover_image_url && firstPublicUrl) {
        await supabase
          .from('albums')
          .update({ cover_image_url: firstPublicUrl })
          .eq('id', selectedAlbum.id)
      }

      // Reset and close
      setSelectedFiles([])
      setIsOpen(false)
      router.refresh()
    } catch (err: any) {
      console.error('Upload failed:', err)
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
      setUploadProgress(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      {variant === 'primary' ? (
        <Button 
          variant="secondary" 
          onClick={handleOpen}
          className="gap-2 border-border-color hover:border-primary-cyan transition-all px-5 py-5 text-sm font-semibold"
        >
          <Upload className="h-5 w-5 text-primary-cyan" />
          {buttonText || 'Add Photos'}
        </Button>
      ) : variant === 'compact' ? (
        <Button 
          variant="secondary" 
          size="sm"
          onClick={handleOpen}
          className="gap-1.5 text-xs border-border-color hover:border-primary-cyan py-1.5 px-3"
        >
          <Upload className="h-3.5 w-3.5 text-primary-cyan" />
          {buttonText || 'Add Photos'}
        </Button>
      ) : (
        <Button 
          variant="outline" 
          onClick={handleOpen}
          className="border-border-color hover:bg-secondary-bg gap-2"
        >
          <Upload className="h-4 w-4" />
          {buttonText || 'Upload Photos to Album'}
        </Button>
      )}

      {/* Modal Dialog */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#101827] border border-border-color rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[92vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-color shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center text-primary-cyan">
                  <Images className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-primary-text">Upload Photos</h3>
                  <p className="text-xs text-secondary-text">Select an album and upload multiple event memories.</p>
                </div>
              </div>
              <button 
                onClick={() => !uploading && setIsOpen(false)}
                disabled={uploading}
                className="text-muted-text hover:text-white p-2 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="space-y-6 overflow-y-auto pr-1 flex-grow">
              
              {/* Album Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">
                  Target Album *
                </label>
                {albums.length > 0 ? (
                  <select
                    value={selectedAlbumId}
                    onChange={(e) => setSelectedAlbumId(e.target.value)}
                    disabled={uploading}
                    className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                  >
                    {albums.map((alb) => (
                      <option key={alb.id} value={alb.id}>
                        {alb.title}
                      </option>
                    ))}
                    <option value="">General (No Album / Campus Moments)</option>
                  </select>
                ) : (
                  <div className="p-3 rounded-xl bg-functional-warning/10 border border-functional-warning/30 text-xs text-functional-warning">
                    No albums created yet. Please create an album first or upload to General.
                  </div>
                )}
                <p className="text-xs text-secondary-text">
                  Photos will be grouped inside this album on the public website.
                </p>
              </div>

              {/* Photos Dropzone / Multi-File Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">
                  Select Photos (Multiple allowed) *
                </label>
                
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFilesChosen}
                  disabled={uploading}
                  className="hidden"
                />

                <div 
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border-color hover:border-primary-cyan/60 bg-[#151F30]/50 hover:bg-[#151F30] rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-text group-hover:text-primary-cyan transition-colors mb-2" />
                  <p className="text-sm font-medium text-primary-text">
                    Click to browse files or select multiple photos
                  </p>
                  <p className="text-xs text-secondary-text mt-1">
                    Select as many photos as you want (JPG, PNG, WEBP)
                  </p>
                </div>
              </div>

              {/* Previews List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-secondary-text">
                    <span>Selected ({selectedFiles.length} {selectedFiles.length === 1 ? 'photo' : 'photos'}):</span>
                    <button 
                      type="button"
                      onClick={() => setSelectedFiles([])}
                      disabled={uploading}
                      className="text-functional-error hover:underline"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2 border border-border-color/60 rounded-xl p-3 bg-secondary-bg/30">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-main-bg border border-border-color text-xs">
                        <span className="truncate max-w-[80%] text-primary-text">{file.name}</span>
                        <span className="text-muted-text shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                        {!uploading && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-muted-text hover:text-functional-error ml-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploading && uploadProgress && (
                <div className="p-4 rounded-xl bg-primary-cyan/10 border border-primary-cyan/30 text-center space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-cyan mx-auto" />
                  <p className="text-sm font-semibold text-primary-cyan">
                    Uploading photo {uploadProgress.current} of {uploadProgress.total}...
                  </p>
                  <div className="w-full bg-[#151F30] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-cyan h-full transition-all duration-300"
                      style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-color shrink-0">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={uploading}
                className="text-secondary-text"
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
                className="gap-2 shadow-[0_0_20px_rgba(0,217,255,0.4)]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Upload {selectedFiles.length > 0 ? `${selectedFiles.length} Photos` : ''}
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  )
}
