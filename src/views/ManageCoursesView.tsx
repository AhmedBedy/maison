import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/ManageStudentsView.css";
import type { ViewType } from "../types";

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
  subjects: Subject[];
  grades: Grade[];
};

type Props = {
  setView: (view: ViewType) => void;
  setAlertMsg: (msg: string) => void;
  setSelectedCourse: (course: Course) => void;
};

const ManageCoursesView: React.FC<Props> = ({
  setView,
  setAlertMsg,
  setSelectedCourse,
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
      `);

    if (error) {
      setAlertMsg("Error loading courses");
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
        subjects,
        grades,
      };
    });

    setCourses(fullCourses);
    setLoading(false);
  };

  const filtered = courses.filter((c) =>
    [c.title, c.description || "", c.duration || ""]
      .concat(
        c.subjects.map((s) => s.title),
        c.grades.map((g) => g.title),
        c.grades.map((g) => g.serie_title)
      )
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setView("edit-course");
  };

  const requestDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId === null) return;

    const { error } = await supabase.from("courses").delete().eq("id", confirmDeleteId);

    if (error) {
      setAlertMsg("Error deleting course");
    } else {
      setAlertMsg("Course deleted");
      loadCourses();
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className="manage-students-container">
      <h2>📚 Manage Courses</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Search by title, description, duration, subject or grade"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="manage-buttons">
        <button onClick={() => setView("admin-dashboard")}>⬅ Back</button>
        <button className="add-student-btn" onClick={() => setView("add-course")}>
          ➕ Add New Course
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Subjects</th>
              <th>Grades [Series]</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
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
      )}

      {confirmDeleteId !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <p>
              Are you sure you want to delete{" "}
              <strong>
                {courses.find((c) => c.id === confirmDeleteId)?.title || "this course"}
              </strong>
              ?
            </p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmDelete}>
                ✅ Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setConfirmDeleteId(null)}
              >
                ❌ No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoursesView;
