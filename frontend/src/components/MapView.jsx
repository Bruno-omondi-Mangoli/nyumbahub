import { useState, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner'

const containerStyle = {
  width: '100%',
  height: '100%'
}

const defaultCenter = {
  lat: -1.2921,
  lng: 36.8219
}

const MapView = ({ properties = [] }) => {
  const navigate = useNavigate()
  const [selectedProperty, setSelectedProperty] = useState(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  })

  const onMarkerClick = useCallback((property) => {
    setSelectedProperty(property)
  }, [])

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl">
        <p className="text-gray-400">Failed to load map</p>
      </div>
    )
  }

  if (!isLoaded) return <Spinner />

  const mappableProperties = properties.filter(p => p.latitude && p.longitude)

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mappableProperties.length > 0
        ? { lat: mappableProperties[0].latitude, lng: mappableProperties[0].longitude }
        : defaultCenter
      }
      zoom={13}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {mappableProperties.map((property) => (
        <Marker
          key={property.id}
          position={{ lat: property.latitude, lng: property.longitude }}
          onClick={() => onMarkerClick(property)}
          title={property.name}
        />
      ))}

      {selectedProperty && (
        <InfoWindow
          position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
          onCloseClick={() => setSelectedProperty(null)}
        >
          <div className="p-2 max-w-48">
            <h3 className="font-semibold text-gray-900 text-sm">{selectedProperty.name}</h3>
            <p className="text-gray-500 text-xs mt-1">{selectedProperty.location}</p>
            <p className="text-primary-600 font-bold text-sm mt-1">
              KES {selectedProperty.price?.toLocaleString()}/mo
            </p>
            <p className="text-xs mt-1">
              <span className={selectedProperty.vacant_units > 0 ? 'text-green-600' : 'text-red-500'}>
                {selectedProperty.vacant_units > 0 ? `${selectedProperty.vacant_units} vacant` : 'Fully occupied'}
              </span>
            </p>
            <button
              onClick={() => navigate(`/tenant/houses/${selectedProperty.id}`)}
              className="mt-2 w-full text-xs bg-primary-600 text-white py-1 px-2 rounded hover:bg-primary-700 transition-colors"
            >
              View Details
            </button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

export default MapView