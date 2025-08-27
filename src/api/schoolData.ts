import { supabase } from '../supabaseClient';

export async function fetchGradesBySeries(serieId: number) {
  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .eq('serie_id', serieId)
    .order('display_order');

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
      id, title, description, duration, img_url, video_url, resources, assessment_questions, display_order,
      course_grades!inner(grade_id),
      course_subjects!inner(subject_id)
    `)
    .eq('course_grades.grade_id', gradeId)
    .eq('course_subjects.subject_id', subjectId)
    .order('display_order');

  if (error) {
    console.error('Supabase fetch error:', error);
    return null;
  }

  return data;
}


export async function fetchSubjectsByGrade(gradeId: number) {
  const { data, error } = await supabase
    .from('subjects')
    .select(`
      id, title, icon, display_order,
      grade_subjects!inner(grade_id)
    `)
    .eq('grade_subjects.grade_id', gradeId)
    .order('display_order');

  if (error) {
    console.error('Supabase fetch error:', error);
    return null;
  }
  return data;
}