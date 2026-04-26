import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyBookings, cancelBooking } from '../../api/index.js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Spinner from '../../components/Spinner'
import { BookMarked, MapPin, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const statusConfig = {
  pending: { label: 'Pending', icon: <Clock className="w-4 h-4" />, className: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', icon: <CheckCircle className="w-4 h-4" />, className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', icon: <XCircle className="w-4 h-4" />, className: 'bg-red-100 text-red-700' },
}

const Bookmarks = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings()
      setBookings(res.data.results)
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await cancelBooking(id)
      toast.success('Booking cancelled')
      setBookings(bookings.filter(b => b.id !== id))
    } catch {
      toast.error('Failed to cancel booking')
    }
  }

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="card text-center py-16">
            <BookMarked className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">No bookings yet</h3>
            <p className="text-gray-400 mt-2 mb-6">Start searching for your perfect home</p>
            <Link to="/tenant/search" className="btn-primary">Search Houses</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = statusConfig[booking.status]
              return (
                <div key={booking.id} className="card flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-50 p-3 rounded-xl">
                      <BookMarked className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Property #{booking.property_id}</p>
                      {booking.message && (
                        <p className="text-gray-500 text-sm mt-1">"{booking.message}"</p>
                      )}
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`flex items-center space-x-1 text-xs font-medium px-3 py-1 rounded-full ${status.className}`}>
                      {status.icon}
                      <span>{status.label}</span>
                    </span>
                    <Link to={`/tenant/houses/${booking.property_id}`} className="btn-secondary text-sm py-1">
                      View
                    </Link>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Bookmarks