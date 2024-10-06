'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { supabase } from '@/lib/supabase'
import VehicleCard from '@/components/vehicle-card'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function MesAnnonces() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation('common')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchUserAds()
    }
  }, [user])

  async function fetchUserAds() {
    setLoading(true)
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching user ads:', error)
    } else {
      setAds(data)
    }
    setLoading(false)
  }

  async function deleteAd(id) {
    const confirmation = window.confirm(t('confirm_delete_ad'))
    if (confirmation) {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting ad:', error)
        alert(t('error_deleting_ad'))
      } else {
        setAds(ads.filter(ad => ad.id !== id))
        alert(t('ad_deleted_successfully'))
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('my_ads')}</h1>
        <Link href="/publier-annonce" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          {t('post_new_ad')}
        </Link>
      </div>
      {ads.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">{t('no_ads')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="relative">
              <VehicleCard {...ad} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button 
                  onClick={() => deleteAd(ad.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  aria-label={t('delete_ad')}
                >
                  🗑️
                </button>
                <Link 
                  href={`/edit-annonce/${ad.id}`}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  aria-label={t('edit_ad')}
                >
                  ✏️
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}