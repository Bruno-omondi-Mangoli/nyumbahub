import { useState, useEffect } from 'react'
import { getAllPropertiesAdmin, updatePropertyStatus } from '../../api/index.js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Spinner from '../../components/Spinner'
import { Building, MapPin, Search, CheckCircle, XCircle, PauseCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminListings = () => {
  const [properties, setProperties] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getAllPropertiesAdmin()
        setProperties(res.data)
        setFiltered(res.data)
      } catch {
        toast.error('Failed to load listings')
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(properties.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    ))
  }, [search, properties])

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updatePropertyStatus(id, { status })
      setProperties(properties.map(p => p.id === id ? res.data : p))
      toast.success(`Property ${status}`)
    } catch {
      toast.error('Failed to update property')
    }
  }

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Listings</h1>
          <p className="text-gray-500 mt-1">{properties.length} total properties</p>
        </div>

        <div className="card mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <div key={property.id} className="card hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-32 rounded-xl flex items-center justify-center mb-4">
                <Building className="w-10 h-10 text-gray-300" />
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{property.name}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  property.status === 'active' ? 'bg-green-100 text-green-700' :
                  property.status === 'suspended' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {property.status}
                </span>
              </div>

              <div className="flex items-center space-x-1 text-gray-500 text-sm mb-3">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{property.location}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>{property.house_type}</span>
                <span>KES {property.price?.toLocaleString()}/mo</span>
                <span>{property.total_units} units</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(property.id, 'active')}
                  disabled={property.status === 'active'}
                  className="flex-1 flex items-center justify-center space-x-1 bg-green-50 text-green-700 text-sm py-2 rounded-lg hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleStatusChange(property.id, 'inactive')}
                  disabled={property.status === 'inactive'}
                  className="flex-1 flex items-center justify-center space-x-1 bg-gray-50 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <PauseCircle className="w-4 h-4" />
                  <span>Deactivate</span>
                </button>
                <button
                  onClick={() => handleStatusChange(property.id, 'suspended')}
                  disabled={property.status === 'suspended'}
                  className="flex-1 flex items-center justify-center space-x-1 bg-red-50 text-red-600 text-sm py-2 rounded-lg hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Suspend</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AdminListings