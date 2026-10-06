export const APP_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  learning: '/learning',
  progress: '/learning/progress',
  profile: '/profile',
  moderator: {
    login: '/moderator/login',
    dashboard: '/moderator/dashboard',
  },
} as const;
