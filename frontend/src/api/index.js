import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors globally — log out user if token expired
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ─────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

// ─── Properties ───────────────────────────────────────────────────────────
export const getProperties = (params) => API.get('/properties/', { params })
export const getProperty = (id) => API.get(`/properties/${id}`)
export const createProperty = (data) => API.post('/properties/', data)
export const updateProperty = (id, data) => API.put(`/properties/${id}`, data)
export const deleteProperty = (id) => API.delete(`/properties/${id}`)
export const getMyProperties = () => API.get('/properties/landlord/my-properties')

// ─── Bookings ─────────────────────────────────────────────────────────────
export const createBooking = (data) => API.post('/bookings/', data)
export const getMyBookings = () => API.get('/bookings/my-bookings')
export const cancelBooking = (id) => API.delete(`/bookings/${id}`)
export const getPropertyBookings = (id) => API.get(`/bookings/property/${id}`)
export const updateBookingStatus = (id, data) => API.put(`/bookings/${id}`, data)

// ─── Admin ────────────────────────────────────────────────────────────────
export const getAdminDashboard = () => API.get('/admin/dashboard')
export const getAllUsers = () => API.get('/admin/users')
export const toggleUserActive = (id) => API.put(`/admin/users/${id}/toggle-active`)
export const getAllPropertiesAdmin = () => API.get('/admin/properties')
export const updatePropertyStatus = (id, data) => API.put(`/admin/properties/${id}/status`, data)

export default API