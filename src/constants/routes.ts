export const APP_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  learning: '/learning',
  profile: '/profile',
  admin: {
    login: '/admin/login',
    dashboard: '/admin/dashboard',
  },
} as const;
