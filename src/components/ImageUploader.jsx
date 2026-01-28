import React, { useState, useCallback } from 'react'

const ImageUploader = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onImageUpload(e.target.result)
      }
      reader.readAsDataURL(imageFile)
    }
  }, [onImageUpload])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onImageUpload(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }, [onImageUpload])

  const handleSampleImage = useCallback(() => {
    // Using a sample image URL for demonstration
    onImageUpload('https://picsum.photos/512/512')
  }, [onImageUpload])

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Transform Your Images
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Upload a 2D image and watch as it transforms into an interactive 3D landscape using neural displacement mapping.
        </p>
      </div>

      <div
        className={`relative w-96 h-64 border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragging
            ? 'border-purple-400 bg-purple-400/10 scale-105'
            : 'border-gray-600 bg-gray-900/50 hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          <div className="text-center">
            <p className="text-white font-semibold">
              {isDragging ? 'Drop your image here' : 'Drag & drop your image here'}
            </p>
            <p className="text-gray-400 text-sm">or click to browse</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handleSampleImage}
          className="cyber-button"
        >
          Try Sample Image
        </button>
      </div>

      <div className="text-center text-xs text-gray-500 max-w-md">
        <p>Supported formats: JPG, PNG, WebP</p>
        <p>Best results with high-contrast images</p>
      </div>
    </div>
  )
}

export default ImageUploader