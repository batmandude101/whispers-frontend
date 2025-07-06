export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  whispers: `${API_BASE_URL}/api/whispers`,
  feed: (lat: number, lng: number, emotion?: string) => {
    const emotionParam = emotion ? `&emotion=${emotion}` : '';
    return `${API_BASE_URL}/api/whispers/feed?lat=${lat}&lng=${lng}${emotionParam}`;
  },
  whisperById: (id: number) => `${API_BASE_URL}/api/whispers/${id}`,
};

export const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  }
};