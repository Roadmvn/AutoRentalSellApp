import React, { useCallback } from 'react';
// ... autres imports

const VehicleCard = React.memo(function VehicleCard({ id, title, description, price, type }: VehicleCardProps) {
  // ... état existant

  const toggleFavorite = useCallback(async () => {
    // ... logique existante
  }, [id, user, isFavorite]);

  // ... reste du composant
});

export default VehicleCard;