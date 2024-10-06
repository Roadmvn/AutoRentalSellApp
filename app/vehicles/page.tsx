'use client'

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useTranslation } from 'next-i18next';
import { Ad } from '@/types';
import AdCard from '@/components/AdCard';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const { t } = useTranslation('common');

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
    } else {
      setVehicles(data || []);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{t('vehicles')}</h1>
        {isLoading ? (
          <p className="text-center">{t('loading')}</p>
        ) : vehicles.length === 0 ? (
          <p className="text-center text-gray-500">{t('no_vehicles')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <AdCard 
                key={vehicle.id} 
                ad={vehicle} 
                onRemoveFavorite={() => {}} // Cette fonction sera vide car ce n'est pas la page des favoris
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}