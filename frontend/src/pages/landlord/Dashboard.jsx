import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyProperties } from '../../api/index.js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Spinner from '../../components/Spinner'
import { Home, Plus, Building, Users, TrendingUp, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const LandlordDashboard = () => {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyProperties()
        setProperties(res.data)
      } catch {
        toast.error('Failed to load properties')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalUnits = properties.reduce((sum, p) => sum + p.total_units, 0)
  const vacantUnits = properties.reduce((sum, p) => sum + (p.vacant_units || 0), 0)
  const occupiedUnits = properties.reduce((sum, p) => sum + (p.occupied_units || 0), 0)

  const stats = [
    { label: 'My Properties', value: properties.length, icon: <Building className="w-6 h-6 text-primary-600" />, bg: 'bg-primary-50' },
    { label: 'Total Units', value: totalUnits, icon: <Home className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Vacant Units', value: vacantUnits, icon: <TrendingUp className="w-6 h-6 text-green-600" />, bg: 'bg-green-50' },
    { label: 'Occupied Units', value: occupiedUnits, icon: <Users className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-50' },
  ]

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.full_name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Manage your properties and track bookings.</p>
          </div>
          <Link to="/landlord/add-property" className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Property</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="card flex items-center space-x-4">
              <div className={`${stat.bg} p-3 rounded-xl`}>{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Properties */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Properties</h2>
            <Link to="/landlord/my-properties" className="text-primary-600 text-sm font-medium flex items-center space-x-1 hover:underline">
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-16">
              <Building className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400">No properties yet</h3>
              <p className="text-gray-400 mt-2 mb-6">Add your first property listing</p>
              <Link to="/landlord/add-property" className="btn-primary">Add Property</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.slice(0, 6).map((property) => (
                <div key={property.id} className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 hover:shadow-sm transition-all">
                  <div className="bg-primary-50 h-28 rounded-lg flex items-center justify-center mb-3">
                    <Home className="w-10 h-10 text-primary-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{property.name}</h3>
                  <p className="text-gray-500 text-sm truncate">{property.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary-600 font-bold text-sm">KES {property.price?.toLocaleString()}/mo</span>
                    <span className={property.vacant_units > 0 ? 'badge-vacant' : 'badge-occupied'}>
                      {property.vacant_units} vacant
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link to={`/landlord/edit-property/${property.id}`} className="flex-1 btn-secondary text-center text-sm py-1">Edit</Link>
                    <Link to={`/tenant/houses/${property.id}`} className="flex-1 btn-primary text-center text-sm py-1">View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default LandlordDashboard