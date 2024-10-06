'use client'

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Ad } from '@/types';
import AdCard from '@/components/AdCard';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'next-i18next';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Ad[]>([]);
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    const { data, error } = await supabase
      .from('favorites')
      .select('ad_id')
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error fetching favorites:', error);
      return;
    }

    const adIds = data.map(fav => fav.ad_id);

    const { data: adsData, error: adsError } = await supabase
      .from('ads')
      .select('*')
      .in('id', adIds);

    if (adsError) {
      console.error('Error fetching ads:', adsError);
      return;
    }

    setFavorites(adsData);
  };

  const handleRemoveFavorite = async (adId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ user_id: user?.id, ad_id: adId });

    if (error) {
      console.error('Error removing favorite:', error);
      return;
    }

    setFavorites(favorites.filter(ad => ad.id !== adId));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{t('favorites')}</h1>
        {favorites.length === 0 ? (
          <p className="text-center text-gray-500">{t('no_favorites')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((ad) => (
              <AdCard 
                key={ad.id} 
                ad={ad} 
                onRemoveFavorite={handleRemoveFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}