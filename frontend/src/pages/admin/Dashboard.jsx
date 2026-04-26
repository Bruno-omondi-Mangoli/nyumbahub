import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAdminDashboard } from '../../api/index.js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Spinner from '../../components/Spinner'
import { Users, Building, CheckCircle, XCircle, BookMarked, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboard()
        setStats(res.data)
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <Spinner fullScreen />

  const cards = [
    { label: 'Total Users', value: stats?.total_users, icon: <Users className="w-6 h-6 text-primary-600" />, bg: 'bg-primary-50', link: '/admin/users' },
    { label: 'Tenants', value: stats?.total_tenants, icon: <Users className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50', link: '/admin/users' },
    { label: 'Landlords', value: stats?.total_landlords, icon: <Users className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50', link: '/admin/users' },
    { label: 'Total Properties', value: stats?.total_properties, icon: <Building className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-50', link: '/admin/listings' },
    { label: 'Active Listings', value: stats?.active_properties, icon: <CheckCircle className="w-6 h-6 text-green-600" />, bg: 'bg-green-50', link: '/admin/listings' },
    { label: 'Inactive Listings', value: stats?.inactive_properties, icon: <XCircle className="w-6 h-6 text-red-500" />, bg: 'bg-red-50', link: '/admin/listings' },
    { label: 'Total Bookings', value: stats?.total_bookings, icon: <BookMarked className="w-6 h-6 text-yellow-600" />, bg: 'bg-yellow-50', link: '/admin/listings' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and management</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <Link to={card.link} key={card.label} className="card hover:shadow-md transition-shadow flex items-center space-x-4">
              <div className={`${card.bg} p-3 rounded-xl`}>{card.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value ?? 0}</p>
                <p className="text-gray-500 text-sm">{card.label}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Manage Users</h2>
              <Link to="/admin/users" className="text-primary-600 text-sm font-medium flex items-center space-x-1 hover:underline">
                <span>View all</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-gray-500 text-sm">Activate or suspend tenant and landlord accounts.</p>
            <Link to="/admin/users" className="mt-4 block btn-primary text-center">
              Go to Users
            </Link>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Manage Listings</h2>
              <Link to="/admin/listings" className="text-primary-600 text-sm font-medium flex items-center space-x-1 hover:underline">
                <span>View all</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-gray-500 text-sm">Approve, suspend or review all property listings.</p>
            <Link to="/admin/listings" className="mt-4 block btn-primary text-center">
              Go to Listings
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}

export default AdminDashboard