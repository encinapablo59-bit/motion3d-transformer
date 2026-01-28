import React from 'react'

const ControlPanel = ({
  imageUrl,
  displacementScale,
  onDisplacementScaleChange,
  meshDensity,
  onMeshDensityChange,
  autoRotate,
  onAutoRotateChange,
  wireframe,
  onWireframeChange,
  onExport,
  isProcessing
}) => {
  const handleReset = () => {
    onDisplacementScaleChange(2.5)
    onMeshDensityChange(128)
    onAutoRotateChange(true)
    onWireframeChange(false)
  }

  const handleNewImage = () => {
    window.location.reload()
  }

  return (
    <div className="glass-morphism p-6 space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Neural Controls</h3>
      
      {/* Displacement Scale */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300 flex justify-between">
          <span>Displacement Scale</span>
          <span className="text-purple-400">{displacementScale.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={displacementScale}
          onChange={(e) => onDisplacementScaleChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Mesh Density */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300 flex justify-between">
          <span>Mesh Density</span>
          <span className="text-purple-400">{meshDensity}</span>
        </label>
        <input
          type="range"
          min="32"
          max="256"
          step="16"
          value={meshDensity}
          onChange={(e) => onMeshDensityChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Toggle Controls */}
      <div className="space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-300">Auto Rotate</span>
          <button
            onClick={() => onAutoRotateChange(!autoRotate)}
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
            onClick={() => onWireframeChange(!wireframe)}
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

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-gray-700">
        <button
          onClick={onExport}
          disabled={!imageUrl || isProcessing}
          className="w-full cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Export 3D Scene'}
        </button>

        <button
          onClick={handleReset}
          disabled={!imageUrl}
          className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset Controls
        </button>

        <button
          onClick={handleNewImage}
          className="w-full px-4 py-2 border border-gray-600 hover:bg-gray-800 rounded-lg transition-colors"
        >
          New Image
        </button>
      </div>

      {/* Stats */}
      {imageUrl && (
        <div className="pt-4 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Scene Stats</h4>
          <div className="space-y-1 text-xs text-gray-400">
            <p>Vertices: {(meshDensity * meshDensity).toLocaleString()}</p>
            <p>Displacement: {displacementScale.toFixed(1)}x</p>
            <p>Render Mode: {wireframe ? 'Wireframe' : 'Solid'}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ControlPanel