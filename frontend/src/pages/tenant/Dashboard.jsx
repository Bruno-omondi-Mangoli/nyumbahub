import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyBookings, getProperties } from '../../api/index.js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Spinner from '../../components/Spinner'
import { Search, BookMarked, Home, Calendar, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const TenantDashboard = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [recentProperties, setRecentProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, propertiesRes] = await Promise.all([
          getMyBookings(),
          getProperties({ page: 1, page_size: 3 })
        ])
        setBookings(bookingsRes.data.results)
        setRecentProperties(propertiesRes.data.results)
      } catch {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { label: 'My Bookings', value: bookings.length, icon: <Calendar className="w-6 h-6 text-primary-600" />, link: '/tenant/bookmarks' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, icon: <Home className="w-6 h-6 text-yellow-500" />, link: '/tenant/bookmarks' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: <BookMarked className="w-6 h-6 text-green-500" />, link: '/tenant/bookmarks' },
  ]

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Find your perfect home today.</p>
        </div>

        {/* Search CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">Looking for a new home?</h2>
          <p className="text-primary-100 mb-4">Search thousands of listings across Kenya.</p>
          <Link to="/tenant/search" className="inline-flex items-center space-x-2 bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">
            <Search className="w-5 h-5" />
            <span>Search Houses</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <Link to={stat.link} key={stat.label} className="card hover:shadow-md transition-shadow flex items-center space-x-4">
              <div className="bg-gray-50 p-3 rounded-xl">{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Listings */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Listings</h2>
            <Link to="/tenant/search" className="text-primary-600 text-sm font-medium flex items-center space-x-1 hover:underline">
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentProperties.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No properties available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentProperties.map((property) => (
                <Link key={property.id} to={`/tenant/houses/${property.id}`} className="border border-gray-100 rounded-xl p-4 hover:border-primary-200 hover:shadow-sm transition-all">
                  <div className="bg-primary-50 h-32 rounded-lg flex items-center justify-center mb-3">
                    <Home className="w-10 h-10 text-primary-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{property.name}</h3>
                  <p className="text-gray-500 text-sm truncate">{property.location}</p>
                  <p className="text-primary-600 font-bold mt-1">KES {property.price?.toLocaleString()}/mo</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default TenantDashboard