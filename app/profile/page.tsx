'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useTranslation } from 'next-i18next'
import { useAuth } from '@/hooks/useAuth'
import { Button, Input } from '@/components/ui'

export default function ProfilePage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const { t } = useTranslation('common')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('username, email')
      .eq('id', user?.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else if (data) {
      setUsername(data.username || '')
      setEmail(data.email || '')
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('profiles')
      .update({ username, email })
      .eq('id', user?.id)

    if (error) {
      console.error('Error updating profile:', error)
    } else {
      // Optionally, show a success message
    }
  }

  if (isLoading) {
    return <div>{t('loading')}</div>
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">{t('profile')}</h1>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              {t('username')}
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('email')}
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {t('save_changes')}
          </Button>
        </form>
      </div>
    </>
  )
}