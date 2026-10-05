export const API_URL = 
  process.env.NODE_ENV === 'production'
    ? 'https://aplicativo-miccional-production.up.railway.app'
    : 'http://localhost:5000';