'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PaymentSimulator from '@/components/payment-simulator'

export default function AcheterVehicule({ params }: { params: { id: string } }) {
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchVehicle()
  }, [])

  async function fetchVehicle() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching vehicle:', error)
    } else {
      setVehicle(data)
    }
    setLoading(false)
  }

  const handlePaymentComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Vous devez être connecté pour effectuer un achat')

      const { error } = await supabase
        .from('transactions')
        .insert([
          { 
            vehicle_id: vehicle.id, 
            buyer_id: user.id, 
            seller_id: vehicle.user_id, 
            amount: vehicle.price,
            status: 'completed'
          }
        ])

      if (error) throw error

      alert('Paiement effectué avec succès!')
      router.push('/profile')
    } catch (error) {
      alert(error.message)
    }
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  if (!vehicle) {
    return <div>Véhicule non trouvé</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Acheter {vehicle.title}</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">{vehicle.title}</h2>
        <p className="text-gray-600 mb-2">{vehicle.type === 'car' ? 'Voiture' : 'Moto'}</p>
        <p className="text-gray-700 mb-4">{vehicle.description}</p>
        <p className="text-2xl font-bold mb-6">{vehicle.price} €</p>
        <PaymentSimulator amount={vehicle.price} onPaymentComplete={handlePaymentComplete} />
      </div>
    </div>
  )
}