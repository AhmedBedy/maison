import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/ManageStudentsView.css";
import type { ViewType } from "../types";
import type { TranslationKeys } from "../components/LanguageSwitcher";

type Subject = { id: number; title: string };
type Grade = { id: number; title: string; serie_title: string };

type Course = {
  id: number;
  title: string;
  description: string | null;
  duration: string | null;
  video_url: string | null;
  prerequisites: string[] | null;
  resources: any[] | null;
  assessment_questions: any[] | null;
  display_order: number;
  subjects: Subject[];
  grades: Grade[];
};

type Props = {
  setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
  setSelectedCourse: (course: Course) => void;
  t: (key: TranslationKeys) => string;
};

const ManageCoursesView: React.FC<Props> = ({
  setView,
  setAlertMsg,
  setSelectedCourse,
  t,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);

    const { data: coursesData, error } = await supabase
      .from("courses")
      .select(`
        id,
        title,
        description,
        duration,
        video_url,
        prerequisites,
        resources,
        assessment_questions,
        display_order,

        course_subjects (
          subject_id,
          subjects (id, title)
        ),
        course_grades (
          grade_id,
          grades (
            id,
            title,
            serie_id,
            series (id, title)
          )
        )
        `)
        .order("display_order");

    if (error) {
      setAlertMsg(t("errorLoadingCourses"));
      setLoading(false);
      return;
    }
    if (!coursesData || coursesData.length === 0) {
      setCourses([]);
      setLoading(false);
      return;
    }

    // Map nested data into Course[]
    const fullCourses: Course[] = coursesData.map((course: any) => {
      const subjects: Subject[] =
        course.course_subjects?.map((cs: any) => cs.subjects) || [];

      const grades: Grade[] =
        course.course_grades?.map((cg: any) => ({
          id: cg.grades.id,
          title: cg.grades.title,
          serie_title: cg.grades.series?.title || "",
        })) || [];

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        duration: course.duration,
        video_url: course.video_url,
        prerequisites: course.prerequisites || [],
        resources: course.resources || [],
        assessment_questions: course.assessment_questions || [],
        display_order: course.display_order,

        subjects,
        grades,
      };
    });

    setCourses(fullCourses);
    setLoading(false);
  };

  const filtered = courses
  .filter((c) =>
    [c.title, c.description || "", c.duration || ""]
      .concat(
        c.subjects.map((s) => s.title),
        c.grades.map((g) => g.title),
        c.grades.map((g) => g.serie_title)
      )
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  )
  .sort((a, b) => a.display_order - b.display_order);

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setView("edit-course");
  };

  const requestDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId === null) return;
    const course = courses.find((c) => c.id === confirmDeleteId);
    const gradeIds = course?.grades.map((g) => g.id) ?? [];
    const subjectIds = course?.subjects.map((s) => s.id) ?? [];
    const pairs = gradeIds.flatMap((grade_id) =>
      subjectIds.map((subject_id) => ({ grade_id, subject_id }))
    );

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", confirmDeleteId);

    let deleteError = error;
    if (!deleteError) {
      for (const { grade_id, subject_id } of pairs) {
        const { data: gradeCourses, error: gradeCoursesError } = await supabase
          .from("course_grades")
          .select("course_id")
          .eq("grade_id", grade_id);
        if (gradeCoursesError) {
          deleteError = gradeCoursesError;
          break;
        }
        const gradeCourseIds = (gradeCourses ?? []).map(
          (c: { course_id: number }) => c.course_id
        );
        if (gradeCourseIds.length === 0) {
          const { error: delError } = await supabase
            .from("grade_subjects")
            .delete()
            .eq("grade_id", grade_id)
            .eq("subject_id", subject_id);
          if (delError) deleteError = delError;
          continue;
        }
        const { data: linked, error: linkedError } = await supabase
          .from("course_subjects")
          .select("course_id")
          .eq("subject_id", subject_id)
          .in("course_id", gradeCourseIds);
        if (linkedError) {
          deleteError = linkedError;
          break;
        }
        if (!linked || linked.length === 0) {
          const { error: delError } = await supabase
            .from("grade_subjects")
            .delete()
            .eq("grade_id", grade_id)
            .eq("subject_id", subject_id);
          if (delError) {
            deleteError = delError;
            break;
          }
        }
      }
    }

    if (deleteError) {
      setAlertMsg(t("errorDeletingCourse"));
    } else {
      setAlertMsg(t("courseDeleted"));
      loadCourses();
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className="manage-students-container">
      <h2>📚 {t("manageCourses")}</h2>
      <input
        type="text"
        className="search-input"
        placeholder={t("searchCourseFields")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="manage-buttons">
      <button onClick={() => setView("admin-dashboard")}>⬅ {t("back")}</button>
        <button className="add-student-btn" onClick={() => setView("add-course")}>
        ➕ {t("addCourse")}
                </button>
      </div>

      {loading ? (
           <p>{t("loading")}</p>
      ) : filtered.length === 0 ? (
        <p>{t("noCoursesFound")}</p>
      ) : (
        <div className="table-wrapper">
         <table className="students-table">
            <thead>
              <tr>
              <th>{t("title")}</th>
                <th>{t("order")}</th>
                <th>{t("subjects")}</th>
                <th>
                  {t("grades")} [{t("series")}]
                </th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.display_order}</td>
                  <td>{course.subjects.map((s) => s.title).join(", ") || "—"}</td>
                  <td>
                    {course.grades.length > 0
                      ? course.grades
                          .map((g) => `${g.title} [${g.serie_title}]`)
                          .join(", ")
                      : "—"}
                  </td>

                  <td>
                    <button onClick={() => handleEdit(course)}>✏️</button>
                    <button onClick={() => requestDelete(course.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <p>
            {t("areYouSureDelete")} <strong>{
                courses.find((c) => c.id === confirmDeleteId)?.title || t("thisCourse")
              }</strong>
              ?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmDelete}>
              ✅ {t("yes")}
              </button>
              <button
                className="cancel-btn"
                onClick={() => setConfirmDeleteId(null)}
              >
                  ❌ {t('no')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoursesView;
