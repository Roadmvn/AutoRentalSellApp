'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Reviews({ vehicleId }) {
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    fetchReviews()
  }, [vehicleId])

  async function fetchReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(username)')
      .eq('vehicle_id', vehicleId)

    if (error) console.error('Error fetching reviews:', error)
    else setReviews(data)
  }

  async function submitReview() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Vous devez être connecté pour laisser un avis')
      return
    }

    const { error } = await supabase
      .from('reviews')
      .insert({ vehicle_id: vehicleId, user_id: user.id, rating: newReview.rating, comment: newReview.comment })

    if (error) console.error('Error submitting review:', error)
    else {
      fetchReviews()
      setNewReview({ rating: 5, comment: '' })
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Avis</h3>
      {reviews.map(review => (
        <div key={review.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold">{review.profiles.username}</p>
          <p>Note : {review.rating}/5</p>
          <p>{review.comment}</p>
        </div>
      ))}
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">Laisser un avis</h4>
        <select
          value={newReview.rating}
          onChange={(e) => setNewReview(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
          className="mb-2 p-2 border rounded"
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num} étoile{num > 1 ? 's' : ''}</option>
          ))}
        </select>
        <textarea
          value={newReview.comment}
          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
          className="w-full p-2 border rounded"
          placeholder="Votre commentaire..."
        ></textarea>
        <button onClick={submitReview} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Soumettre</button>
      </div>
    </div>
  )
}