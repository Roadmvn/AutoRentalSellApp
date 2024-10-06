'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { supabase } from '@/lib/supabase'
import VehicleCard from '@/components/vehicle-card'
import { useAuth } from '@/hooks/useAuth'
// Supprimez cette ligne
// import Navigation from '@/components/navigation'

export default function Favoris() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation('common')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  async function fetchFavorites() {
    setLoading(true)
    const { data, error } = await supabase
      .from('favorites')
      .select('vehicles(*)')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching favorites:', error)
    } else {
      setFavorites(data.map(fav => fav.vehicles))
    }
    setLoading(false)
  }

  const removeFavorite = async (vehicleId) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ user_id: user.id, vehicle_id: vehicleId })

    if (error) {
      console.error('Error removing favorite:', error)
    } else {
      setFavorites(favorites.filter(fav => fav.id !== vehicleId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Supprimez cette ligne */}
        {/* <Navigation /> */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">{t('loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Supprimez cette ligne */}
      {/* <Navigation /> */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('my_favorites')}</h1>
        {favorites.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-gray-500">{t('no_favorites')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((vehicle) => (
              <div key={vehicle.id} className="relative bg-white shadow-md rounded-lg overflow-hidden">
                <VehicleCard {...vehicle} />
                <button
                  onClick={() => removeFavorite(vehicle.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  aria-label={t('remove_from_favorites')}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}