import { useState, useCallback } from 'react'
import { loadImageAsTexture, validateImageFile } from '../utils/imageUtils'

export const useImageUpload = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const uploadImage = useCallback(async (file) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate file
      validateImageFile(file)
      
      // Convert to URL for preview
      const imageUrl = URL.createObjectURL(file)
      
      // Preload the image to ensure it loads correctly
      await loadImageAsTexture(imageUrl)
      
      setIsLoading(false)
      return imageUrl
    } catch (err) {
      setIsLoading(false)
      setError(err.message)
      throw err
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    uploadImage,
    isLoading,
    error,
    clearError
  }
}

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}