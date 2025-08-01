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

import './styles/App.css';
import './styles/Header.css';

function App() {
  const [view, setView] = useState<
    | 'home'
    | 'admin'
    | 'student'
    | 'admin-dashboard'
    | 'student-dashboard'
    | 'courses'
    | 'course-detail'
    | 'course-prereqs'
  >('home');
  const [lang, changeLang, t] = LangSwitcher();

  const [isAdminLogin, setIsAdminLogin] = useState<true | false>(false);
  const [isStudentLogin, setIsStudentLogin] = useState<true | false>(false);

  const [msg, settMsg] = useState<string | null>('ahmed');

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
            t={t}
            setAlertMsg={setAlertMsg}
          />
        )}

        {view === 'student-dashboard' && (
          <StudentDashboard
            isStudentLogin={isStudentLogin}
            t={t}
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
