import { useState, useCallback } from 'react'

const DEFAULT_FILTERS = {
  search: '',
  sort: 'popular',
  bodyMount: '',
  activeBrand: 'all',
  filters: {
    brands: [],
    mounts: [],
    focals: [],
    apertures: [],
    priceRanges: [],
    features: []
  }
}

export function useFilters() {
  const [search, setSearch] = useState(DEFAULT_FILTERS.search)
  const [sort, setSort] = useState(DEFAULT_FILTERS.sort)
  const [bodyMount, setBodyMount] = useState(DEFAULT_FILTERS.bodyMount)
  const [activeBrand, setActiveBrand] = useState(DEFAULT_FILTERS.activeBrand)
  const [filters, setFilters] = useState(DEFAULT_FILTERS.filters)

  const reset = useCallback(() => {
    setSearch(DEFAULT_FILTERS.search)
    setSort(DEFAULT_FILTERS.sort)
    setBodyMount(DEFAULT_FILTERS.bodyMount)
    setActiveBrand(DEFAULT_FILTERS.activeBrand)
    setFilters(DEFAULT_FILTERS.filters)
  }, [])

  const filtered = useCallback(
    (lensesArray) => {
      if (!Array.isArray(lensesArray)) return []

      let result = [...lensesArray]

      // Apply search filter
      if (search.trim()) {
        const searchLower = search.toLowerCase()
        result = result.filter((lens) => {
          const brand = (lens.brand || '').toLowerCase()
          const name = (lens.name || '').toLowerCase()
          return brand.includes(searchLower) || name.includes(searchLower)
        })
      }

      // Apply bodyMount filter
      if (bodyMount) {
        result = result.filter((lens) => lens.mount === bodyMount)
      }

      // Apply activeBrand filter
      if (activeBrand && activeBrand !== 'all') {
        result = result.filter((lens) => lens.brand === activeBrand)
      }

      // Apply brands[] filter
      if (filters.brands && filters.brands.length > 0) {
        result = result.filter((lens) => filters.brands.includes(lens.brand))
      }

      // Apply mounts[] filter
      if (filters.mounts && filters.mounts.length > 0) {
        result = result.filter((lens) => filters.mounts.includes(lens.mount))
      }

      // Apply focals[] filter
      if (filters.focals && filters.focals.length > 0) {
        result = result.filter((lens) => {
          const mm = lens.mm
          for (const focal of filters.focals) {
            if (focal === '35' && mm === 35) return true
            if (focal === '50' && mm === 50) return true
            if (focal === '85' && mm === 85) return true
            if (focal === '105' && (mm === 100 || mm === 105)) return true
            if (focal === '135' && mm === 135) return true
            if (focal === 'other' && ![35, 50, 85, 100, 105, 135].includes(mm)) return true
          }
          return false
        })
      }

      // Apply apertures[] filter
      if (filters.apertures && filters.apertures.length > 0) {
        result = result.filter((lens) =>
          filters.apertures.includes(String(lens.f))
        )
      }

      // Apply priceRanges[] filter
      if (filters.priceRanges && filters.priceRanges.length > 0) {
        result = result.filter((lens) => {
          const price = lens.price || 0
          for (const range of filters.priceRanges) {
            if (range === 'under15' && price < 15000) return true
            if (range === '15-35' && price >= 15000 && price <= 35000) return true
            if (range === '35-70' && price > 35000 && price <= 70000) return true
            if (range === '70-120' && price > 70000 && price <= 120000) return true
            if (range === 'over120' && price >= 120000) return true
          }
          return false
        })
      }

      // Apply features[] filter
      if (filters.features && filters.features.length > 0) {
        result = result.filter((lens) => {
          for (const feature of filters.features) {
            if (feature === 'ois' && lens.ois) return true
            if (feature === 'af' && lens.af) return true
            if (feature === 'weather' && lens.weather) return true
            if (feature === 'apsc' && lens.apsc !== undefined && lens.apsc) return true
          }
          return false
        })
      }

      // Apply sorting
      if (sort === 'popular') {
        result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
      } else if (sort === 'price-asc') {
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
      } else if (sort === 'price-desc') {
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
      } else if (sort === 'rating') {
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      } else if (sort === 'name') {
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      }

      return result
    },
    [search, sort, bodyMount, activeBrand, filters]
  )

  return {
    search,
    setSearch,
    sort,
    setSort,
    bodyMount,
    setBodyMount,
    activeBrand,
    setActiveBrand,
    filters,
    setFilters,
    reset,
    filtered
  }
}
