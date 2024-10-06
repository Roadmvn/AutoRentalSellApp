import { useState, useCallback } from 'react'

export function useErrorHandler() {
  const [error, setError] = useState(null)

  const handleError = useCallback((error: Error) => {
    console.error('An error occurred:', error)
    setError(error.message)
    // Vous pouvez ajouter ici une logique pour envoyer l'erreur à un service de suivi
  }, [])

  return { error, handleError }
}