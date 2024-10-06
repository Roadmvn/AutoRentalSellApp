'use client'

import { useState, useEffect, useCallback } from 'react'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import VehicleCard from "@/components/vehicle-card";
import { supabase } from '@/lib/supabase'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useTranslation } from 'next-i18next'
import ErrorDisplay from '@/components/error-display';
import { useDebounce } from 'use-debounce';

// Supprimez l'import de Navigation s'il existe
// import Navigation from '@/components/navigation'

const ITEMS_PER_PAGE = 9

/**
 * VehiclesPage component
 * Displays a list of vehicles with search and filter functionality
 */
export default function VehiclesPage() {
  const { t } = useTranslation('common')
  const { error, handleError } = useErrorHandler()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const [typeFilter, setTypeFilter] = useState('all')
  const [priceSort, setPriceSort] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [yearFilter, setYearFilter] = useState('')
  const [mileageFilter, setMileageFilter] = useState('')

  /**
   * Fetches vehicles from the database based on current filters and search term
   * @async
   */
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('vehicles')
        .select('*', { count: 'exact' });

      if (debouncedSearchTerm) {
        query = query.or(`title.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%`);
      }

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      if (yearFilter) {
        query = query.eq('year', yearFilter);
      }

      if (mileageFilter) {
        query = query.lte('mileage', mileageFilter);
      }

      const { count } = await query.count();

      query = query
        .order('price', { ascending: priceSort === 'asc' })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      const { data, error } = await query;

      if (error) throw error;

      setVehicles(data);
      setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, typeFilter, priceSort, yearFilter, mileageFilter, currentPage]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  /**
   * Renders a single vehicle item for the virtualized list
   * @param {Object} props - The props object
   * @param {number} props.index - The index of the vehicle in the list
   * @param {Object} props.style - The style object for the list item
   */
  const Row = ({ index, style }) => {
    const vehicle = vehicles[index];
    return (
      <div style={style}>
        <VehicleCard {...vehicle} />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('vehicle_catalog')}</h1>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder={t('search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">{t('all_types')}</option>
          <option value="car">{t('cars')}</option>
          <option value="motorcycle">{t('motorcycles')}</option>
        </select>
        <select
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix décroissant</option>
        </select>
        <input
          type="number"
          placeholder="Année"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Kilométrage max"
          value={mileageFilter}
          onChange={(e) => setMileageFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      {!loading && (
        <div style={{ height: '600px' }}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={vehicles.length}
                itemSize={300}
                width={width}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </div>
      )}
      <div className="mt-6 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}