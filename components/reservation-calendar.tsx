'use client'

import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { supabase } from '@/lib/supabase'

const localizer = momentLocalizer(moment)

export default function ReservationCalendar({ vehicleId }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetchReservations()
  }, [vehicleId])

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('vehicle_id', vehicleId)

    if (error) console.error('Error fetching reservations:', error)
    else {
      const formattedEvents = data.map(reservation => ({
        start: new Date(reservation.start_time),
        end: new Date(reservation.end_time),
        title: 'Réservé',
      }))
      setEvents(formattedEvents)
    }
  }

  const handleSelect = async ({ start, end }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Vous devez être connecté pour faire une réservation')
      return
    }

    const overlappingEvent = events.find(event => 
      (start >= event.start && start < event.end) || 
      (end > event.start && end <= event.end) ||
      (start <= event.start && end >= event.end)
    )

    if (overlappingEvent) {
      alert('Cette période est déjà réservée')
      return
    }

    const title = window.prompt('Entrez votre nom pour la réservation:')
    if (title) {
      const newEvent = { start, end, title }
      const { error } = await supabase
        .from('reservations')
        .insert({ 
          vehicle_id: vehicleId, 
          user_id: user.id, 
          start_time: start.toISOString(), 
          end_time: end.toISOString(),
          title
        })

      if (error) {
        console.error('Error making reservation:', error)
        alert('Erreur lors de la réservation')
      } else {
        setEvents([...events, newEvent])
        alert('Réservation effectuée avec succès')
      }
    }
  }

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        selectable
        onSelectSlot={handleSelect}
      />
    </div>
  )
}