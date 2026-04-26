import { useState, useEffect } from 'react'
import { getProperties } from '../../api/index.js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import HouseCard from '../../components/HouseCard'
import Spinner from '../../components/Spinner'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import toast from 'react-hot-toast'

const houseTypes = ['bedsitter', 'single_room', '1BR', '2BR', '3BR', '4BR']

const TenantSearch = () => {
  const [properties, setProperties] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    location: '',
    house_type: '',
    min_price: '',
    max_price: '',
  })

  const fetchProperties = async (currentPage = 1, currentFilters = filters) => {
    setLoading(true)
    try {
      const params = { page: currentPage, page_size: 9 }
      if (currentFilters.location) params.location = currentFilters.location
      if (currentFilters.house_type) params.house_type = currentFilters.house_type
      if (currentFilters.min_price) params.min_price = currentFilters.min_price
      if (currentFilters.max_price) params.max_price = currentFilters.max_price

      const res = await getProperties(params)
      setProperties(res.data.results)
      setTotal(res.data.total)
    } catch {
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchProperties(1, filters)
  }

  const handleClearFilters = () => {
    const cleared = { location: '', house_type: '', min_price: '', max_price: '' }
    setFilters(cleared)
    setPage(1)
    fetchProperties(1, cleared)
  }

  const totalPages = Math.ceil(total / 9)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Search Houses</h1>
          <p className="text-gray-500 mt-1">{total} properties available</p>
        </div>

        {/* Search & Filter Bar */}
        <form onSubmit={handleSearch} className="card mb-6">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-48">
              <input
                type="text"
                placeholder="Search by location e.g. Westlands, Nairobi"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="input-field"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button type="submit" className="btn-primary flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            {(filters.house_type || filters.min_price || filters.max_price) && (
              <button type="button" onClick={handleClearFilters} className="btn-danger flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House Type</label>
                <select
                  value={filters.house_type}
                  onChange={(e) => setFilters({ ...filters, house_type: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  {houseTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (KES)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={filters.min_price}
                  onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (KES)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={filters.max_price}
                  onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </form>

        {/* Results */}
        {loading ? (
          <Spinner />
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">No properties found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <HouseCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                <button
                  onClick={() => { setPage(p => p - 1); fetchProperties(page - 1) }}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="flex items-center px-4 text-gray-600 font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => { setPage(p => p + 1); fetchProperties(page + 1) }}
                  disabled={page === totalPages}
                  className="btn-secondary disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default TenantSearch