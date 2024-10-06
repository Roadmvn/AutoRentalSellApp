'use client'

import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { supabase } from '@/lib/supabase';
import VehicleCard from '@/components/vehicle-card';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import AdManagementCard from '@/components/AdManagementCard';

export default function MyAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation('common');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserAds();
    }
  }, [user]);

  async function fetchUserAds() {
    setIsLoading(true);
    if (!user) {
      console.error('Utilisateur non connecté');
      alert(t('user_not_logged_in'));
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('vehicles')  // Changez 'ads' en 'vehicles' ici
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setAds(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces:', error);
      alert(t('error_fetching_ads') + ': ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteAd(id) {
    const confirmation = window.confirm(t('confirm_delete_ad'));
    if (confirmation) {
      const { error } = await supabase
        .from('vehicles')  // Changez 'ads' en 'vehicles' ici aussi
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting ad:', error);
        alert(t('error_deleting_ad'));
      } else {
        setAds(ads.filter(ad => ad.id !== id));
        alert(t('ad_deleted_successfully'));
      }
    }
  }

  const handleToggleAdVisibility = async (adId: string, isVisible: boolean) => {
    const { error } = await supabase
      .from('vehicles')  // Changez 'ads' en 'vehicles' ici aussi
      .update({ is_visible: isVisible })
      .eq('id', adId);

    if (error) {
      console.error('Erreur lors de la mise à jour de la visibilité:', error);
      alert(t('error_updating_visibility'));
    } else {
      setAds(ads.map(ad => ad.id === adId ? { ...ad, is_visible: isVisible } : ad));
      alert(t('visibility_updated_successfully'));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('my_ads')}</h1>
        <Link href="/publier-annonce">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {t('post_new_ad')}
          </button>
        </Link>
      </div>
      {isLoading ? (
        <p className="text-center">{t('loading')}</p>
      ) : ads.length === 0 ? (
        <p className="text-center text-gray-500">{t('no_ads_published')}</p>
      ) : (
        <div className="space-y-6">
          {ads.map((ad) => (
            <AdManagementCard 
              key={ad.id} 
              ad={ad} 
              onDelete={() => handleDeleteAd(ad.id)}
              onToggleVisibility={(isVisible: boolean) => handleToggleAdVisibility(ad.id, isVisible)}
            />
          ))}
        </div>
      )}
    </div>
  );
}