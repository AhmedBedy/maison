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
  | 'series'
  | 'grades'
  | 'subjects'
  | 'backToSeries'
  | 'backToGrades'
  | 'backToSubjects'
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
  | 'noCoursesAvailable'
  | 'manageSeries'
  | 'back'
  | 'searchByTitleOrIcon'
  | 'title'
  | 'iconLabel'
  | 'order'
  | 'actions'
  | 'add'
  | 'loading'
  | 'noSeriesFound'
  | 'pleaseFillAllFields'
  | 'errorLoadingSeries'
  | 'errorAddingSeries'
  | 'seriesAdded'
  | 'errorUpdatingSeries'
  | 'seriesUpdated'
  | 'errorDeletingSeries'
  | 'seriesDeleted'
  | 'areYouSureDelete'
  | 'thisSeries'
  | 'yes'
  | 'no'
  | 'manageCourses'
  | 'manageSubjects'
  | 'manageGrades'
  | 'manageStudents'
  | 'searchCourseFields'
  | 'searchByNamePhoneClass'
  | 'searchByTitle'
  | 'subjects'
  | 'grades'
  | 'series'






  | 'classLabel'
  | 'noSubjectsFound'
  | 'noGradesFound'
  | 'noStudentsFound'
  | 'noCoursesFound'
  | 'errorLoadingSubjects'
  | 'errorAddingSubject'
  | 'subjectAdded'
  | 'errorUpdatingSubject'
  | 'subjectUpdated'
  | 'errorDeletingSubject'
  | 'subjectDeleted'
  | 'errorLoadingGrades'
  | 'errorAddingGrade'
  | 'gradeAdded'
  | 'errorUpdatingGrade'
  | 'gradeUpdated'
  | 'errorDeletingGrade'
  | 'gradeDeleted'
  | 'errorLoadingCourses'
  | 'errorDeletingCourse'
  | 'courseDeleted'
  | 'errorLoadingStudents'
  | 'errorDeletingStudent'
  | 'studentDeleted'
  | 'thisSubject'
  | 'thisGrade'
  | 'thisCourse'
  | 'thisStudent'
  | 'selectSeries';

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
      series: 'Series',
      grades: 'Grades',
      subjects: 'Subjects',
      backToSeries: 'Back to series',
      backToGrades: 'Back to grades',
      backToSubjects: 'Back to subjects',
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
      manageSeries: 'Manage Series',
      back: 'Back',
      searchByTitleOrIcon: 'Search by title or icon',
      title: 'Title',
      iconLabel: 'Icon',
      order: 'Order',
      actions: 'Actions',
      add: 'Add',
      loading: 'Loading...',
      noSeriesFound: 'No series found.',
      pleaseFillAllFields: 'Please fill all fields',
      errorLoadingSeries: 'Error loading series',
      errorAddingSeries: 'Error adding series',
      seriesAdded: 'Series added',
      errorUpdatingSeries: 'Error updating series',
      seriesUpdated: 'Series updated',
      errorDeletingSeries: 'Error deleting series',
      seriesDeleted: 'Series deleted',
      areYouSureDelete: 'Are you sure you want to delete',
      thisSeries: 'this series',
      yes: 'Yes',
      no: 'No',
      manageCourses: 'Manage Courses',
      manageSubjects: 'Manage Subjects',
      manageGrades: 'Manage Grades',
      manageStudents: 'Manage Students',
      searchCourseFields: 'Search by title, description, duration, subject or grade',
      searchByNamePhoneClass: 'Search by name, phone or class',
      searchByTitle: 'Search by title',
      classLabel: 'Class',
      noSubjectsFound: 'No subjects found.',
      noGradesFound: 'No grades found.',
      noStudentsFound: 'No students found.',
      noCoursesFound: 'No courses found.',
      errorLoadingSubjects: 'Error loading subjects',
      errorAddingSubject: 'Error adding subject',
      subjectAdded: 'Subject added',
      errorUpdatingSubject: 'Error updating subject',
      subjectUpdated: 'Subject updated',
      errorDeletingSubject: 'Error deleting subject',
      subjectDeleted: 'Subject deleted',
      errorLoadingGrades: 'Error loading grades',
      errorAddingGrade: 'Error adding grade',
      gradeAdded: 'Grade added',
      errorUpdatingGrade: 'Error updating grade',
      gradeUpdated: 'Grade updated',
      errorDeletingGrade: 'Error deleting grade',
      gradeDeleted: 'Grade deleted',
      errorLoadingCourses: 'Error loading courses',
      errorDeletingCourse: 'Error deleting course',
      courseDeleted: 'Course deleted',
      errorLoadingStudents: 'Error loading students',
      errorDeletingStudent: 'Error deleting student',
      studentDeleted: 'Student deleted',
      thisSubject: 'this subject',
      thisGrade: 'this grade',
      thisCourse: 'this course',
      thisStudent: 'this student',
      selectSeries: 'Select Series',
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
      backToSeries: 'Retour aux séries',
      backToGrades: 'Retour aux niveaux',
      backToSubjects: 'Retour aux matières',
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
      manageSeries: 'Gérer les séries',
      back: 'Retour',
      searchByTitleOrIcon: 'Rechercher par titre ou icône',
      title: 'Titre',
      iconLabel: 'Icône',
      order: 'Ordre',
      actions: 'Actions',
      add: 'Ajouter',
      loading: 'Chargement...',
      noSeriesFound: 'Aucune série trouvée.',
      pleaseFillAllFields: 'Veuillez remplir tous les champs',
      errorLoadingSeries: 'Erreur lors du chargement des séries',
      errorAddingSeries: 'Erreur lors de l\'ajout de la série',
      seriesAdded: 'Série ajoutée',
      errorUpdatingSeries: 'Erreur lors de la mise à jour de la série',
      seriesUpdated: 'Série mise à jour',
      errorDeletingSeries: 'Erreur lors de la suppression de la série',
      seriesDeleted: 'Série supprimée',
      areYouSureDelete: 'Êtes-vous sûr de vouloir supprimer',
      thisSeries: 'cette série',
      yes: 'Oui',
      no: 'Non',
      manageCourses: 'Gérer les cours',
      manageSubjects: 'Gérer les matières',
      manageGrades: 'Gérer les niveaux',
      manageStudents: 'Gérer les étudiants',
      searchCourseFields: 'Rechercher par titre, description, durée, matière ou niveau',
      searchByNamePhoneClass: 'Rechercher par nom, téléphone ou classe',
      searchByTitle: 'Rechercher par titre',
      subjects: 'Matières',
      grades: 'Niveaux',
      series: 'Séries',
      classLabel: 'Classe',
      noSubjectsFound: 'Aucune matière trouvée.',
      noGradesFound: 'Aucun niveau trouvé.',
      noStudentsFound: 'Aucun étudiant trouvé.',
      noCoursesFound: 'Aucun cours trouvé.',
      errorLoadingSubjects: 'Erreur de chargement des matières',
      errorAddingSubject: 'Erreur lors de l\'ajout de la matière',
      subjectAdded: 'Matière ajoutée',
      errorUpdatingSubject: 'Erreur lors de la mise à jour de la matière',
      subjectUpdated: 'Matière mise à jour',
      errorDeletingSubject: 'Erreur lors de la suppression de la matière',
      subjectDeleted: 'Matière supprimée',
      errorLoadingGrades: 'Erreur de chargement des niveaux',
      errorAddingGrade: 'Erreur lors de l\'ajout du niveau',
      gradeAdded: 'Niveau ajouté',
      errorUpdatingGrade: 'Erreur lors de la mise à jour du niveau',
      gradeUpdated: 'Niveau mis à jour',
      errorDeletingGrade: 'Erreur lors de la suppression du niveau',
      gradeDeleted: 'Niveau supprimé',
      errorLoadingCourses: 'Erreur de chargement des cours',
      errorDeletingCourse: 'Erreur lors de la suppression du cours',
      courseDeleted: 'Cours supprimé',
      errorLoadingStudents: 'Erreur de chargement des étudiants',
      errorDeletingStudent: 'Erreur lors de la suppression de l\'étudiant',
      studentDeleted: 'Étudiant supprimé',
      thisSubject: 'cette matière',
      thisGrade: 'ce niveau',
      thisCourse: 'ce cours',
      thisStudent: 'cet étudiant',
      selectSeries: 'Choisir une série',
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
      series: 'السلاسل',
      grades: 'المستويات',
      subjects: 'المواد',
      backToSeries: 'الرجوع إلى السلاسل',
      backToGrades: 'الرجوع إلى المستويات',
      backToSubjects: 'الرجوع إلى المواد',
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
      manageSeries: 'إدارة السلاسل',
      back: 'عودة',
      searchByTitleOrIcon: 'ابحث بالعنوان أو الأيقونة',
      title: 'العنوان',
      iconLabel: 'أيقونة',
      order: 'ترتيب',
      actions: 'إجراءات',
      add: 'أضف',
      loading: 'جارٍ التحميل...',
      noSeriesFound: 'لا توجد سلاسل.',
      pleaseFillAllFields: 'يرجى ملء جميع الحقول',
      errorLoadingSeries: 'حدث خطأ أثناء تحميل السلاسل',
      errorAddingSeries: 'حدث خطأ أثناء إضافة السلسلة',
      seriesAdded: 'تمت إضافة السلسلة',
      errorUpdatingSeries: 'حدث خطأ أثناء تحديث السلسلة',
      seriesUpdated: 'تم تحديث السلسلة',
      errorDeletingSeries: 'حدث خطأ أثناء حذف السلسلة',
      seriesDeleted: 'تم حذف السلسلة',
      areYouSureDelete: 'هل أنت متأكد أنك تريد حذف',
      thisSeries: 'هذه السلسلة',
      yes: 'نعم',
      no: 'لا',
      manageCourses: 'إدارة الدورات',
      manageSubjects: 'إدارة المواد',
      manageGrades: 'إدارة المستويات',
      manageStudents: 'إدارة الطلاب',
      searchCourseFields: 'ابحث حسب العنوان أو الوصف أو المدة أو المادة أو المستوى',
      searchByNamePhoneClass: 'ابحث بالاسم أو الهاتف أو الصف',
      searchByTitle: 'ابحث عن طريق العنوان',
      classLabel: 'الصف',
      noSubjectsFound: 'لم يتم العثور على مواد.',
      noGradesFound: 'لم يتم العثور على مستويات.',
      noStudentsFound: 'لم يتم العثور على طلاب.',
      noCoursesFound: 'لم يتم العثور على دورات.',
      errorLoadingSubjects: 'خطأ في تحميل المواد',
      errorAddingSubject: 'خطأ في إضافة المادة',
      subjectAdded: 'تمت إضافة المادة',
      errorUpdatingSubject: 'خطأ في تحديث المادة',
      subjectUpdated: 'تم تحديث المادة',
      errorDeletingSubject: 'خطأ في حذف المادة',
      subjectDeleted: 'تم حذف المادة',
      errorLoadingGrades: 'خطأ في تحميل المستويات',
      errorAddingGrade: 'خطأ في إضافة المستوى',
      gradeAdded: 'تمت إضافة المستوى',
      errorUpdatingGrade: 'خطأ في تحديث المستوى',
      gradeUpdated: 'تم تحديث المستوى',
      errorDeletingGrade: 'خطأ في حذف المستوى',
      gradeDeleted: 'تم حذف المستوى',
      errorLoadingCourses: 'خطأ في تحميل الدورات',
      errorDeletingCourse: 'خطأ في حذف الدورة',
      courseDeleted: 'تم حذف الدورة',
      errorLoadingStudents: 'خطأ في تحميل الطلاب',
      errorDeletingStudent: 'خطأ في حذف الطالب',
      studentDeleted: 'تم حذف الطالب',
      thisSubject: 'هذه المادة',
      thisGrade: 'هذا المستوى',
      thisCourse: 'هذه الدورة',
      thisStudent: 'هذا الطالب',
      selectSeries: 'اختر سلسلة',
    },
  };

  const t = (key: TranslationKeys) => translations[lang][key];

  return [lang, changeLang, t];
}

export default LangSwitcher;
