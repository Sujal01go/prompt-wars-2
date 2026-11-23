import React, { useState } from 'react'
import { Navigation, Flame, Search } from 'lucide-react'
import { Modal } from '../common/Modal.tsx'
import { useAero } from '../../hooks/useAero.ts'
import { PRESET_CITIES } from '../../services/airQualityApi.ts'
import type { CityLocation } from '../../types/index.ts'

export const CitySelectorModal: React.FC = () => {
  const { isCityModalOpen, setIsCityModalOpen, city, setCity, addToast } = useAero()
  const [searchQuery, setSearchQuery] = useState('')
  const [locating, setLocating] = useState(false)

  const filteredCities = PRESET_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.stateOrRegion.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (c: CityLocation) => {
    setCity(c)
    setIsCityModalOpen(false)
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      addToast({
        type: 'warning',
        title: 'Geolocation Unsupported',
        message: 'Your browser does not support automatic location detection.',
      })
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false)
        const userCity: CityLocation = {
          id: 'user-local',
          name: 'My Detected Location',
          stateOrRegion: 'Local Station',
          country: 'Local',
          lat: Number(position.coords.latitude.toFixed(4)),
          lon: Number(position.coords.longitude.toFixed(4)),
          notes: 'Coordinates derived from browser GPS',
        }
        setCity(userCity)
        setIsCityModalOpen(false)
      },
      (err) => {
        setLocating(false)
        console.warn('Geolocation failed:', err)
        addToast({
          type: 'warning',
          title: 'Location Notice',
          message: 'Unable to access GPS coordinates. Select a station from the list.',
        })
      },
      { timeout: 8000 }
    )
  }

  return (
    <Modal
      isOpen={isCityModalOpen}
      onClose={() => setIsCityModalOpen(false)}
      title="Select Air Quality Monitoring Station"
      subtitle="Track live particulate telemetry across global winter smog epicenters"
      maxWidth="max-w-xl"
    >
      <div className="city-selector-content">
        {/* Geolocation Button */}
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={locating}
          className="btn-detect-location"
        >
          <Navigation size={18} className={locating ? 'animate-spin' : ''} />
          <span>{locating ? 'Detecting GPS Coordinates...' : 'Use My Current Location (GPS)'}</span>
        </button>

        {/* Search Input */}
        <div className="search-box-row mt-4">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search city or country (e.g. Delhi, Beijing, London)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Cities List */}
        <div className="cities-scroll-list mt-3">
          {filteredCities.map((c) => {
            const isCurrent = city.id === c.id
            return (
              <div
                key={c.id}
                onClick={() => handleSelect(c)}
                className={`city-list-item ${isCurrent ? 'city-active' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelect(c)
                  }
                }}
              >
                <div className="city-main-info">
                  <div className="flex items-center gap-2">
                    <span className="city-name-text">{c.name}</span>
                    <span className="city-country-text">({c.country})</span>
                    {c.isSmogHotspot && (
                      <span className="hotspot-chip">
                        <Flame size={12} /> Smog Hotspot
                      </span>
                    )}
                  </div>
                  {c.notes && <p className="city-notes-text">{c.notes}</p>}
                </div>

                <div className="city-coords">
                  <span>{c.lat.toFixed(2)}°N, {c.lon.toFixed(2)}°E</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
