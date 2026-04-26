import { Link } from 'react-router-dom'
import { Search, Shield, MapPin, Star, ArrowRight, Home as HomeIcon } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  { icon: <Search className="w-6 h-6 text-primary-400" />, title: 'Smart Search', desc: 'Filter by location, price, house type and amenities to find exactly what you need.' },
  { icon: <MapPin className="w-6 h-6 text-primary-400" />, title: 'Map View', desc: 'See available houses on an interactive map and explore neighbourhoods easily.' },
  { icon: <Shield className="w-6 h-6 text-primary-400" />, title: 'Verified Listings', desc: 'All listings are reviewed and verified before going live on the platform.' },
  { icon: <Star className="w-6 h-6 text-primary-400" />, title: 'Trusted Landlords', desc: 'Connect directly with registered landlords and book viewings instantly.' },
]

const houseTypes = ['Bedsitter', 'Single Room', '1BR', '2BR', '3BR', '4BR']

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-transparent opacity-30" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-500 bg-opacity-20 border border-primary-500 p-4 rounded-2xl">
              <HomeIcon className="w-12 h-12 text-primary-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
            Find Your Perfect
            <span className="block text-primary-400">Home in Kenya</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            NyumbaHub connects tenants with verified landlords across Kenya. Search by location, price, and house type — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-primary-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-400 transition-colors flex items-center justify-center space-x-2">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="border-2 border-primary-500 text-primary-400 font-bold px-8 py-4 rounded-xl hover:bg-primary-500 hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* House Types */}
      <section className="py-16 px-4 bg-dark-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">Browse by House Type</h2>
          <p className="text-center text-gray-400 mb-10">From bedsitters to spacious family homes</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {houseTypes.map((type) => (
              <Link key={type} to="/login"
                className="flex flex-col items-center justify-center bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-primary-500 rounded-xl p-6 transition-all group">
                <HomeIcon className="w-8 h-8 text-primary-500 mb-2 group-hover:text-primary-400" />
                <span className="font-semibold text-gray-300 text-sm text-center group-hover:text-white">{type}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-dark-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">Why NyumbaHub?</h2>
          <p className="text-center text-gray-400 mb-12">Everything you need to find or list a home</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:border-primary-500 transition-all">
                <div className="bg-dark-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-dark-800 to-dark-900 border-t border-dark-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to find your next home?</h2>
          <p className="text-gray-400 mb-8 text-lg">Join thousands of Kenyans who use NyumbaHub to find great homes and trusted landlords.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=tenant" className="bg-primary-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-400 transition-colors">
              I'm Looking for a Home
            </Link>
            <Link to="/register?role=landlord" className="border-2 border-primary-500 text-primary-400 font-bold px-8 py-4 rounded-xl hover:bg-primary-500 hover:text-white transition-colors">
              I'm a Landlord
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home