import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyProperties, deleteProperty } from '../../api/index.js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Spinner from '../../components/Spinner'
import { Plus, Edit, Trash2, Eye, Building, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

const MyProperties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProperties = async () => {
    try {
      const res = await getMyProperties()
      setProperties(res.data)
    } catch {
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProperties() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property? This cannot be undone.')) return
    try {
      await deleteProperty(id)
      toast.success('Property deleted')
      setProperties(properties.filter(p => p.id !== id))
    } catch {
      toast.error('Failed to delete property')
    }
  }

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
            <p className="text-gray-500 mt-1">{properties.length} listing{properties.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/landlord/add-property" className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Property</span>
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="card text-center py-16">
            <Building className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">No properties yet</h3>
            <p className="text-gray-400 mt-2 mb-6">Start by adding your first property listing</p>
            <Link to="/landlord/add-property" className="btn-primary">Add Property</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="card hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 h-36 rounded-xl flex items-center justify-center mb-4">
                  <Building className="w-12 h-12 text-primary-300" />
                </div>

                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{property.name}</h3>
                  <span className={property.status === 'active' ? 'badge-active' : 'bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded-full'}>
                    {property.status}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-gray-500 text-sm mb-3">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{property.location}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-gray-900">{property.total_units}</p>
                    <p className="text-xs text-gray-400">Total</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-green-600">{property.vacant_units}</p>
                    <p className="text-xs text-gray-400">Vacant</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-orange-600">{property.occupied_units}</p>
                    <p className="text-xs text-gray-400">Occupied</p>
                  </div>
                </div>

                <p className="text-primary-600 font-bold mb-4">KES {property.price?.toLocaleString()}/month</p>

                <div className="flex gap-2">
                  <Link to={`/tenant/houses/${property.id}`}
                    className="flex-1 flex items-center justify-center space-x-1 btn-secondary text-sm py-2">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                  <Link to={`/landlord/edit-property/${property.id}`}
                    className="flex-1 flex items-center justify-center space-x-1 btn-primary text-sm py-2">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  <button onClick={() => handleDelete(property.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default MyProperties