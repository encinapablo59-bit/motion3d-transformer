import React, { useState, useCallback, useEffect } from 'react'
import Scene3D from './components/Scene3D'
import ControlPanel from './components/ControlPanel'
import ImageUploader from './components/ImageUploader'
import VideoUploader from './components/VideoUploader'
import MotionControls from './components/MotionControls'
import Header from './components/Header'
import { motionTransferAPI } from './services/api'

function App() {
  const [step, setStep] = useState(1) // 1: image upload, 2: video upload, 3: motion controls
  const [imageUrl, setImageUrl] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [videoName, setVideoName] = useState(null)
  const [displacementScale, setDisplacementScale] = useState(2.5)
  const [meshDensity, setMeshDensity] = useState(128)
  const [autoRotate, setAutoRotate] = useState(true)
  const [wireframe, setWireframe] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [selectedModel, setSelectedModel] = useState('motion_clone')
  const [currentTask, setCurrentTask] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [error, setError] = useState(null)

  const handleImageUpload = useCallback((url) => {
    setImageUrl(url)
    setStep(2)
    setError(null)
  }, [])

  const handleVideoUpload = useCallback((url, name) => {
    setVideoUrl(url)
    setVideoName(name)
    setStep(3)
    setError(null)
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!imageUrl || !videoUrl) {
      setError('Please upload both image and video')
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    setError(null)

    try {
      const response = await motionTransferAPI.generateMotion(
        imageUrl,
        videoUrl,
        selectedModel
      )

      setCurrentTask(response.task_id)

      // Poll for task completion
      const pollInterval = setInterval(async () => {
        const taskStatus = await motionTransferAPI.getTaskStatus(response.task_id)
        
        setProcessingProgress(taskStatus.progress || 0)

        if (taskStatus.status === 'completed') {
          clearInterval(pollInterval)
          setIsProcessing(false)
          setResultUrl(`/api/download/${response.task_id}`)
          setProcessingProgress(100)
        } else if (taskStatus.status === 'error') {
          clearInterval(pollInterval)
          setIsProcessing(false)
          setError(taskStatus.error || 'Processing failed')
        }
      }, 2000)

    } catch (err) {
      setIsProcessing(false)
      setError(err.message || 'Failed to generate motion transfer')
    }
  }, [imageUrl, videoUrl, selectedModel])

  const handleModelChange = useCallback((model) => {
    setSelectedModel(model)
  }, [])

  const handleExport = useCallback(() => {
    if (resultUrl) {
      window.open(resultUrl, '_blank')
    } else {
      console.log('Exporting 3D scene...')
    }
  }, [resultUrl])

  const resetAll = useCallback(() => {
    setStep(1)
    setImageUrl(null)
    setVideoUrl(null)
    setVideoName(null)
    setResultUrl(null)
    setCurrentTask(null)
    setError(null)
    setProcessingProgress(0)
    setIsProcessing(false)
  }, [])

  const getTaskStatus = useCallback(() => {
    if (currentTask) {
      return {
        status: isProcessing ? 'processing' : (resultUrl ? 'completed' : 'pending'),
        error: error
      }
    }
    return null
  }, [currentTask, isProcessing, resultUrl, error])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      
      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">
        <Header step={step} onReset={resetAll} />
        
        <div className="flex-1 relative">
          {/* 3D Scene */}
          <Scene3D
            imageUrl={resultUrl || imageUrl}
            displacementScale={displacementScale}
            meshDensity={meshDensity}
            autoRotate={autoRotate}
            wireframe={wireframe}
            isProcessing={isProcessing}
          />
          
          {/* Step 1: Image Uploader */}
          {step === 1 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
          )}
          
          {/* Step 2: Video Uploader */}
          {step === 2 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <VideoUploader onVideoUpload={handleVideoUpload} />
            </div>
          )}
          
          {/* Step 3: Motion Controls */}
          {step === 3 && (
            <>
              <div className="absolute top-4 right-4 w-80">
                <MotionControls
                  onGenerate={handleGenerate}
                  isProcessing={isProcessing}
                  processingProgress={processingProgress}
                  selectedModel={selectedModel}
                  onModelChange={handleModelChange}
                  taskStatus={getTaskStatus()}
                />
              </div>
              
              {/* Legacy Control Panel for 3D controls */}
              <div className="absolute top-4 left-4 w-64">
                <div className="glass-morphism p-4 space-y-4">
                  <h4 className="text-sm font-semibold text-white">3D Controls</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300 flex justify-between">
                      <span>Displacement</span>
                      <span className="text-purple-400">{displacementScale.toFixed(1)}</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={displacementScale}
                      onChange={(e) => setDisplacementScale(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-300">Auto Rotate</span>
                      <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          autoRotate ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            autoRotate ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-gray-300">Wireframe</span>
                      <button
                        onClick={() => setWireframe(!wireframe)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          wireframe ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            wireframe ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </label>
                  </div>

                  {resultUrl && (
                    <button
                      onClick={handleExport}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                    >
                      Download Result
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
          
          {/* Error Display */}
          {error && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-96 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App