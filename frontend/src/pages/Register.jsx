import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser, loginUser } from '../api/index.js'
import { Home, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') || 'tenant'

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    national_id: '',
    password: '',
    role: defaultRole,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await registerUser(form)
      // Auto login after register
      const loginRes = await loginUser({ email: form.email, password: form.password })
      const { access_token, user } = loginRes.data
      login(access_token, user)
      toast.success(`Welcome to NyumbaHub, ${user.full_name.split(' ')[0]}!`)

      if (user.role === 'landlord') navigate('/landlord/dashboard')
      else navigate('/tenant/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="bg-primary-600 p-3 rounded-xl">
              <Home className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary-600">NyumbaHub</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-500">Join NyumbaHub today</p>
        </div>

        <div className="card">

          {/* Role Toggle */}
          <div className="flex rounded-lg border border-gray-200 p-1 mb-6">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'tenant' })}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                form.role === 'tenant'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              I'm a Tenant
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'landlord' })}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                form.role === 'landlord'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              I'm a Landlord
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="0700000000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
              <input
                type="text"
                name="national_id"
                value={form.national_id}
                onChange={handleChange}
                className="input-field"
                placeholder="12345678"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register