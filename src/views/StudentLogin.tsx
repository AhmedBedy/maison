import React from 'react';
import type { TranslationKeys } from '../components/LanguageSwitcher'; 


type ViewType =
  | 'home'
  | 'admin'
  | 'student'
  | 'admin-dashboard'
  | 'student-dashboard'
  | 'courses'
  | 'course-detail'
  | 'course-prereqs';

type adminProps = {
  setIsStudentLogin: (v: boolean) => void;
  isStudentLogin: boolean;
  setView: (view: ViewType) => void;
  supabase: any;
  t: (v: TranslationKeys) => string;
  setAlertMsg: (view: string) => void;
};

const Student: React.FC<adminProps> = ({
  setIsStudentLogin,
  setView,
  supabase,
  t,
  setAlertMsg,
}) => {
  return (
    <>
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const phone = e.currentTarget.phone.value;
            const password = e.currentTarget.password.value;

            const { data, error } = await supabase
              .from('students')
              .select('*')
              .eq('phone', phone)
              .single();

            if (error || !data) {
              setAlertMsg(t('studentNotFound'));
              //setAlertMsg('student not found');
              return;
            }

            // Compare password manually (for now, assuming plain text; later, use hashing securely)
            if (data.password === password) {
              setIsStudentLogin(true);
              setView('student-dashboard');
              //setAlertMsg('Welcome!');
              //await loadAdminData();
            } else {
              //setAlertMsg('Incorrect password');
              setAlertMsg(t('wrongPassword'));
            }
          }}
        >
          <h2>🧑‍🎓 {t('studentLogin')} </h2>
          <input
            type="text"
            name="phone"
            placeholder={t('phone')}
            required
            onInvalid={(e) =>
              e.currentTarget.setCustomValidity(t('phoneRequired'))
            }
            onInput={(e) => e.currentTarget.setCustomValidity('')}
          />
          <input
            type="password"
            name="password"
            placeholder={t('password')}
            required
            onInvalid={(e) =>
              e.currentTarget.setCustomValidity(t('passwordRequired'))
            }
            onInput={(e) => e.currentTarget.setCustomValidity('')}
          />
          <button className="login" type="submit">
            🔓 {t('login')}
          </button>
        </form>
      </div>
    </>
  );
};

export default Student;
