import { useState } from 'react';

type Lang = 'ar' | 'fr' | 'en';

export type TranslationKeys =
  | 'home' //ok
  | 'courses'
  | 'admin' //ok
  | 'student' //ok
  | 'adminLogin' //ok
  | 'studentLogin' //ok
  | 'adminDashboard' //ok
  | 'studentDashboard' //ok
  | 'learningSlogan' //ok
  | 'appTitle' //ok
  | 'addCourse'
  | 'addStudent'
  | 'login'
  | 'ourCourses'
  | 'searchCourses'
  | 'prerequisiteFor'
  | 'completePrerequisites'
  | 'welcome'
  | 'footerText' //ok
  | 'edit'
  | 'delete'
  | 'startAssessment'
  | 'submitAssessment'
  | 'backToPreviousCourse'
  | 'learnAtYourPace'
  | 'students'
  | 'phone' //ok
  | 'password' //ok
  | 'resources'
  | 'assessment'
  | 'logout' //ok
  | 'cancel'
  | 'save'
  | 'proceedToCourse'
  | 'allPrerequisitesCompleted'
  | 'editCourse'
  | 'editStudent'
  | 'required'
  | 'completed'
  | 'studentNotFound'
  | 'adminNotFound'
  | 'wrongPassword'
  | 'phoneRequired'
  | 'passwordRequired'
  | 'noSeriesAvailable'
  | 'noCoursesAvailable';

export function LangSwitcher(): [
  Lang,
  () => void,
  (key: TranslationKeys) => string
] {
  const [lang, setLang] = useState<Lang>('ar');

  const changeLang = () => {
    const langs: Lang[] = ['ar', 'fr', 'en'];
    const nextIndex = (langs.indexOf(lang) + 1) % langs.length;
    setLang(langs[nextIndex]);
  };

  const translations: Record<
    'ar' | 'fr' | 'en',
    Record<TranslationKeys, string>
  > = {
    en: {
      home: 'Home',
      courses: 'Courses',
      admin: '   Admin ',
      student: '   Student',
      adminLogin: 'Login Admin ',
      studentLogin: 'Login Student ',
      adminDashboard: 'Admin Dashboard',
      studentDashboard: 'Student Dashboard',
      addCourse: 'Add New Course',
      addStudent: 'Add New Student',
      learningSlogan: 'Your Path to Success  ',
      appTitle: 'Maison de Révision',
      login: 'Login',
      ourCourses: 'Our Courses',
      searchCourses: 'Search course...',
      prerequisiteFor: 'Prerequisite Courses for ',
      completePrerequisites:
        'Please complete all prerequisite courses before continuing.',
      welcome: 'Welcome to Maison de Révision!',
      footerText: ' Maison de Révision. All rights reserved.',
      edit: 'Edit',
      delete: 'Delete',
      startAssessment: 'Start Assessment',
      submitAssessment: 'Submit Assessment',
      backToPreviousCourse: 'Back to Previous Course',
      learnAtYourPace: 'Learn at your own pace',
      students: 'Students',
      phone: 'Phone',
      password: 'Password',
      resources: 'Resources',
      assessment: 'Assessment',
      logout: 'Logout',
      cancel: 'Cancel',
      save: 'Save',
      proceedToCourse: 'Proceed to course',
      allPrerequisitesCompleted:
        'All prerequisites completed!   You can proceed to the course.',
      editCourse: 'Edit course',
      editStudent: 'Edit student',
      required: 'Required',
      completed: 'Completed',

      studentNotFound: 'Student not found',
      adminNotFound: 'Admin not found',
      wrongPassword: 'Incorrect password',

      phoneRequired: 'Phone number is required',
      passwordRequired: 'Password is required',
      noSeriesAvailable: 'No series available',
      noCoursesAvailable: 'No courses available for this grade and subject.',
    },
    fr: {
      home: 'Accueil',
      courses: 'Cours',
      admin: '   Admin ',
      student: '   Élève',
      adminLogin: ' Connexion Admin',
      studentLogin: 'Connexion Élève',
      adminDashboard: 'Tableau de Bord Admin',
      studentDashboard: 'Tableau de Bord Élève',
      addCourse: 'Ajouter un Nouveau Cours',
      addStudent: 'Ajouter un Nouvel Élève',
      learningSlogan: 'Votre chemin du succès  ',
      appTitle: 'Maison de Révision',
      login: 'Se Connecter',
      ourCourses: 'Nos Cours',
      searchCourses: 'Rechercher un cours...',
      prerequisiteFor: 'Cours préalables pour ',
      completePrerequisites:
        'Veuillez compléter tous les cours préalables avant de continuer.',
      welcome: 'Bienvenue à la Maison de Révision !',
      footerText: ' Maison de Révision. Tous droits réservés.',
      edit: 'Modifier',
      delete: 'Supprimer',
      startAssessment: "Commencer l'évaluation",
      submitAssessment: "Soumettre l'évaluation",
      backToPreviousCourse: 'Retour au cours précédent',

      learnAtYourPace: 'Apprenez à votre rythme',
      students: 'Étudiants',
      phone: 'Téléphone',
      password: 'Mot de passe',
      resources: 'Ressources',
      assessment: 'Évaluation',
      logout: 'Déconnexion',
      cancel: 'Annuler',
      save: 'Enregistrer',
      proceedToCourse: 'Accéder au cours',
      allPrerequisitesCompleted:
        'Tous les prérequis sont remplis!    Vous pouvez accéder au cours.',
      editCourse: 'Modifier le cours',
      editStudent: "Modifier l'étudiant",
      required: 'Requis',
      completed: 'Rempli',

      studentNotFound: 'Élève introuvable',
      adminNotFound: 'Administrateur introuvable',
      wrongPassword: 'Mot de passe incorrect',
      phoneRequired: 'Le numéro de téléphone est requis',
      passwordRequired: 'Le mot de passe est requis',
      noSeriesAvailable: 'Aucune série disponible',
      noCoursesAvailable: 'Aucun cours disponible pour ce niveau et cette matière.',
    },
    ar: {
      home: 'الرئيسية',
      courses: 'الدروس',
      admin: '  المشرف ',
      student: '  الطالب',
      adminLogin: ' دخول المشرف ',
      studentLogin: ' دخول الطالب',
      adminDashboard: 'لوحة تحكم المشرف',
      studentDashboard: 'لوحة تحكم الطالب',
      addCourse: 'إضافة درس جديد',
      addStudent: 'إضافة طالب جديد',
      learningSlogan: 'سبيــــــلك للنجــاح ',
      appTitle: 'بيت المـــــراجعة',
      login: ' الدخول',
      ourCourses: 'دروسنا',
      searchCourses: 'ابحث عن درس...',
      prerequisiteFor: 'الدروس اللازمة لمتابعة درس  ',
      completePrerequisites: 'يرجى إكمال جميع الدروس اللازمة قبل المتابعة.',
      welcome: 'مرحبًا بك في بيت المراجعة!',
      footerText: '  بيت المراجعة. جميع الحقوق محفوظة.',
      edit: 'تعديل',
      delete: 'حذف',
      startAssessment: 'ابدأ الاختبار',
      submitAssessment: 'إرسال الاختبار',
      backToPreviousCourse: 'العودة إلى الدرس السابق',
      learnAtYourPace: 'تعلم اعل راحتك',
      students: 'الطلاب',
      phone: 'الهاتف',
      password: 'كلمة المرور',
      resources: 'المراجع',
      assessment: 'الاختبار',

      logout: 'تسجيل الخروج',

      cancel: 'إلغاء',
      save: 'حفظ',
      proceedToCourse: 'الانتقال إلى الدورة',
      allPrerequisitesCompleted:
        ' جميع الدروس اللازمة أكملت!    يمكنك الانتقال إلى الدرس.',
      editCourse: 'تعديل الدرس',
      editStudent: 'تعديل الطالب',
      required: 'لازم',
      completed: 'تم',

      studentNotFound: 'لم يتم العثور على الطالب',
      adminNotFound: 'لم يتم العثور على المشرف',
      wrongPassword: 'كلمة المرور غير صحيحة',

      phoneRequired: 'رقم الهاتف لازم',
      passwordRequired: 'كلمة المرور لازمة',
      noSeriesAvailable: 'لا توجد سلاسل متاحة',
      noCoursesAvailable: 'لا توجد دروس متاحة لهذه الدرجة وهذه المادة',
    },
  };

  const t = (key: TranslationKeys) => translations[lang][key];

  return [lang, changeLang, t];
}

export default LangSwitcher;
