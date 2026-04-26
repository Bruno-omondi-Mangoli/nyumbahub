import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'

// Public pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// Tenant pages
import TenantDashboard from './pages/tenant/Dashboard'
import TenantSearch from './pages/tenant/Search'
import HouseDetail from './pages/tenant/HouseDetail'
import Bookmarks from './pages/tenant/Bookmarks'

// Landlord pages
import LandlordDashboard from './pages/landlord/Dashboard'
import AddProperty from './pages/landlord/AddProperty'
import MyProperties from './pages/landlord/MyProperties'
import EditProperty from './pages/landlord/EditProperty'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminListings from './pages/admin/Listings'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Tenant */}
        <Route path="/tenant/dashboard" element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <TenantDashboard />
          </ProtectedRoute>
        } />
        <Route path="/tenant/search" element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <TenantSearch />
          </ProtectedRoute>
        } />
        <Route path="/tenant/houses/:id" element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <HouseDetail />
          </ProtectedRoute>
        } />
        <Route path="/tenant/bookmarks" element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <Bookmarks />
          </ProtectedRoute>
        } />

        {/* Landlord */}
        <Route path="/landlord/dashboard" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <LandlordDashboard />
          </ProtectedRoute>
        } />
        <Route path="/landlord/add-property" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <AddProperty />
          </ProtectedRoute>
        } />
        <Route path="/landlord/my-properties" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <MyProperties />
          </ProtectedRoute>
        } />
        <Route path="/landlord/edit-property/:id" element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <EditProperty />
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/listings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminListings />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App