import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createProperty } from '../../api/index.js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { ArrowLeft, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const houseTypes = ['bedsitter', 'single_room', '1BR', '2BR', '3BR', '4BR']
const amenityOptions = ['WiFi', 'parking', 'water', 'security', 'electricity', 'gym', 'pool', 'garden']

const AddProperty = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    total_units: '',
    price: '',
    house_type: '1BR',
    amenities: [],
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleAmenity = (amenity) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        total_units: parseInt(form.total_units),
        price: parseFloat(form.price),
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      }
      await createProperty(payload)
      toast.success('Property listed successfully!')
      navigate('/landlord/my-properties')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center space-x-4 mb-8">
          <Link to="/landlord/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
            <p className="text-gray-500 mt-1">Fill in the details to list your property</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="input-field" placeholder="e.g. Sunset Apartments" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={3} className="input-field resize-none"
                placeholder="Describe your property..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House Type *</label>
                <select name="house_type" value={form.house_type} onChange={handleChange} className="input-field">
                  {houseTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Units *</label>
                <input name="total_units" type="number" min="1" value={form.total_units} onChange={handleChange}
                  className="input-field" placeholder="e.g. 10" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit (KES/month) *</label>
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange}
                className="input-field" placeholder="e.g. 25000" required />
            </div>
          </div>

          {/* Location */}
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Location</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address / Location *</label>
              <input name="location" value={form.location} onChange={handleChange}
                className="input-field" placeholder="e.g. Westlands, Nairobi" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude (optional)</label>
                <input name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange}
                  className="input-field" placeholder="e.g. -1.2641" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude (optional)</label>
                <input name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange}
                  className="input-field" placeholder="e.g. 36.8036" />
              </div>
            </div>
            <p className="text-xs text-gray-400">You can find coordinates by right-clicking on Google Maps</p>
          </div>

          {/* Amenities */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {amenityOptions.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    form.amenities.includes(amenity)
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-primary-300'
                  }`}
                >
                  {form.amenities.includes(amenity) ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  <span className="capitalize">{amenity}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Images</h2>
            <p className="text-sm text-gray-500">You can upload images after creating the property from the Edit page.</p>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full btn-primary py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Creating listing...' : 'Create Property Listing'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  )
}

export default AddProperty