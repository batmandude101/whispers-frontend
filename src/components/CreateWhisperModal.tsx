import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  LinearProgress,
  Alert,
  IconButton,
  Fade,
  Avatar,
  Stack,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { Emotion, EMOTIONS, Location } from '../types';
import { getEmotionColor, getEmotionBackground } from '../theme';
import { useTheme as useCustomTheme } from './contexts/ThemeContext';
import { API_ENDPOINTS, DEFAULT_FETCH_OPTIONS } from '../api/api';

interface CreateWhisperModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: Location | null;
  onWhisperCreated: () => void;
}

const CreateWhisperModal: React.FC<CreateWhisperModalProps> = ({
  isOpen,
  onClose,
  userLocation,
  onWhisperCreated
}) => {
  const [text, setText] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>('MELANCHOLY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Theme hooks
  const muiTheme = useTheme();
  const { isDark } = useCustomTheme();

  const maxLength = 300;
  const remainingChars = maxLength - text.length;
  const progressValue = ((maxLength - remainingChars) / maxLength) * 100;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!text.trim()) {
    setError('Please write something...');
    return;
  }

  if (!userLocation) {
    setError('Location not available. Please allow location access.');
    return;
  }

  if (text.length > maxLength) {
    setError(`Message too long. Maximum ${maxLength} characters.`);
    return;
  }

  try {
    setIsSubmitting(true);
    setError(null);

    const whisperData = {
      text: text.trim(),
      emotion: EMOTIONS[selectedEmotion].value,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude
    };

    const response = await fetch(API_ENDPOINTS.whispers, {
      method: 'POST',
      ...DEFAULT_FETCH_OPTIONS,
      body: JSON.stringify(whisperData)
    });

    if (!response.ok) {
      throw new Error('Failed to create whisper');
    }

    setText('');
    setSelectedEmotion('MELANCHOLY');
    onClose();
    onWhisperCreated();
    
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to create whisper');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleClose = () => {
    if (!isSubmitting) {
      setText('');
      setSelectedEmotion('MELANCHOLY');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundImage: 'none',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography 
            variant="h5" 
            component="h2" 
            fontWeight="bold"
            sx={{ color: muiTheme.palette.text.primary }}
          >
            ✨ Share a Whisper
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={isSubmitting}
            size="small"
            sx={{ color: muiTheme.palette.text.secondary }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          <Box mb={3}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              fontWeight="medium" 
              sx={{ color: muiTheme.palette.text.primary }}
            >
              How are you feeling?
            </Typography>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              {Object.entries(EMOTIONS).map(([key, emotion]) => {
                const isSelected = selectedEmotion === key;
                const emotionColor = getEmotionColor(key);
                const emotionBg = getEmotionBackground(key, isDark);
                
                return (
                  <Card
                    key={key}
                    sx={{
                      border: isSelected 
                        ? `2px solid ${emotionColor}` 
                        : `1px solid ${muiTheme.palette.divider}`,
                      bgcolor: isSelected 
                        ? emotionBg
                        : muiTheme.palette.background.paper,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: emotionBg,
                        borderColor: emotionColor
                      }
                    }}
                  >
                    <CardActionArea
                      onClick={() => setSelectedEmotion(key as Emotion)}
                      sx={{ p: 2 }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar 
                          sx={{ 
                            bgcolor: emotionColor,
                            width: 32,
                            height: 32,
                            border: '2px solid #ffffff'
                          }}
                        >
                          <Typography variant="body2">{emotion.emoji}</Typography>
                        </Avatar>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="medium"
                          sx={{ 
                            color: isSelected ? emotionColor : muiTheme.palette.text.primary,
                            textTransform: 'lowercase'
                          }}
                        >
                          {emotion.label}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Box>
          </Box>

          {/* Text Input */}
          <Box mb={3}>
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              fontWeight="medium" 
              sx={{ color: muiTheme.palette.text.primary }}
            >
              What's on your mind?
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Say what you can't out loud..."
              variant="outlined"
              inputProps={{ maxLength }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            {/* Character Counter with Progress */}
            <Box mt={1} display="flex" alignItems="center" justifyContent="space-between">
              <Box flex={1} mr={2}>
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: remainingChars < 50 
                        ? muiTheme.palette.warning.main 
                        : muiTheme.palette.success.main,
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
              <Typography 
                variant="caption" 
                color={remainingChars < 50 ? 'warning.main' : 'text.secondary'}
                fontWeight="medium"
              >
                {remainingChars} left
              </Typography>
            </Box>
          </Box>

          {/* Location Info */}
          {userLocation && (
            <Box mb={3}>
              <Card sx={{ 
                bgcolor: isDark 
                  ? 'rgba(59, 130, 246, 0.1)' 
                  : 'rgba(59, 130, 246, 0.05)', 
                border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}` 
              }}>
                <CardContent sx={{ py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationIcon fontSize="small" color="primary" />
                    <Typography 
                      variant="body2" 
                      color="primary"
                      sx={{ fontSize: '0.875rem' }}
                    >
                      Whisper will be shared at your current location
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Error Message */}
          {error && (
            <Fade in={!!error}>
              <Box mb={2}>
                <Alert severity="error" variant="outlined">
                  {error}
                </Alert>
              </Box>
            </Fade>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            variant="outlined"
            size='medium'
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !text.trim() || !userLocation}
            variant="contained"
            size="large"
            endIcon={isSubmitting ? undefined : <SendIcon />}
            sx={{ 
              borderRadius: 2, 
              minWidth: 140,
              background: isDark 
                ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              '&:hover': {
                background: isDark 
                  ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                  : 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              }
            }}
          >
            {isSubmitting ? (
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
                Sharing...
              </Box>
            ) : (
              'Share Whisper'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateWhisperModal;