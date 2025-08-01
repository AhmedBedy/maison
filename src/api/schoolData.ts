import { supabase } from '../supabaseClient';

export async function fetchGradesBySeries(serieId: number) {
  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .eq('serie_id', serieId);

  if (error) {
    console.error('Supabase fetch error:', error);
    return null;
  }
  return data;
}

export async function fetchCoursesByGradeAndSubject(
  gradeId: number,
  subjectId: number
) {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      id, title, description, duration, img_url, video_url, resources, assessment_questions,
      course_grades!inner(grade_id),
      course_subjects!inner(subject_id)
    `)
    .eq('course_grades.grade_id', gradeId)
    .eq('course_subjects.subject_id', subjectId);

  if (error) {
    console.error('Supabase fetch error:', error);
    return null;
  }

  return data;
}

export async function fetchSubjects() {
  const { data, error } = await supabase.from('subjects').select('*');

  if (error) {
    console.error('Supabase fetch error:', error);
    return null;
  }
  return data;
}
