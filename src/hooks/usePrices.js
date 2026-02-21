import { useState, useEffect, useCallback } from 'react'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const MOCK_PRICES = {
  amazon: { price: null, url: 'https://www.amazon.in/s?k=portrait+lens', updatedAt: null },
  flipkart: { price: null, url: 'https://www.flipkart.com/search?q=portrait+lens', updatedAt: null },
  history: []
}

export function usePrices(lensId) {
  const [prices, setPrices] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [rateLimitMinutes, setRateLimitMinutes] = useState(null)

  useEffect(() => {
    if (!lensId) {
      setIsLoading(false)
      return
    }

    const fetchPrices = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${BACKEND_URL}/api/prices/${lensId}`)
        if (!response.ok) throw new Error('Failed to fetch prices')
        const data = await response.json()
        setPrices(data)
      } catch (err) {
        console.warn('Backend unavailable, using mock prices:', err.message)
        setPrices(MOCK_PRICES)
        setError(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()
  }, [lensId])

  const refresh = useCallback(async () => {
    if (!lensId) return

    setIsRefreshing(true)
    setError(null)
    try {
      const response = await fetch(`${BACKEND_URL}/api/prices/refresh/${lensId}`, {
        method: 'POST'
      })

      if (response.status === 429) {
        const data = await response.json()
        const remainingMinutes = data.retryAfter || 5
        setRateLimitMinutes(remainingMinutes)
        setError('Rate limited. Please try again later.')
        return remainingMinutes
      }

      if (!response.ok) throw new Error('Failed to refresh prices')
      const data = await response.json()
      setPrices(data)
      setRateLimitMinutes(null)
    } catch (err) {
      console.error('Error refreshing prices:', err)
      setError(err.message || 'Failed to refresh prices')
    } finally {
      setIsRefreshing(false)
    }
  }, [lensId])

  return {
    prices,
    isLoading,
    isRefreshing,
    error,
    refresh,
    rateLimitMinutes
  }
}
