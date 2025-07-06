import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Fade,
  Typography,
  Stack,
  Chip,
  useTheme
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Whisper, EMOTIONS } from '../types';
import { getEmotionColor, getEmotionBackground } from '../theme';
import { useTheme as useCustomTheme } from './contexts/ThemeContext';

interface EmotionFilterProps {
  whispers: Whisper[];
  selectedEmotion: string | null;
  onEmotionChange: (emotion: string | null) => void;
  position?: 'top-right' | 'top-left';
  variant?: 'panel' | 'chips';
}

const EmotionFilter: React.FC<EmotionFilterProps> = ({
  whispers,
  selectedEmotion,
  onEmotionChange,
  position = 'top-right',
  variant = 'panel'
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const muiTheme = useTheme();
  const { isDark } = useCustomTheme();

  const getEmotionCount = (emotionKey: string) => {
    return whispers.filter(w => w.emotion === emotionKey).length;
  };

  const handleEmotionFilter = (emotion: string) => {
    const newEmotion = selectedEmotion === emotion ? null : emotion;
    onEmotionChange(newEmotion);
    if (variant === 'panel') {
      setShowFilters(false);
    }
  };

  const totalFiltered = selectedEmotion 
    ? whispers.filter(w => w.emotion === selectedEmotion).length
    : whispers.length;

  // Chips variant for feed view
  if (variant === 'chips') {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ 
          color: muiTheme.palette.text.primary, 
          fontSize: '0.9rem', 
          fontWeight: 500, 
          mb: 2 
        }}>
          Filter by emotion ({totalFiltered} whispers)
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          <Chip
            label={`All (${whispers.length})`}
            onClick={() => onEmotionChange(null)}
            variant={selectedEmotion === null ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: selectedEmotion === null 
                ? muiTheme.palette.primary.main 
                : 'transparent',
              color: selectedEmotion === null 
                ? muiTheme.palette.primary.contrastText 
                : muiTheme.palette.text.primary,
              borderColor: muiTheme.palette.divider,
              '&:hover': {
                backgroundColor: selectedEmotion === null 
                  ? muiTheme.palette.primary.dark 
                  : muiTheme.palette.action.hover,
              }
            }}
          />
          {Object.entries(EMOTIONS).map(([key, emotion]) => {
            const count = getEmotionCount(key);
            const isSelected = selectedEmotion === key;
            const emotionColor = getEmotionColor(key);
            
            return (
              <Chip
                key={key}
                label={`${emotion.emoji} ${emotion.label} (${count})`}
                onClick={() => handleEmotionFilter(key)}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: isSelected ? emotionColor : 'transparent',
                  color: isSelected ? '#000000' : muiTheme.palette.text.primary,
                  borderColor: isSelected ? emotionColor : muiTheme.palette.divider,
                  textTransform: 'lowercase',
                  '&:hover': {
                    backgroundColor: isSelected 
                      ? emotionColor 
                      : getEmotionBackground(key, isDark),
                    borderColor: emotionColor
                  }
                }}
              />
            );
          })}
        </Stack>
      </Box>
    );
  }

  // Panel variant for map view - NOW THEME-AWARE!
  const positionStyles = {
    'top-right': { top: 80, right: 16 },
    'top-left': { top: 80, left: 16 }
  };

  return (
    <>
      {/* Filter Toggle Button - Theme-aware */}
      <Box
        sx={{
          position: 'absolute',
          ...positionStyles[position],
          zIndex: 1000
        }}
      >
        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          sx={{
            backgroundColor: isDark 
              ? 'rgba(0, 0, 0, 0.9)' 
              : 'rgba(255, 255, 255, 0.95)',
            color: muiTheme.palette.text.primary,
            border: `1px solid ${muiTheme.palette.divider}`,
            backdropFilter: 'blur(10px)',
            width: 48,
            height: 48,
            '&:hover': {
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <FilterIcon />
        </IconButton>
      </Box>

      {/* Filter Panel - Theme-aware */}
      <Fade in={showFilters}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: showFilters ? 0 : '-300px',
            width: 280,
            height: '100%',
            backgroundColor: isDark 
              ? 'rgba(0, 0, 0, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            borderLeft: `1px solid ${muiTheme.palette.divider}`,
            backdropFilter: 'blur(20px)',
            transition: 'right 0.3s ease-in-out',
            zIndex: 999,
            p: 3,
            display: showFilters ? 'block' : 'none'
          }}
        >
          {/* Filter Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 3 
          }}>
            <Typography sx={{ 
              color: muiTheme.palette.text.primary, 
              fontSize: '1.1rem', 
              fontWeight: 600 
            }}>
              Filter by Emotion
            </Typography>
            <IconButton
              onClick={() => setShowFilters(false)}
              sx={{ color: muiTheme.palette.text.secondary, p: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Current Filter Status - Theme-aware */}
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            borderRadius: 2, 
            bgcolor: muiTheme.palette.action.hover 
          }}>
            <Typography sx={{ 
              color: muiTheme.palette.text.primary, 
              fontSize: '0.85rem', 
              fontWeight: 500 
            }}>
              Showing {totalFiltered} of {whispers.length} whispers
            </Typography>
            {selectedEmotion && (
              <Typography sx={{ 
                color: getEmotionColor(selectedEmotion), 
                fontSize: '0.75rem',
                textTransform: 'lowercase'
              }}>
                Filtered by {EMOTIONS[selectedEmotion as keyof typeof EMOTIONS]?.label}
              </Typography>
            )}
          </Box>

          {/* Emotion List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* All emotions option - Theme-aware */}
            <Box
              onClick={() => {
                onEmotionChange(null);
                setShowFilters(false);
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: selectedEmotion === null 
                  ? (isDark ? muiTheme.palette.primary.main + '20' : muiTheme.palette.primary.main + '10')
                  : muiTheme.palette.action.hover,
                border: selectedEmotion === null 
                  ? `1px solid ${muiTheme.palette.primary.main}` 
                  : `1px solid ${muiTheme.palette.divider}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: muiTheme.palette.action.hover,
                  borderColor: muiTheme.palette.primary.main,
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: muiTheme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  border: `2px solid ${isDark ? '#ffffff' : '#000000'}`
                }}
              >
                🌟
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ 
                  color: selectedEmotion === null 
                    ? muiTheme.palette.primary.main 
                    : muiTheme.palette.text.primary, 
                  fontSize: '0.9rem', 
                  fontWeight: selectedEmotion === null ? 600 : 500,
                  textTransform: 'lowercase'
                }}>
                  All emotions
                </Typography>
                <Typography sx={{ 
                  color: muiTheme.palette.text.secondary, 
                  fontSize: '0.75rem' 
                }}>
                  {whispers.length} nearby
                </Typography>
              </Box>
              {selectedEmotion === null && (
                <Box sx={{ color: muiTheme.palette.primary.main, fontSize: '0.8rem' }}>
                  ✓
                </Box>
              )}
            </Box>

            {/* Individual emotions - Theme-aware */}
            {Object.entries(EMOTIONS).map(([key, emotion]) => {
              const count = getEmotionCount(key);
              const isSelected = selectedEmotion === key;
              const emotionColor = getEmotionColor(key);
              const emotionBg = getEmotionBackground(key, isDark);
              
              return (
                <Box
                  key={key}
                  onClick={() => handleEmotionFilter(key)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: isSelected 
                      ? emotionBg
                      : muiTheme.palette.action.hover,
                    border: isSelected 
                      ? `1px solid ${emotionColor}` 
                      : `1px solid ${muiTheme.palette.divider}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: emotionBg,
                      borderColor: emotionColor,
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: emotionColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      border: `2px solid ${isDark ? '#ffffff' : '#000000'}`
                    }}
                  >
                    {emotion.emoji}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ 
                      color: isSelected ? emotionColor : muiTheme.palette.text.primary, 
                      fontSize: '0.9rem', 
                      fontWeight: isSelected ? 600 : 500,
                      textTransform: 'lowercase'
                    }}>
                      {emotion.label}
                    </Typography>
                    <Typography sx={{ 
                      color: muiTheme.palette.text.secondary, 
                      fontSize: '0.75rem' 
                    }}>
                      {count} nearby
                    </Typography>
                  </Box>
                  {isSelected && (
                    <Box sx={{ color: emotionColor, fontSize: '0.8rem' }}>
                      ✓
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Quick Actions - Theme-aware */}
          <Box sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: `1px solid ${muiTheme.palette.divider}` 
          }}>
            <Typography sx={{ 
              color: muiTheme.palette.text.primary, 
              fontSize: '0.9rem', 
              fontWeight: 500, 
              mb: 2 
            }}>
              Quick Actions
            </Typography>
            <Box
              onClick={() => {
                onEmotionChange(null);
                setShowFilters(false);
              }}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: muiTheme.palette.action.hover,
                border: `1px solid ${muiTheme.palette.divider}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: muiTheme.palette.action.selected
                }
              }}
            >
              <Typography sx={{ 
                color: muiTheme.palette.text.primary, 
                fontSize: '0.85rem' 
              }}>
                🔍 Show all emotions
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      {/* Overlay when filters are open */}
      {showFilters && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: '280px',
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998
          }}
          onClick={() => setShowFilters(false)}
        />
      )}
    </>
  );
};

export default EmotionFilter;