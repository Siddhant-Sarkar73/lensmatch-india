import { createContext, useContext, useState, useCallback } from 'react'

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([])

  const add = useCallback((lens) => {
    setCompareList((prev) => {
      if (prev.length >= 3) return prev
      if (prev.some((item) => item.id === lens.id)) return prev
      return [...prev, lens]
    })
  }, [])

  const remove = useCallback((lensId) => {
    setCompareList((prev) => prev.filter((item) => item.id !== lensId))
  }, [])

  const clear = useCallback(() => {
    setCompareList([])
  }, [])

  const isIn = useCallback(
    (lensId) => {
      return compareList.some((item) => item.id === lensId)
    },
    [compareList]
  )

  const isFull = compareList.length >= 3

  const value = {
    compareList,
    add,
    remove,
    clear,
    isIn,
    isFull
  }

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}
