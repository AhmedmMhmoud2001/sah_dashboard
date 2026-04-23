import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  ar: {
    // General
    'app.name': 'SAH Academy',
    'app.dashboard': 'لوحة التحكم',
    
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.users': 'المستخدمون',
    'nav.courses': 'الكورسات',
    'nav.videos': 'الفيديوهات',
    'nav.questions': 'الأسئلة',
    'nav.reports': 'التقارير',
    'nav.subscriptions': 'الاشتراكات',
    'nav.orders': 'الطلبات',
    'nav.coupons': 'الكوبونات',
    'nav.rbac': 'الصلاحيات',
    'nav.about': 'من نحن',
    'nav.contact': 'تواصل معنا',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',
    'nav.logout': 'تسجيل الخروج',
    'nav.home': 'الرئيسية',
    'nav.myCourses': 'كورساتي',
    'nav.allCourses': 'كل الكورسات',
    'nav.admin': 'مدير',
    'nav.user': 'مستخدم',
    
    // Menu Groups
    'groups.main': 'الرئيسية',
    'groups.content': 'المحتوى',
    'groups.finance': 'المالية',
    'groups.analytics': 'التحليلات',
    'groups.support': 'الدعم',
    
    // Dashboard Stats
    'stats.totalUsers': 'إجمالي المستخدمين',
    'stats.totalCourses': 'إجمالي الكورسات',
    'stats.totalEnrollments': 'إجمالي الاشتراكات',
    'stats.revenue': 'الإيرادات',
    'stats.completionRate': 'معدل الإكمال',
    'stats.recentUsers': 'أحدث المستخدمين',
    
    // Users
    'users.title': 'إدارة المستخدمين',
    'users.add': 'إضافة مستخدم',
    'users.edit': 'تعديل المستخدم',
    'users.delete': 'حذف المستخدم',
    'users.name': 'الاسم',
    'users.email': 'البريد الإلكتروني',
    'users.role': 'الدور',
    'users.status': 'الحالة',
    'users.created': 'تاريخ التسجيل',
    
    // Courses
    'courses.title': 'إدارة الكورسات',
    'courses.add': 'إضافة كورس',
    'courses.edit': 'تعديل الكورس',
    'courses.delete': 'حذف الكورس',
    'courses.price': 'السعر',
    'courses.duration': 'المدة',
    'courses.level': 'المستوى',
    
    // Subscriptions
    'subs.title': 'الاشتراكات',
    'subs.user': 'المستخدم',
    'subs.course': 'الكورس',
    'subs.startDate': 'تاريخ البداية',
    'subs.endDate': 'تاريخ النهاية',
    'subs.status': 'الحالة',
    'subs.progress': 'التقدم',
    'subs.active': 'نشط',
    'subs.completed': 'مكتمل',
    'subs.expired': 'منتهي',
    
    // Actions
    'actions.save': 'حفظ',
    'actions.cancel': 'إلغاء',
    'actions.edit': 'تعديل',
    'actions.delete': 'حذف',
    'actions.add': 'إضافة',
    'actions.search': 'بحث',
    'actions.export': 'تصدير',
    'actions.filter': 'تصفية',
    
    // Messages
    'msg.loading': 'جاري التحميل...',
    'msg.noData': 'لا توجد بيانات',
    'msg.success': 'تم بنجاح',
    'msg.error': 'حدث خطأ',
    'msg.confirm': 'تأكيد',
    'msg.confirmDelete': 'هل أنت متأكد من الحذف؟',
    
    // About
    'about.title': 'من نحن',
    'about.description': 'منصة SAH Academy هي منصة تعليمية متخصصة في مجال المحاسبة وإدارة أنظمة Odoo',
    'about.mission': 'مهمتنا تقديم تعليم عالي الجودة لجميع الراغبين في تعلم المحاسبة وإدارة الأعمال',
    'about.vision': 'رؤيتنا أن نكون المنصة التعليمية الأولى في المنطقة العربية',
    
    // Contact
    'contact.title': 'تواصل معنا',
    'contact.name': 'الاسم',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال',
    'contact.info': 'معلومات التواصل',
    
    // Theme
    'theme.light': 'الوضع النهاري',
    'theme.dark': 'الوضع الليلي',
    
    // Language
    'lang.ar': 'العربية',
    'lang.en': 'English',
  },
  en: {
    // General
    'app.name': 'SAH Academy',
    'app.dashboard': 'Dashboard',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.users': 'Users',
    'nav.courses': 'Courses',
    'nav.videos': 'Videos',
    'nav.questions': 'Questions',
    'nav.reports': 'Reports',
    'nav.subscriptions': 'Subscriptions',
    'nav.orders': 'Orders',
    'nav.coupons': 'Coupons',
    'nav.rbac': 'Access Control',
    'nav.about': 'About Us',
    'nav.contact': 'Contact Us',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.home': 'Home',
    'nav.myCourses': 'My Courses',
    'nav.allCourses': 'All Courses',
    
    // Dashboard Stats
    'stats.totalUsers': 'Total Users',
    'stats.totalCourses': 'Total Courses',
    'stats.totalEnrollments': 'Total Enrollments',
    'stats.revenue': 'Revenue',
    'stats.completionRate': 'Completion Rate',
    'stats.recentUsers': 'Recent Users',
    
    // Users
    'users.title': 'User Management',
    'users.add': 'Add User',
    'users.edit': 'Edit User',
    'users.delete': 'Delete User',
    'users.name': 'Name',
    'users.email': 'Email',
    'users.role': 'Role',
    'users.status': 'Status',
    'users.created': 'Created',
    
    // Courses
    'courses.title': 'Course Management',
    'courses.add': 'Add Course',
    'courses.edit': 'Edit Course',
    'courses.delete': 'Delete Course',
    'courses.price': 'Price',
    'courses.duration': 'Duration',
    'courses.level': 'Level',
    
    // Subscriptions
    'subs.title': 'Subscriptions',
    'subs.user': 'User',
    'subs.course': 'Course',
    'subs.startDate': 'Start Date',
    'subs.endDate': 'End Date',
    'subs.status': 'Status',
    'subs.progress': 'Progress',
    'subs.active': 'Active',
    'subs.completed': 'Completed',
    'subs.expired': 'Expired',
    
    // Actions
    'actions.save': 'Save',
    'actions.cancel': 'Cancel',
    'actions.edit': 'Edit',
    'actions.delete': 'Delete',
    'actions.add': 'Add',
    'actions.search': 'Search',
    'actions.export': 'Export',
    'actions.filter': 'Filter',
    
    // Messages
    'msg.loading': 'Loading...',
    'msg.noData': 'No data available',
    'msg.success': 'Success',
    'msg.error': 'An error occurred',
    'msg.confirm': 'Confirm',
    'msg.confirmDelete': 'Are you sure you want to delete?',
    
    // About
    'about.title': 'About Us',
    'about.description': 'SAH Academy is an educational platform specialized in accounting and Odoo ERP systems',
    'about.mission': 'Our mission is to provide high-quality education for everyone wanting to learn accounting and business management',
    'about.vision': 'Our vision is to be the first educational platform in the Arab region',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send',
    'contact.info': 'Contact Info',
    
    // Theme
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    
    // Language
    'lang.ar': 'العربية',
    'lang.en': 'English',
    'nav.admin': 'Admin',
    'nav.user': 'User',

    // Menu Groups
    'groups.main': 'Main',
    'groups.content': 'Content',
    'groups.finance': 'Finance',
    'groups.analytics': 'Analytics',
    'groups.support': 'Support',
  }
}

const I18nContext = createContext()

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lang') || 'ar'
    }
    return 'ar'
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const t = (key) => {
    return translations[lang]?.[key] || translations.ar[key] || key
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL: lang === 'ar' }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}