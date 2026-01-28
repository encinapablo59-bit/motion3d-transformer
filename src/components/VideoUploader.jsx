"""
Video Uploader Component for Motion3D Transformer
Handles video file upload for driving videos
"""

import React, { useState, useCallback } from 'react'

const VideoUploader = ({ onVideoUpload, maxSizeMB = 50 }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [videoPreview, setVideoPreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processVideoFile = useCallback((file) => {
    if (!file) return null

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid video file')
      return null
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`Video size must be less than ${maxSizeMB}MB`)
      return null
    }

    setError(null)
    return file
  }, [maxSizeMB])

  const createVideoPreview = useCallback((file) => {
    const url = URL.createObjectURL(file)
    setVideoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const videoFile = files.find(file => file.type.startsWith('video/'))
    
    if (videoFile) {
      const processedFile = processVideoFile(videoFile)
      if (processedFile) {
        setIsUploading(true)
        setUploadProgress(0)
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })
        }, 100)

        // Create video preview
        const cleanupPreview = createVideoPreview(videoFile)
        
        // Convert to base64 and send to parent
        const reader = new FileReader()
        reader.onload = (e) => {
          setTimeout(() => {
            setUploadProgress(100)
            setIsUploading(false)
            onVideoUpload(e.target.result, file.name, cleanupPreview)
            setUploadProgress(0)
          }, 1000)
        }
        reader.readAsDataURL(videoFile)
      }
    } else {
      setError('Please upload a valid video file')
    }
  }, [processVideoFile, createVideoPreview, onVideoUpload])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      const processedFile = processVideoFile(file)
      if (processedFile) {
        setIsUploading(true)
        setUploadProgress(0)
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })
        }, 100)

        // Create video preview
        const cleanupPreview = createVideoPreview(file)
        
        // Convert to base64 and send to parent
        const reader = new FileReader()
        reader.onload = (e) => {
          setTimeout(() => {
            setUploadProgress(100)
            setIsUploading(false)
            onVideoUpload(e.target.result, file.name, cleanupPreview)
            setUploadProgress(0)
          }, 1000)
        }
        reader.readAsDataURL(file)
      }
    }
  }, [processVideoFile, createVideoPreview, onVideoUpload])

  const clearVideo = useCallback(() => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
      setVideoPreview(null)
    }
    setError(null)
  }, [videoPreview])

  const handleSampleVideo = useCallback(() => {
    // Using a sample video URL for demonstration
    const sampleUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    onVideoUpload(sampleUrl, 'sample_dance.mp4', () => {})
  }, [onVideoUpload])

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold text-white">
          Upload Driving Video
        </h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Upload a video containing the motion you want to transfer to your image.
          Dance, gestures, or facial expressions work great!
        </p>
      </div>

      {!videoPreview ? (
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
            accept="video/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            {isUploading ? (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-white font-semibold">Uploading...</p>
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm">{uploadProgress}%</p>
              </div>
            ) : (
              <>
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                
                <div className="text-center">
                  <p className="text-white font-semibold">
                    {isDragging ? 'Drop your video here' : 'Drag & drop your video here'}
                  </p>
                  <p className="text-gray-400 text-sm">or click to browse</p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="w-96 space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
            <video
              src={videoPreview}
              className="w-full h-64 object-cover"
              controls
              autoPlay={false}
              muted
            />
            <button
              onClick={clearVideo}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-green-400 font-medium">✓ Video uploaded successfully</p>
            <button
              onClick={clearVideo}
              className="mt-2 text-sm text-gray-400 hover:text-gray-300 underline"
            >
              Upload different video
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="w-96 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={handleSampleVideo}
          disabled={isUploading}
          className="cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Try Sample Video
        </button>
      </div>

      <div className="text-center text-xs text-gray-500 max-w-md">
        <p>Supported formats: MP4, AVI, MOV, WebM</p>
        <p>Best results: 5-30 seconds, clear motion, good lighting</p>
        <p>Max file size: {maxSizeMB}MB</p>
      </div>
    </div>
  )
}

export default VideoUploader