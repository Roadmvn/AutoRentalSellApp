'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        vehicles (title),
        buyer:profiles!buyer_id (username),
        seller:profiles!seller_id (username)
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching transactions:', error)
    else setTransactions(data)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Historique des transactions</h1>
      <div className="space-y-4">
        {transactions.map(transaction => (
          <div key={transaction.id} className="bg-white shadow rounded-lg p-4">
            <p className="font-semibold">{transaction.vehicles.title}</p>
            <p>Vendeur: {transaction.seller.username}</p>
            <p>Acheteur: {transaction.buyer.username}</p>
            <p>Montant: {transaction.amount} €</p>
            <p>Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}