import React from 'react';
import logo from '/logo.png';

import type { TranslationKeys } from './LanguageSwitcher'; 

type ViewType =
  | 'home'
  | 'admin'
  | 'student'
  | 'admin-dashboard'
  | 'student-dashboard'
  | 'courses'
  | 'course-detail'
  | 'course-prereqs';

type HeaderProps = {
  view: ViewType;
  setView: (view: ViewType) => void;
  lang: 'ar' | 'fr' | 'en';
  changeLang: () => void;
  isAdminLogin: boolean;
  isStudentLogin: boolean;
  setIsAdminLogin: (v: boolean) => void;
  setIsStudentLogin: (v: boolean) => void;
  setAlertMsg: (v: string) => void;
  t: (v: TranslationKeys) => string;
};

const Header: React.FC<HeaderProps> = ({
  view,
  setView,
  lang,
  changeLang,
  isAdminLogin,
  isStudentLogin,
  setIsAdminLogin,
  setIsStudentLogin,
  setAlertMsg,
  t,
}) => {
  const getLangName = (lang: string) => {
    return lang === 'ar' ? 'العربية' : lang === 'fr' ? 'Français' : 'English';
  };

  return (
    <header>
      <div className="header-logo">
        <img src={logo} className="logo" alt="MR logo" />
        <button
          className="lang-btn"
          onClick={() => {
            const newLang = lang === 'ar' ? 'fr' : lang === 'fr' ? 'en' : 'ar';
            changeLang();
            setAlertMsg(
              newLang === 'ar'
                ? 'تم تغيير اللغة إلى العربية'
                : newLang === 'en'
                ? 'Language changed to English'
                : 'Langue changée en français'
            );
          }}
        >
          {getLangName(lang)}
        </button>
      </div>

      <div className="header-main">
        <div className="header-titles">
          <h1>{t('appTitle')}</h1>
          <h3>{t('learningSlogan')}</h3>
        </div>

        {!isAdminLogin && !isStudentLogin && (
          <div className="header-btn">
            <nav>
              <div className="nav-left">
                <button
                  className={`home-btn ${view === 'home' ? 'active' : ''}`}
                  onClick={() => setView('home')}
                >
                  {t('home')}
                </button>
                <button
                  className={`student-btn ${
                    view === 'student' ? 'active' : ''
                  }`}
                  onClick={() => setView('student')}
                >
                  🧑‍🎓 {t('student')}
                </button>
              </div>
              <div className="nav-right">
                <button
                  className={`admin-btn ${view === 'admin' ? 'active' : ''}`}
                  onClick={() => setView('admin')}
                >
                  🛠 {t('admin')}
                </button>
              </div>
            </nav>
          </div>
        )}

        {isAdminLogin && (
          <div className="header-btn">
            <div>
              <h6>Admin name</h6>
              <button
                style={{ fontSize: 'clamp(3px, 1.8vw, 2rem)' }}
                className="logout"
                onClick={() => {
                  setIsAdminLogin(false);
                  setView('home');
                }}
              >
                🔒 {t('logout')} ➡️
              </button>
            </div>
            <nav className="nav-left">
              <button
                className={`home-btn ${view === 'home' ? 'active' : ''}`}
                onClick={() => setView('home')}
              >
                {t('home')}
              </button>
              <button
                style={{ fontSize: 'clamp(5px, 2.15vw, 2rem)' }}
                className={`dashboard ${
                  view === 'admin-dashboard' ? 'active' : ''
                }`}
                onClick={() => setView('admin-dashboard')}
              >
                🛠 {t('adminDashboard')}
              </button>
            </nav>
          </div>
        )}

        {isStudentLogin && (
          <div className="header-btn">
            <div>
              <h6>Student name Ahmed Bedy</h6>
              <button
                style={{ fontSize: 'clamp(3px, 1.8vw, 2rem)' }}
                className="logout"
                onClick={() => {
                  setIsStudentLogin(false);
                  setView('home');
                }}
              >
                🔒 {t('logout')} ➡️
              </button>
            </div>
            <nav className="nav-left">
              <button
                className={`home-btn ${view === 'home' ? 'active' : ''}`}
                onClick={() => setView('home')}
              >
                {t('home')}
              </button>
              <button
                style={{ fontSize: 'clamp(5px, 2.15vw, 2rem)' }}
                className={`dashboard ${
                  view === 'student-dashboard' ? 'active' : ''
                }`}
                onClick={() => setView('student-dashboard')}
              >
                🧑‍🎓 {t('studentDashboard')}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
