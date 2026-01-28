"""
Motion Controls Component for Motion3D Transformer
Controls for motion transfer parameters and playback
"""

import React, { useState, useCallback } from 'react'

const MotionControls = ({ 
  onGenerate, 
  isProcessing, 
  processingProgress,
  selectedModel,
  onModelChange,
  taskStatus 
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [loopPlayback, setLoopPlayback] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleGenerate = useCallback(() => {
    if (onGenerate && !isProcessing) {
      onGenerate()
    }
  }, [onGenerate, isProcessing])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusMessage = () => {
    if (!taskStatus) return 'Ready to generate'
    
    switch (taskStatus.status) {
      case 'processing':
        return `Processing... ${processingProgress || 0}%`
      case 'completed':
        return '✓ Motion transfer complete'
      case 'error':
        return `❌ Error: ${taskStatus.error || 'Unknown error'}`
      default:
        return 'Ready to generate'
    }
  }

  const getStatusColor = () => {
    if (!taskStatus) return 'text-gray-400'
    
    switch (taskStatus.status) {
      case 'processing':
        return 'text-yellow-400'
      case 'completed':
        return 'text-green-400'
      case 'error':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="glass-morphism p-6 space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Motion Controls</h3>
      
      {/* Model Selection */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Model Selection</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onModelChange && onModelChange('motion_clone')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedModel === 'motion_clone'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            MotionClone
            <span className="block text-xs opacity-75">High Quality</span>
          </button>
          <button
            onClick={() => onModelChange && onModelChange('fomm')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedModel === 'fomm'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            FOMM
            <span className="block text-xs opacity-75">Fast Processing</span>
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Status</label>
        <div className={`p-3 bg-gray-900 rounded-lg ${getStatusColor()} text-sm font-medium`}>
          {getStatusMessage()}
        </div>
        
        {isProcessing && processingProgress !== undefined && (
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isProcessing}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          isProcessing
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          'Generate Motion Transfer'
        )}
      </button>

      {/* Playback Controls (shown when result is ready) */}
      {taskStatus && taskStatus.status === 'completed' && (
        <div className="space-y-4 pt-4 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-gray-300">Playback Controls</h4>
          
          <div className="space-y-3">
            {/* Playback Speed */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex justify-between">
                <span>Playback Speed</span>
                <span className="text-purple-400">{playbackSpeed.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.25"
                max="2.0"
                step="0.25"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Loop Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-300">Loop Playback</span>
              <button
                onClick={() => setLoopPlayback(!loopPlayback)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  loopPlayback ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    loopPlayback ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-purple-400 hover:text-purple-300 flex items-center space-x-2"
        >
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Settings</span>
          <svg 
            className={`w-4 h-4 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="space-y-3">
            <div className="text-xs text-gray-400 space-y-1">
              <p>• MotionClone: Higher quality, slower processing</p>
              <p>• FOMM: Faster processing, good quality</p>
              <p>• Processing time varies based on video length</p>
              <p>• Results are automatically optimized for web</p>
            </div>
            
            <div className="text-xs text-gray-500 pt-2">
              <p>Model Information:</p>
              <p>• Memory usage: ~2GB (MotionClone)</p>
              <p>• Memory usage: ~1GB (FOMM)</p>
              <p>• Max video length: 30 seconds</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
        >
          Reset All
        </button>
        <button
          disabled={!taskStatus || taskStatus.status !== 'completed'}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg transition-colors text-sm disabled:cursor-not-allowed"
        >
          Download Result
        </button>
      </div>
    </div>
  )
}

export default MotionControls