import { Link } from 'react-router-dom'
import { MapPin, Wifi, Car, Shield, Droplets, BedDouble } from 'lucide-react'

const amenityIcons = {
  WiFi: <Wifi className="w-3 h-3" />,
  parking: <Car className="w-3 h-3" />,
  security: <Shield className="w-3 h-3" />,
  water: <Droplets className="w-3 h-3" />,
}

const HouseCard = ({ property, linkPrefix = '/tenant/houses' }) => {
  const { id, name, location, price, house_type, amenities, vacant_units, total_units, images } = property

  const coverImage = images?.find(img => img.category === 'sitting_room')?.image_url
    || images?.[0]?.image_url
    || null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">

      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
        {coverImage ? (
          <img src={coverImage} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BedDouble className="w-16 h-16 text-primary-300" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={vacant_units > 0 ? 'badge-vacant' : 'badge-occupied'}>
            {vacant_units > 0 ? `${vacant_units} Vacant` : 'Fully Occupied'}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-white text-primary-600 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
            {house_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg truncate">{name}</h3>

        <div className="flex items-center space-x-1 text-gray-500 text-sm mt-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              KES {price?.toLocaleString()}
            </span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
          <span className="text-gray-400 text-sm">{total_units} units</span>
        </div>

        {/* Amenities */}
        {amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {amenities.slice(0, 4).map((amenity) => (
              <span key={amenity} className="flex items-center space-x-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                {amenityIcons[amenity] || null}
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        )}

        <Link
          to={`${linkPrefix}/${id}`}
          className="block mt-4 btn-primary text-center text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default HouseCard