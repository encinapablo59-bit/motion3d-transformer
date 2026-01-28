import React from 'react'

const Header = ({ step = 1, onReset }) => {
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Upload Source Image'
      case 2:
        return 'Upload Driving Video'
      case 3:
        return 'Generate Motion Transfer'
      default:
        return 'Motion3D Transformer'
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return 'Choose the image you want to animate'
      case 2:
        return 'Select a video with the motion to transfer'
      case 3:
        return 'Configure settings and generate animation'
      default:
        return 'Real-time motion transfer for 3D character animation'
    }
  }

  return (
    <header className="relative z-20 px-6 py-4 glass-morphism">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Motion3D Transformer
            </h1>
            <p className="text-xs text-gray-400">{getStepDescription()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    s === step
                      ? 'bg-purple-600 text-white'
                      : s < step
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-8 h-1 transition-colors ${
                      s < step ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Status */}
          <div className="text-sm text-gray-400">
            {getStepTitle()}
          </div>
          
          {/* Reset Button */}
          {step > 1 && onReset && (
            <button
              onClick={onReset}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              Start Over
            </button>
          )}
          
          {/* Live Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header