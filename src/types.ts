// Emotion types matching backend enum
export type Emotion = 'MELANCHOLY' | 'JOY' | 'ANXIETY' | 'PEACE';

// Whisper interface matching backend entity
export interface Whisper {
  id: number;
  text: string;
  emotion: Emotion;
  latitude: number;
  longitude: number;
  createdAt: string; // ISO date string
}

// Request payload for creating whispers
export interface CreateWhisperRequest {
  text: string;
  emotion: string; // lowercase string version
  latitude: number;
  longitude: number;
}

// Emotion metadata for UI
export interface EmotionMeta {
  value: string;
  emoji: string;
  color: string;
  label: string;
}

// Emotion mapping for frontend
export const EMOTIONS: Record<Emotion, EmotionMeta> = {
  MELANCHOLY: {
    value: 'melancholy',
    emoji: '😔',
    color: '#6366F1',
    label: 'Melancholy'
  },
  JOY: {
    value: 'joy',
    emoji: '😊',
    color: '#F59E0B',
    label: 'Joy'
  },
  ANXIETY: {
    value: 'anxiety',
    emoji: '😰',
    color: '#EF4444',
    label: 'Anxiety'
  },
  PEACE: {
    value: 'peace',
    emoji: '😌',
    color: '#10B981',
    label: 'Peace'
  }
};

// Location interface
export interface Location {
  latitude: number;
  longitude: number;
}