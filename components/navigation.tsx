'use client'

import { useTranslation } from 'react-i18next'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Menu, X, User, Car, Bike, Heart, MessageSquare, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Initialisation de i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        common: require('../public/locales/fr/common.json')
      }
    },
    lng: "fr",
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false
    }
  });

export default function Navigation() {
  const { t } = useTranslation('common')
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    // Rediriger vers la page d'accueil ou de connexion après la déconnexion
  }

  const NavLink = ({ href, children, className }) => (
    <Link 
      href={href} 
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
        "text-gray-700 hover:text-primary-600 hover:bg-primary-50",
        className
      )}
    >
      {children}
    </Link>
  )

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img className="h-10 w-auto" src="/images/logo.webp" alt="La Réserve" />
              <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                La Réserve
              </span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink href="/vehicles">
              <Car className="h-5 w-5 mr-1" />
              {t('vehicles')}
            </NavLink>
            {user ? (
              <>
                <NavLink href="/my-ads">
                  <Bike className="h-5 w-5 mr-1" />
                  {t('my_ads')}
                </NavLink>
                <NavLink href="/favorites">
                  <Heart className="h-5 w-5 mr-1" />
                  {t('favorites')}
                </NavLink>
                <NavLink href="/messages">
                  <MessageSquare className="h-5 w-5 mr-1" />
                  {t('messages')}
                </NavLink>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center">
                      <User className="h-5 w-5 mr-1" />
                      {t('profile')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {t('profile')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleSignOut} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('sign_out')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link href="/login">
                  {t('sign_in')}
                </Link>
              </Button>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink href="/vehicles" className="block">
              <Car className="h-5 w-5 mr-1" />
              {t('vehicles')}
            </NavLink>
            {user ? (
              <>
                <NavLink href="/my-ads" className="block">
                  <Bike className="h-5 w-5 mr-1" />
                  {t('my_ads')}
                </NavLink>
                <NavLink href="/favorites" className="block">
                  <Heart className="h-5 w-5 mr-1" />
                  {t('favorites')}
                </NavLink>
                <NavLink href="/messages" className="block">
                  <MessageSquare className="h-5 w-5 mr-1" />
                  {t('messages')}
                </NavLink>
                <NavLink href="/profile" className="block">
                  <User className="h-5 w-5 mr-1" />
                  {t('profile')}
                </NavLink>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  {t('sign_out')}
                </button>
              </>
            ) : (
              <NavLink href="/login" className="block">
                {t('sign_in')}
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}