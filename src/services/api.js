/**
 * API Service for Motion3D Transformer
 * Handles communication with the FastAPI backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

class MotionTransferAPI {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error: ${error.message}`)
      throw error
    }
  }

  // Health check
  async healthCheck() {
    return await this.request('/health')
  }

  // Get available models
  async getAvailableModels() {
    return await this.request('/models')
  }

  // Get current model information
  async getCurrentModel() {
    return await this.request('/model/current')
  }

  // Switch model
  async switchModel(modelName) {
    return await this.request(`/model/switch/${modelName}`, {
      method: 'POST',
    })
  }

  // Generate motion transfer
  async generateMotion(imageFile, videoFile, modelName = 'motion_clone') {
    const formData = new FormData()
    
    // Handle different file types (File objects, base64 strings, or URLs)
    if (imageFile instanceof File) {
      formData.append('source_image', imageFile)
    } else if (typeof imageFile === 'string' && imageFile.startsWith('data:')) {
      // Convert base64 to File
      const response = await fetch(imageFile)
      const blob = await response.blob()
      const file = new File([blob], 'source.jpg', { type: 'image/jpeg' })
      formData.append('source_image', file)
    } else {
      // Assume it's a URL, fetch and convert
      const response = await fetch(imageFile)
      const blob = await response.blob()
      const file = new File([blob], 'source.jpg', { type: 'image/jpeg' })
      formData.append('source_image', file)
    }

    if (videoFile instanceof File) {
      formData.append('driving_video', videoFile)
    } else if (typeof videoFile === 'string' && videoFile.startsWith('data:')) {
      // Convert base64 to File
      const response = await fetch(videoFile)
      const blob = await response.blob()
      const file = new File([blob], 'driving.mp4', { type: 'video/mp4' })
      formData.append('driving_video', file)
    } else {
      // Assume it's a URL, fetch and convert
      const response = await fetch(videoFile)
      const blob = await response.blob()
      const file = new File([blob], 'driving.mp4', { type: 'video/mp4' })
      formData.append('driving_video', file)
    }

    formData.append('model_name', modelName)

    return await this.request('/generate', {
      method: 'POST',
      headers: {}, // Let browser set multipart/form-data boundary
      body: formData,
    })
  }

  // Get task status
  async getTaskStatus(taskId) {
    return await this.request(`/task/${taskId}`)
  }

  // Download result
  async downloadResult(taskId) {
    const url = `${this.baseUrl}/download/${taskId}`
    
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `motion3d_${taskId}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the object URL
      window.URL.revokeObjectURL(downloadUrl)
      
      return true
    } catch (error) {
      console.error(`Download Error: ${error.message}`)
      throw error
    }
  }

  // List all tasks
  async listTasks() {
    return await this.request('/tasks')
  }

  // Delete/cleanup task
  async cleanupTask(taskId) {
    return await this.request(`/task/${taskId}`, {
      method: 'DELETE',
    })
  }

  // Benchmark model performance
  async benchmarkModel(imageFile, videoFile, modelName = 'motion_clone', numRuns = 3) {
    const formData = new FormData()
    
    // Handle image file
    if (imageFile instanceof File) {
      formData.append('source_image', imageFile)
    } else {
      const response = await fetch(imageFile)
      const blob = await response.blob()
      const file = new File([blob], 'source.jpg', { type: 'image/jpeg' })
      formData.append('source_image', file)
    }

    // Handle video file
    if (videoFile instanceof File) {
      formData.append('driving_video', videoFile)
    } else {
      const response = await fetch(videoFile)
      const blob = await response.blob()
      const file = new File([blob], 'driving.mp4', { type: 'video/mp4' })
      formData.append('driving_video', file)
    }

    formData.append('model_name', modelName)
    formData.append('num_runs', numRuns.toString())

    return await this.request('/benchmark', {
      method: 'POST',
      headers: {}, // Let browser set multipart/form-data boundary
      body: formData,
    })
  }

  // Helper method to convert data URL to File
  dataURLToFile(dataURL, filename) {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    
    while(n--){
      u8arr[n] = bstr.charCodeAt(n)
    }
    
    return new File([u8arr], filename, {type:mime})
  }
}

// Export singleton instance
export const motionTransferAPI = new MotionTransferAPI()

// Export class for custom instances if needed
export { MotionTransferAPI }

// Utility functions
export const createFileFromDataURL = (dataURL, filename, mimeType) => {
  const arr = dataURL.split(',')
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while(n--){
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new File([u8arr], filename, {type: mimeType})
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }
    
    video.onerror = () => {
      reject(new Error('Could not load video metadata'))
    }
    
    video.src = URL.createObjectURL(file)
  })
}