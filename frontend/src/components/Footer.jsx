import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-600 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NyumbaHub</span>
            </div>
            <p className="text-sm text-gray-500">
              Kenya's modern house locator platform. Find your perfect home or list your property with ease.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/register" className="hover:text-primary-400 transition-colors">Register</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Nairobi, Kenya</li>
              <li>mangolibruno@gmail.com</li>
              <li>+254704708970</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-dark-600 mt-8 pt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} NyumbaHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer