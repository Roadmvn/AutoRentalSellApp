'use client'

import { useState } from 'react'

interface PaymentSimulatorProps {
  amount: number
  onPaymentComplete: () => void
}

export default function PaymentSimulator({ amount, onPaymentComplete }: PaymentSimulatorProps) {
  const [loading, setLoading] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulons une vérification de carte
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    onPaymentComplete()
  }

  return (
    <div className="border rounded-lg p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">Simulateur de paiement</h3>
      <p className="mb-4">Montant à payer : {amount} €</p>
      <form onSubmit={handlePayment}>
        <input
          type="text"
          placeholder="Numéro de carte"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <div className="flex mb-2">
          <input
            type="text"
            placeholder="MM/AA"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-1/2 p-2 mr-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="w-1/2 p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Traitement...' : 'Payer maintenant'}
        </button>
      </form>
    </div>
  )
}