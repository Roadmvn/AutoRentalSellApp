'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Messaging({ conversationId }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    fetchMessages()
    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, handleNewMessage)
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [conversationId])

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) console.error('Error fetching messages:', error)
    else setMessages(data)
  }

  function handleNewMessage(payload) {
    setMessages(current => [...current, payload.new])
  }

  async function sendMessage() {
    if (!newMessage.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: user.id, content: newMessage })

    if (error) console.error('Error sending message:', error)
    else setNewMessage('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {messages.map(message => (
          <div key={message.id} className={`p-2 rounded-lg ${message.sender_id === user.id ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Tapez votre message..."
        />
        <button onClick={sendMessage} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">Envoyer</button>
      </div>
    </div>
  )
}