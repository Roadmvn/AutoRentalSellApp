'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const ReservationCalendar = dynamic(() => import('@/components/reservation-calendar'), {
  loading: () => <p>Chargement du calendrier...</p>,
})

export default function VehiculeDetails({ params }: { params: { id: string } }) {
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchVehicle()
  }, [])

  async function fetchVehicle() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*, profiles(username)')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching vehicle:', error)
      setLoading(false)
      return
    }

    setVehicle(data)
    setLoading(false)
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>
  }

  if (!vehicle) {
    return <div className="container mx-auto px-4 py-8">Véhicule non trouvé</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{vehicle.title}</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <Image 
          src={`/images/${vehicle.type}.jpg`} 
          alt={vehicle.title} 
          width={600} 
          height={400} 
          className="w-full h-64 object-cover mb-6 rounded-lg"
        />
        <p className="text-gray-600 mb-2">{vehicle.type === 'car' ? 'Voiture' : 'Moto'}</p>
        <p className="text-gray-700 mb-4">{vehicle.description}</p>
        <p className="text-2xl font-bold mb-6">{vehicle.price} €</p>
        <p className="text-gray-600 mb-6">Vendeur: {vehicle.profiles.username}</p>
        <div className="flex justify-between">
          <Link
            href={`/vehicules/${vehicle.id}/acheter`}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Acheter
          </Link>
          <button
            onClick={() => router.back()}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
      <ReservationCalendar vehicleId={vehicle.id} />
    </div>
  )
}