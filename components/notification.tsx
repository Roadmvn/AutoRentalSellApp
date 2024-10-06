'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Notification() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
    const channel = supabase
      .channel('realtime notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, handleNewNotification)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) console.error('Error fetching notifications:', error)
    else setNotifications(data)
  }

  const handleNewNotification = (payload) => {
    setNotifications(current => [payload.new, ...current.slice(0, 4)])
  }

  return (
    <div className="fixed bottom-4 right-4 w-64 space-y-2">
      {notifications.map(notification => (
        <div key={notification.id} className="bg-white shadow-lg rounded-lg p-4 transition-all duration-300 ease-in-out hover:shadow-xl">
          <h4 className="font-bold">{notification.title}</h4>
          <p>{notification.message}</p>
          <small className="text-gray-500">{new Date(notification.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  )
}