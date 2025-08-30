// src/components/Home.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

import SeriesView from '../components/SeriesView';
import GradesView from '../components/GradesView';
import SubjectsView from '../components/SubjectsView';
import CoursesView from '../components/CoursesView';
import type { Course } from '../components/CoursesView';
import CourseDetailView from '../components/CourseDetailView';

import type { TranslationKeys } from '../components/LanguageSwitcher';

type Serie = {
  id: number;
  title: string;
  icon: string;
  display_order?: number;

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

type HomeProps = {
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
  setAlertMsg: (msg: string) => void;
};

const Home: React.FC<HomeProps> = ({ t }) => {
  // State for all navigation levels
  const [seriesList, setSeriesList] = useState<Serie[]>([]);
  const [selectedSerieId, setSelectedSerieId] = useState<number | null>(null);
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Fetch series on mount
  useEffect(() => {
    const fetchSeries = async () => {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .order('display_order');
      if (error) {
        console.error('Error loading series:', error.message);
      } else if (Array.isArray(data)) {
        setSeriesList(data);
      }
    };
    fetchSeries();
  }, []);

  // Handlers to navigate through hierarchy
  const handleSelectSerie = (id: number) => {
    setSelectedSerieId(id);
    setSelectedGradeId(null);
    setSelectedSubjectId(null);
    setSelectedCourse(null);
  };

  const handleSelectGrade = (gradeId: number) => {
    setSelectedGradeId(gradeId);
    setSelectedSubjectId(null);
    setSelectedCourse(null);
  };

  const handleSelectSubject = (subjectId: number) => {
    setSelectedSubjectId(subjectId);
    setSelectedCourse(null);
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  // Back button handler: go back one level at a time
  const handleBack = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
    } else if (selectedSubjectId !== null) {
      setSelectedSubjectId(null);
    } else if (selectedGradeId !== null) {
      setSelectedGradeId(null);
    } else if (selectedSerieId !== null) {
      setSelectedSerieId(null);
    }
  };

  return (
    <div className="home-container">
      {!selectedSerieId ? (
         <SeriesView series={seriesList} onSelect={handleSelectSerie} t={t} />
      ) : !selectedGradeId ? (
        <GradesView
          serieId={selectedSerieId}
          onBack={handleBack}
          onSelectGrade={handleSelectGrade}
          t={t}
        />
      ) : !selectedSubjectId ? (
        <SubjectsView
          gradeId={selectedGradeId}
          onBack={handleBack}
          onSelectSubject={handleSelectSubject}
          t={t}
        />
      ) : selectedCourse ? (
        <CourseDetailView course={selectedCourse} onBack={handleBack} />
      ) : (
        <CoursesView
          gradeId={selectedGradeId}
          subjectId={selectedSubjectId}
          onBack={handleBack}
          onSelectCourse={handleSelectCourse}
          t={t}
        />
      )}
    </div>
  );
};

export default Home;
