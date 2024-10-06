import React from 'react';
import { Ad } from '@/types';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'next-i18next';

interface AdCardProps {
  ad: Ad;
  onAction?: (id: string) => void;
  actionLabel?: string;
}

const AdCard: React.FC<AdCardProps> = ({ ad, onAction, actionLabel }) => {
  const { t } = useTranslation('common');

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{ad.title}</h3>
      <p className="text-gray-600">{ad.description.substring(0, 100)}...</p>
      <p className="text-lg font-bold mt-2">{ad.price} €</p>
      {onAction && actionLabel && (
        <Button 
          onClick={() => onAction(ad.id)} 
          className="mt-4"
          variant="outline"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default AdCard;