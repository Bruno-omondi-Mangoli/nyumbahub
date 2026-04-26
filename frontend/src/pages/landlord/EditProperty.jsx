import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProperty, updateProperty } from '../../api/index.js'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Spinner from '../../components/Spinner'
import { ArrowLeft, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const houseTypes = ['bedsitter', 'single_room', '1BR', '2BR', '3BR', '4BR']
const amenityOptions = ['WiFi', 'parking', 'water', 'security', 'electricity', 'gym', 'pool', 'garden']

const EditProperty = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', location: '',
    latitude: '', longitude: '', total_units: '',
    price: '', house_type: '1BR', amenities: [], status: 'active'
  })

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getProperty(id)
        const p = res.data
        setForm({
          name: p.name || '',
          description: p.description || '',
          location: p.location || '',
          latitude: p.latitude || '',
          longitude: p.longitude || '',
          total_units: p.total_units || '',
          price: p.price || '',
          house_type: p.house_type || '1BR',
          amenities: p.amenities || [],
          status: p.status || 'active',
        })
      } catch {
        toast.error('Failed to load property')
        navigate('/landlord/my-properties')
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id])

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
    setSaving(true)
    try {
      const payload = {
        ...form,
        total_units: parseInt(form.total_units),
        price: parseFloat(form.price),
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      }
      await updateProperty(id, payload)
      toast.success('Property updated successfully!')
      navigate('/landlord/my-properties')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update property')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner fullScreen />

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center space-x-4 mb-8">
          <Link to="/landlord/my-properties" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
            <p className="text-gray-500 mt-1">Update your property details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={3} className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House Type *</label>
                <select name="house_type" value={form.house_type} onChange={handleChange} className="input-field">
                  {houseTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="input-field">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Units *</label>
                <input name="total_units" type="number" min="1" value={form.total_units}
                  onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES/month) *</label>
                <input name="price" type="number" min="0" value={form.price}
                  onChange={handleChange} className="input-field" required />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Location</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input name="location" value={form.location} onChange={handleChange} className="input-field" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input name="latitude" type="number" step="any" value={form.latitude}
                  onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input name="longitude" type="number" step="any" value={form.longitude}
                  onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {amenityOptions.map((amenity) => (
                <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    form.amenities.includes(amenity)
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-primary-300'
                  }`}>
                  {form.amenities.includes(amenity) ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  <span className="capitalize">{amenity}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="w-full btn-primary py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  )
}

export default EditProperty