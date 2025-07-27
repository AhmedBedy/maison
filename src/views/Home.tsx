// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import SeriesView from '../components/SeriesView';

type Serie = {
  id: number;
  title: string;
  icon: string;
};

const Home: React.FC = () => {
  const [seriesList, setSeriesList] = useState<Serie[]>([]);
  const [selectedSerieId, setSelectedSerieId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      const { data, error } = await supabase.from('series').select('*');

      if (error) {
        console.error('Error loading series:', error.message);
      } else {
        setSeriesList(data || []);
      }
    };

    fetchSeries();
  }, []);

  const handleSerieClick = (id: number) => {
    setSelectedSerieId(id);
    console.log('Selected series ID:', id);
  };

  return (
    <div>
      {!selectedSerieId ? (
        <SeriesView series={seriesList} onSelect={handleSerieClick} />
      ) : (
        <div>
          <p>Grades for series ID {selectedSerieId} will be shown here.</p>
          <button onClick={() => setSelectedSerieId(null)}>
            🔙 Back to Series
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
