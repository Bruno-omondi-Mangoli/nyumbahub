import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, Menu, X, LogOut, User, Search, BookMarked, LayoutDashboard } from 'lucide-react'

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin, isLandlord, isTenant } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard'
    if (isLandlord) return '/landlord/dashboard'
    return '/tenant/dashboard'
  }

  return (
    <nav className="bg-dark-800 border-b border-dark-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">NyumbaHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link to="/" className="text-gray-300 hover:text-primary-400 font-medium transition-colors">
                  Home
                </Link>
                <Link to="/login" className="btn-secondary">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            ) : (
              <>
                {isTenant && (
                  <>
                    <Link to="/tenant/search" className="flex items-center space-x-1 text-gray-300 hover:text-primary-400 font-medium">
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </Link>
                    <Link to="/tenant/bookmarks" className="flex items-center space-x-1 text-gray-300 hover:text-primary-400 font-medium">
                      <BookMarked className="w-4 h-4" />
                      <span>Saved</span>
                    </Link>
                  </>
                )}
                {isLandlord && (
                  <Link to="/landlord/my-properties" className="flex items-center space-x-1 text-gray-300 hover:text-primary-400 font-medium">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Properties</span>
                  </Link>
                )}
                <Link to={getDashboardLink()} className="flex items-center space-x-1 text-gray-300 hover:text-primary-400 font-medium">
                  <User className="w-4 h-4" />
                  <span>{user?.full_name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center space-x-1 text-red-400 hover:text-red-300 font-medium transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-dark-600 space-y-3">
            {!isAuthenticated ? (
              <>
                <Link to="/" className="block text-gray-300 font-medium py-2" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/login" className="block btn-secondary text-center" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block btn-primary text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className="block text-gray-300 font-medium py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                {isTenant && (
                  <>
                    <Link to="/tenant/search" className="block text-gray-300 font-medium py-2" onClick={() => setMenuOpen(false)}>Search Houses</Link>
                    <Link to="/tenant/bookmarks" className="block text-gray-300 font-medium py-2" onClick={() => setMenuOpen(false)}>Saved Houses</Link>
                  </>
                )}
                {isLandlord && (
                  <Link to="/landlord/my-properties" className="block text-gray-300 font-medium py-2" onClick={() => setMenuOpen(false)}>My Properties</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left text-red-400 font-medium py-2">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar