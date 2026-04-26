import { Link } from 'react-router-dom'
import { Search, Shield, MapPin, Star, ArrowRight, Home as HomeIcon } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  {
    icon: <Search className="w-6 h-6 text-primary-600" />,
    title: 'Smart Search',
    desc: 'Filter by location, price, house type and amenities to find exactly what you need.'
  },
  {
    icon: <MapPin className="w-6 h-6 text-primary-600" />,
    title: 'Map View',
    desc: 'See available houses on an interactive map and explore neighbourhoods easily.'
  },
  {
    icon: <Shield className="w-6 h-6 text-primary-600" />,
    title: 'Verified Listings',
    desc: 'All listings are reviewed and verified before going live on the platform.'
  },
  {
    icon: <Star className="w-6 h-6 text-primary-600" />,
    title: 'Trusted Landlords',
    desc: 'Connect directly with registered landlords and book viewings instantly.'
  },
]

const houseTypes = ['Bedsitter', 'Single Room', '1BR', '2BR', '3BR', '4BR']

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
              <HomeIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-yellow-300">Home in Kenya</span>
          </h1>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            NyumbaHub connects tenants with verified landlords across Kenya. Search by location, price, and house type — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-600 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-primary-600 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* House Types */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Browse by House Type</h2>
          <p className="text-center text-gray-500 mb-10">From bedsitters to spacious family homes</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {houseTypes.map((type) => (
              <Link
                key={type}
                to="/login"
                className="flex flex-col items-center justify-center bg-primary-50 hover:bg-primary-100 border border-primary-100 rounded-xl p-6 transition-colors group"
              >
                <HomeIcon className="w-8 h-8 text-primary-500 mb-2 group-hover:text-primary-700" />
                <span className="font-semibold text-primary-700 text-sm text-center">{type}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why NyumbaHub?</h2>
          <p className="text-center text-gray-500 mb-12">Everything you need to find or list a home</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className="bg-primary-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your next home?</h2>
          <p className="text-primary-100 mb-8 text-lg">Join thousands of Kenyans who use NyumbaHub to find great homes and trusted landlords.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=tenant" className="bg-white text-primary-600 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors">
              I'm Looking for a Home
            </Link>
            <Link to="/register?role=landlord" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-primary-600 transition-colors">
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