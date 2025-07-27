// src/api/schoolData.ts
import { supabase } from '../supabaseClient';

// Get all series
export async function fetchSeries() {
  const { data, error } = await supabase.from('series').select('*');
  if (error) throw error;
  return data;
}

// Get grades for a series
export async function fetchGradesBySeries(serieId: number) {
  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .eq('serie_id', serieId);
  if (error) throw error;
  return data;
}

// Get subjects for a grade (indirect, if you want to)
export async function fetchSubjects() {
  const { data, error } = await supabase.from('subjects').select('*');
  if (error) throw error;
  return data;
}

// Get courses by grade and subject
export async function fetchCoursesByGradeAndSubject(
  gradeId: number,
  subjectId: number
) {
  const { data, error } = await supabase
    .from('courses')
    .select(
      `
      *,
      course_grades!inner(grade_id),
      course_subjects!inner(subject_id)
    `
    )
    .eq('course_grades.grade_id', gradeId)
    .eq('course_subjects.subject_id', subjectId);

  if (error) throw error;
  return data;
}
