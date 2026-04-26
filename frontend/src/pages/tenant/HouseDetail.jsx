import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProperty, createBooking } from '../../api/index.js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Spinner from '../../components/Spinner'
import { MapPin, Phone, Wifi, Car, Shield, Droplets, BedDouble, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const amenityIcons = {
  WiFi: <Wifi className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  security: <Shield className="w-4 h-4" />,
  water: <Droplets className="w-4 h-4" />,
}

const HouseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [message, setMessage] = useState('')
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getProperty(id)
        setProperty(res.data)
      } catch {
        toast.error('Property not found')
        navigate('/tenant/search')
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id])

  const handleBooking = async () => {
    setBooking(true)
    try {
      await createBooking({ property_id: parseInt(id), message })
      toast.success('Booking request sent successfully!')
      navigate('/tenant/bookmarks')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <Spinner fullScreen />
  if (!property) return null

  const images = property.images || []

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Property Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            <div className="card p-0 overflow-hidden">
              <div className="h-72 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]?.image_url}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BedDouble className="w-24 h-24 text-primary-300" />
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-primary-500' : 'border-transparent'}`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
                  <div className="flex items-center space-x-1 text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <span className={property.vacant_units > 0 ? 'badge-vacant' : 'badge-occupied'}>
                  {property.vacant_units > 0 ? `${property.vacant_units} Vacant` : 'Fully Occupied'}
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  KES {property.price?.toLocaleString()}
                </span>
                <span className="text-gray-400">/month</span>
                <span className="badge-active">{property.house_type}</span>
              </div>

              {property.description && (
                <p className="text-gray-600 mb-6">{property.description}</p>
              )}

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-primary-600">
                          {amenityIcons[amenity] || <CheckCircle className="w-4 h-4" />}
                        </span>
                        <span className="text-sm text-gray-700 capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right — Booking Panel */}
          <div className="space-y-4">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Book This Property</h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price</span>
                  <span className="font-semibold">KES {property.price?.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Units</span>
                  <span className="font-semibold">{property.total_units}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Vacant</span>
                  <span className={`font-semibold ${property.vacant_units > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {property.vacant_units}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message to Landlord (optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself or ask a question..."
                  className="input-field resize-none"
                />
              </div>

              <button
                onClick={handleBooking}
                disabled={booking || property.vacant_units === 0}
                className="w-full btn-primary py-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {booking ? 'Sending...' : property.vacant_units === 0 ? 'No Vacant Units' : 'Send Booking Request'}
              </button>

              {/* Contact */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Or contact landlord directly:</p>
                <a href="tel:+254700000000" className="flex items-center space-x-2 text-primary-600 font-medium hover:underline">
                  <Phone className="w-4 h-4" />
                  <span>Call Landlord</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default HouseDetail