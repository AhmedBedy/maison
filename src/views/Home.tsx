// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import SeriesView from '../components/SeriesView';
import type { TranslationKeys } from '../components/LanguageSwitcher'; 


type Serie = {
  id: number;
  title: string;
  icon: string;
};

type ViewType =
  | 'home'
  | 'admin'
  | 'student'
  | 'admin-dashboard'
  | 'student-dashboard'
  | 'courses'
  | 'course-detail'
  | 'course-prereqs';
type homeProps = {
  view: ViewType;
  lang: 'ar' | 'fr' | 'en';
  changeLang: () => void;
  setIsAdminLogin: (v: boolean) => void;
  setIsStudentLogin: (v: boolean) => void;

  isAdminLogin: boolean;
  isStudentLogin: boolean;
  setView: (view: ViewType) => void;
  supabase: any;
  t: (v: TranslationKeys) => string;
  setAlertMsg: (view: string) => void;
};

const Home: React.FC<homeProps> = () => {
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
