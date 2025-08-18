import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import LangSwitcher from './components/LanguageSwitcher';
import Home from './views/Home';
import Admin from './views/AdminLogin';
import Student from './views/StudentLogin';
import AdminDashboard from './views/AdminDashboard';
import StudentDashboard from './views/StudentDashboard';
import ManageStudentsView from './views/ManageStudentsView';
import EditStudentView from './views/EditStudentView';
import AddStudentView from './views/AddStudentView';
import ManageSeriesView from './views/ManageSeriesView';
import ManageGradesView from './views/ManageGradesView';
import ManageSubjectsView from './views/ManageSubjectsView';
import ManageCoursesView from './views/ManageCoursesView';
import EditCourseView from './views/EditCourseView';
import EditCourseLinkView from './views/EditCourseLinkView';

import './styles/App.css';
import './styles/Header.css';
import type { ViewType } from './types';

function App() {
  const [view, setView] = useState<ViewType>('home');
  const [lang, changeLang, t] = LangSwitcher();

  const [isAdminLogin, setIsAdminLogin] = useState<true | false>(false);
  const [isStudentLogin, setIsStudentLogin] = useState<true | false>(false);

  const [msg, settMsg] = useState<string | null>('ahmed');

  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);



  function setAlertMsg(msg: string | null) {
    settMsg(msg);
    setTimeout(() => settMsg(null), 3000);
  }

  useEffect(() => {
    setAlertMsg(msg);
  }, [msg]);

 

  return (
    <>
    <div className={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header
        view={view}
        setView={setView}
        lang={lang}
        changeLang={changeLang}
        isAdminLogin={isAdminLogin}
        isStudentLogin={isStudentLogin}
        setIsAdminLogin={setIsAdminLogin}
        setIsStudentLogin={setIsStudentLogin}
        setAlertMsg={setAlertMsg}
        t={t}
      />
      <div className="Content fade-in">
        {view === 'home' && (
          <Home   
          
          view={view}
        setView={setView}
        lang={lang}
        changeLang={changeLang}
        isAdminLogin={isAdminLogin}
        isStudentLogin={isStudentLogin}
        setIsAdminLogin={setIsAdminLogin}
        setIsStudentLogin={setIsStudentLogin}
        setAlertMsg={setAlertMsg}
        t={t}
        supabase={supabase}
          
          
          
          
          
          
          />
        )}

        {view === 'admin' && (
          <Admin
            setView={setView}
            isAdminLogin={isAdminLogin}
            setIsAdminLogin={setIsAdminLogin}
            supabase={supabase}
            t={t}
            setAlertMsg={setAlertMsg}
          />
        )}

        {view === 'student' && (
          <Student
            setView={setView}
            isStudentLogin={isStudentLogin}
            setIsStudentLogin={setIsStudentLogin}
            supabase={supabase}
            t={t}
            setAlertMsg={setAlertMsg}
          />
        )}

        {view === 'admin-dashboard' && (
          <AdminDashboard
          isAdminLogin={isAdminLogin}
          setAlertMsg={setAlertMsg}
          setView={setView}
        />
        )}

        {view === 'student-dashboard' && (
          <StudentDashboard
            isStudentLogin={isStudentLogin}
            t={t}
            setAlertMsg={setAlertMsg}
          />
        )}

{view === 'manage-students' && (
  <ManageStudentsView
    setView={setView}
    setAlertMsg={setAlertMsg}
    setSelectedStudent={setSelectedStudent}
  />
)}

{view === 'edit-student' && selectedStudent && (
  <EditStudentView
    student={selectedStudent}
    setView={setView}
    setAlertMsg={setAlertMsg}
  />
)}

{view === 'add-student' && (
  <AddStudentView setView={setView} setAlertMsg={setAlertMsg} />
)}
{view === 'manage-series' && (
  <ManageSeriesView
    setView={setView}
    setAlertMsg={setAlertMsg}
  />
)}

{view === 'manage-grades' && (
  <ManageGradesView
    setView={setView}
    setAlertMsg={setAlertMsg}
  />
)}


{view === 'manage-subjects' && (
  <ManageSubjectsView
    setView={setView}
    setAlertMsg={setAlertMsg}
  />
)}



{view === 'manage-courses' && (
  <ManageCoursesView
    setView={setView}
    setSelectedCourse={setSelectedCourse}
    setAlertMsg={setAlertMsg}
  />
)}


{view === 'edit-course' && selectedCourse && (
  <EditCourseView
    setView={setView}
    selectedCourse={selectedCourse}
    setAlertMsg={setAlertMsg}
    setSelectedCourse={setSelectedCourse} // ✅ Pass it down
  />
)}







{view === 'edit-course-link' && (
  <EditCourseLinkView
    setView={setView}
    selectedCourse={selectedCourse}
    setAlertMsg={setAlertMsg}
  />
)}




        
      </div>
      {msg && <div className="toast-msg">{msg}</div>}
      
      <footer>
        <div>
          {t('footerText')} {new Date().getFullYear()} ©
        </div>
      </footer>
      </div>
    </>
  );
}

export default App;
