'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Image from "next/image";
import Link from "next/link";
import { supabase } from '@/lib/supabase';

interface VehicleCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  type: "car" | "motorcycle";
}

const VehicleCard = React.memo(function VehicleCard({ id, title, description, price, type }: VehicleCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkFavoriteStatus()
    checkUserStatus()
  }, [])

  async function checkFavoriteStatus() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('vehicle_id', id)
        .single()

      if (data) setIsFavorite(true)
    }
  }

  async function checkUserStatus() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function toggleFavorite() {
    if (!user) {
      alert('Vous devez être connecté pour ajouter des favoris')
      return
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('vehicle_id', id)

      if (!error) setIsFavorite(false)
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, vehicle_id: id })

      if (!error) setIsFavorite(true)
    }
  }

  return (
    <article className="border rounded-lg overflow-hidden shadow-md" aria-labelledby={`vehicle-title-${id}`}>
      <Image src={`/images/${type}.jpg`} alt="" width={300} height={200} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 id={`vehicle-title-${id}`} className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-2">{type === "car" ? "Voiture" : "Moto"}</p>
        <p className="text-sm text-gray-500 mb-2">{description.substring(0, 100)}...</p>
        <p className="text-xl font-bold mb-4" aria-label={`Prix: ${price} euros`}>{price} €</p>
        <div className="flex justify-between items-center">
          <Link
            href={`/vehicules/${id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            aria-label={`Voir les détails de ${title}`}
          >
            Voir les détails
          </Link>
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={isFavorite}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </article>
  );
})

export default VehicleCard