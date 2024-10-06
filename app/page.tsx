'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

if (!i18next.isInitialized) {
  i18next
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'fr',
      debug: true,
      interpolation: {
        escapeValue: false,
      },
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    })
}

export default function Home() {
  const { t } = useTranslation('common');
  const { user } = useAuth();

  useEffect(() => {
    i18next.reloadResources()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {user ? (
          <div>
            <h1 className="text-4xl font-bold mb-8">{t('welcome_back', { name: user.email })}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/mes-annonces" className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200">
                {t('my_ads')}
              </Link>
              <Link href="/publier-annonce" className="p-4 bg-green-100 rounded-lg hover:bg-green-200">
                {t('post_new_ad')}
              </Link>
              <Link href="/messages" className="p-4 bg-yellow-100 rounded-lg hover:bg-yellow-200">
                {t('my_messages')}
              </Link>
              <Link href="/favoris" className="p-4 bg-red-100 rounded-lg hover:bg-red-200">
                {t('my_favorites')}
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold mb-8">{t('welcome')}</h1>
            <p className="text-xl mb-8">
              {t('find_vehicle')}
            </p>
            <div className="flex space-x-4">
              <Link
                href="/vehicules"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('browse_catalog')}
              </Link>
              <Link
                href="/register"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('create_account')}
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; 2024 La Réserve. Tous droits réservés.</p>
      </footer>
    </div>
  );
}