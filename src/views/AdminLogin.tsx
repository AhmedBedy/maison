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
  setIsAdminLogin: (v: boolean) => void;
  isAdminLogin: boolean;
  setView: (view: ViewType) => void;
  supabase: any;
  
  t: (v: TranslationKeys) => string;
  setAlertMsg: (view: string) => void;
};

const Admin: React.FC<adminProps> = ({
  setIsAdminLogin,
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

            const { data: admin, error } = await supabase
  .from('admins')
  .select('*')
  .eq('phone', Number(phone))
  .single();

if (error || !admin) {
  setAlertMsg(t('adminNotFound'));
  return;
}

if (admin.password !== Number(password)) {
  setAlertMsg(t('wrongPassword'));
  return;
}

setIsAdminLogin(true);
setView('admin-dashboard');

          }}
        >
          <h2>🛠 {t('adminLogin')} </h2>

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

export default Admin;
