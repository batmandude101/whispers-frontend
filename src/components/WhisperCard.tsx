// components/WhisperCard.tsx - Updated with unified theme
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  useTheme
} from '@mui/material';
import { Whisper, EMOTIONS } from '../types';
import { getEmotionColor, getEmotionBackground } from '../theme';
import { useTheme as useCustomTheme } from './contexts/ThemeContext';

interface WhisperCardProps {
  whisper: Whisper;
  onWhisperClick: (id: number) => void;
  formatTimeAgo: (dateString: string) => string;
}

const WhisperCard: React.FC<WhisperCardProps> = ({
  whisper,
  onWhisperClick,
  formatTimeAgo
}) => {
  const muiTheme = useTheme();
  const { isDark } = useCustomTheme();
  const emotion = EMOTIONS[whisper.emotion];
  const emotionColor = getEmotionColor(whisper.emotion);
  const emotionBg = getEmotionBackground(whisper.emotion, isDark);
  
  return (
    <Card
      sx={{
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${emotionColor}`,
        background: muiTheme.palette.background.paper,
        // Override default hover styles with theme-aware ones
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDark 
            ? '0 8px 32px rgba(255, 255, 255, 0.05)'
            : '0 8px 32px rgba(0, 0, 0, 0.15)',
          backgroundColor: emotionBg,
        },
      }}
      onClick={() => onWhisperClick(whisper.id)}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with emotion and time */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Typography
            component="span"
            sx={{
              fontSize: '1.2rem',
              lineHeight: 1,
            }}
          >
            {emotion.emoji}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: muiTheme.palette.text.secondary,
              fontSize: '0.85rem',
              fontWeight: 400,
            }}
          >
            {formatTimeAgo(whisper.createdAt)}
          </Typography>
        </Stack>

        {/* The whisper text */}
        <Typography
          variant="body1"
          sx={{
            color: muiTheme.palette.text.primary,
            fontSize: '1rem',
            lineHeight: 1.5,
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontWeight: 400,
            mb: 2,
            letterSpacing: '0.01em',
            fontStyle: 'normal',
          }}
        >
          {whisper.text}
        </Typography>

        {/* Footer */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="caption"
            sx={{
              color: emotionColor,
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'lowercase',
            }}
          >
            {emotion.label}
          </Typography>
          
          <Typography
            variant="caption"
            sx={{
              color: muiTheme.palette.text.disabled,
              fontSize: '0.7rem',
              opacity: 0.6,
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 1,
                color: muiTheme.palette.text.secondary
              }
            }}
          >
            nearby
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WhisperCard;