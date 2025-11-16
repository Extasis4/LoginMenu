export const API_CONFIG = {
  baseUrl: 'https://api.childfound.online/api',
  endpoints: {
    users: '/users',
    businesses: '/businesses',
    auth: '/auth',
    rubros: '/rubros',
    modules: '/modules'
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100
  }
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};