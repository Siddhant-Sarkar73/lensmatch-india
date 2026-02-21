import { useState } from 'react';
import { Search, Grid3X3, List, Settings } from 'lucide-react';
import LensCard from '../components/LensCard';
import FilterSidebar from '../components/FilterSidebar';
import CompareBar from '../components/CompareBar';
import { useFilters } from '../hooks/useFilters';
import { useCompare } from '../hooks/useCompare';
import LENSES from '../data/lenses.json';

const PER_PAGE = 12;
const BRANDS = ['Nikon', 'Canon', 'Sony', 'Fujifilm', 'Sigma', 'Tamron'];

export default function Catalogue() {
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('relevance');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeBrand, setActiveBrand] = useState(null);

  const filters = useFilters();
  const compare = useCompare();

  // Filter lenses
  let filteredLenses = LENSES.filter((lens) => {
    if (search && !lens.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (activeBrand && lens.brand !== activeBrand) {
      return false;
    }
    return true;
  });

  // Sort lenses
  if (sort === 'price-low') {
    filteredLenses.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sort === 'price-high') {
    filteredLenses.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sort === 'rating') {
    filteredLenses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Pagination
  const totalPages = Math.ceil(filteredLenses.length / PER_PAGE);
  const startIdx = (page - 1) * PER_PAGE;
  const paginatedLenses = filteredLenses.slice(startIdx, startIdx + PER_PAGE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleBrandFilter = (brand) => {
    setActiveBrand(activeBrand === brand ? null : brand);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  return (
    <div className="font-nunito bg-cream min-h-screen">
      {/* PAGE HEADER */}
      <div className="bg-brown text-cream py-10 md:py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-cream-d text-sm mb-2">Home › All Lenses</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">📸 Lens Catalogue</h1>
          <p className="text-cream-d text-lg mb-8 max-w-2xl">
            Browse our complete collection of portrait lenses available in India. Compare specs, prices, and reviews.
          </p>

          {/* Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">{LENSES.length}</div>
              <p className="text-cream-d text-sm">Lenses</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{new Set(LENSES.map(l => l.brand)).size}</div>
              <p className="text-cream-d text-sm">Brands</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{new Set(LENSES.map(l => l.mount)).size}</div>
              <p className="text-cream-d text-sm">Mounts</p>
            </div>
            <div>
              <div className="text-2xl font-bold">₹{Math.min(...LENSES.map(l => l.price || 0)).toLocaleString()}–₹{Math.max(...LENSES.map(l => l.price || 0)).toLocaleString()}</div>
              <p className="text-cream-d text-sm">Price Range</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* BRAND QUICK FILTERS */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => handleBrandFilter(null)}
            className={`pill px-4 py-2 rounded-full font-semibold transition ${
              !activeBrand
                ? 'bg-orange text-white'
                : 'bg-white border-2 border-border text-brown hover:bg-cream-d'
            }`}
          >
            All Brands
          </button>
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandFilter(brand)}
              className={`pill px-4 py-2 rounded-full font-semibold transition ${
                activeBrand === brand
                  ? 'bg-orange text-white'
                  : 'bg-white border-2 border-border text-brown hover:bg-cream-d'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search lenses..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-orange"
            />
          </div>

          {/* Sort Select */}
          <select
            value={sort}
            onChange={handleSortChange}
            className="px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-orange bg-white"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition ${
                view === 'grid'
                  ? 'bg-orange text-white'
                  : 'bg-white border-2 border-border text-brown hover:bg-cream-d'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition ${
                view === 'list'
                  ? 'bg-orange text-white'
                  : 'bg-white border-2 border-border text-brown hover:bg-cream-d'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Filters Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden btn-teal flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* ACTIVE FILTER TAGS */}
        {activeBrand && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="pill-mount bg-orange text-white px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-2">
              Brand: {activeBrand}
              <button
                onClick={() => handleBrandFilter(activeBrand)}
                className="hover:opacity-70 transition"
              >
                ✕
              </button>
            </span>
          </div>
        )}

        {/* RESULTS COUNT */}
        <p className="text-muted text-sm mb-8">
          Showing {paginatedLenses.length} of {filteredLenses.length} lenses
        </p>

        {/* MAIN LAYOUT: SIDEBAR + GRID */}
        <div className="flex gap-8">
          {/* SIDEBAR - Desktop */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              bodyMount={null}
              onBodyMountChange={() => {}}
              onReset={() => {
                setActiveBrand(null);
                setSearch('');
                setPage(1);
              }}
            />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            {/* MOBILE FILTERS DRAWER */}
            {showMobileFilters && (
              <div className="md:hidden mb-8 bg-white border-2 border-border rounded-lg p-6">
                <FilterSidebar
                  filters={filters}
                  bodyMount={null}
                  onBodyMountChange={() => {}}
                  onReset={() => {
                    setActiveBrand(null);
                    setSearch('');
                    setPage(1);
                    setShowMobileFilters(false);
                  }}
                />
              </div>
            )}

            {/* LENS GRID/LIST */}
            {paginatedLenses.length > 0 ? (
              <div
                className={
                  view === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'
                    : 'space-y-4 mb-12'
                }
              >
                {paginatedLenses.map((lens) => (
                  <LensCard
                    key={lens.id}
                    lens={lens}
                    layout={view}
                    onCompare={() => compare.add(lens)}
                    inCompare={compare.isIn(lens.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted text-lg">No lenses found. Try adjusting your filters.</p>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mb-12">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - page) <= 1 || p === 1 || p === totalPages)
                    .map((p, idx, arr) => (
                      <div key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2">...</span>}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-lg font-semibold transition ${
                            page === p
                              ? 'bg-orange text-white'
                              : 'bg-white border-2 border-border text-brown hover:bg-cream-d'
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMPARE BAR - Bottom */}
      {compare.compareList.length > 0 && (
        <CompareBar
          compareList={compare.compareList}
          onRemove={(id) => compare.remove(id)}
          onClear={() => compare.clear()}
          onCompare={() => {}}
        />
      )}
    </div>
  );
}
