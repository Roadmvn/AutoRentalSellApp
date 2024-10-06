'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const { t } = useTranslation('common')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  async function fetchConversations() {
    const { data, error } = await supabase
      .from('conversations')
      .select('*, profiles!profiles_id_fkey(username, avatar_url)')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('updated_at', { ascending: false })

    if (error) console.error('Error fetching conversations:', error)
    else setConversations(data)
  }

  async function fetchMessages(conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) console.error('Error fetching messages:', error)
    else setMessages(data)
  }

  async function sendMessage() {
    if (!newMessage.trim()) return

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedConversation,
        sender_id: user.id,
        content: newMessage.trim()
      })

    if (error) console.error('Error sending message:', error)
    else {
      setMessages([...messages, data[0]])
      setNewMessage('')
      // Update conversation's updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date() })
        .eq('id', selectedConversation)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('messages')}</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex h-[600px]">
            <div className="w-1/3 border-r overflow-y-auto">
              <h2 className="text-xl font-semibold p-4 border-b bg-gray-50">{t('conversations')}</h2>
              <ul className="divide-y">
                {conversations.map(conv => (
                  <li 
                    key={conv.id} 
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversation === conv.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="flex items-center">
                      <Image 
                        src={conv.profiles.avatar_url || '/default-avatar.png'} 
                        alt={conv.profiles.username} 
                        width={40} 
                        height={40} 
                        className="rounded-full mr-3"
                      />
                      <div>
                        <div className="font-semibold">{conv.profiles.username}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {conv.last_message || t('no_messages')}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-2/3 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="flex-grow overflow-y-auto p-4">
                    {messages.map(message => (
                      <div key={message.id} className={`mb-4 ${message.sender_id === user.id ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded-lg ${message.sender_id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                          {message.content}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(message.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-4">
                    <div className="flex">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('type_message')}
                        className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
                      >
                        {t('send')}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center">
                  <p className="text-center text-gray-500">{t('select_conversation')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}