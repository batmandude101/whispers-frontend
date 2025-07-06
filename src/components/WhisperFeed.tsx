import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Container,
  CircularProgress,
  Button,
  Stack,
  Fab,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  ViewList as ViewListIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { Whisper, Location, EMOTIONS } from '../types';
import { getEmotionColor } from '../theme';
import { useTheme as useCustomTheme } from './contexts/ThemeContext';
import CreateWhisperModal from './CreateWhisperModal';
import WhisperCard from './WhisperCard';
import WhisperMapView from './WhisperMapView';
import EmotionFilter from './EmotionFilter';
import ThemeToggle from './themeToggle';
import { API_ENDPOINTS, DEFAULT_FETCH_OPTIONS } from '../api/api';

type ViewMode = 'feed' | 'map';

const WhisperFeed: React.FC = () => {
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('feed');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const muiTheme = useTheme();
  const { isDark } = useCustomTheme();

  const filteredWhispers = selectedEmotion
    ? whispers.filter(w => w.emotion === selectedEmotion)
    : whispers;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({
            latitude: 40.7128,
            longitude: -74.0060
          });
        }
      );
    } else {
      setUserLocation({
        latitude: 40.7128,
        longitude: -74.0060
      });
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchWhispers();
    }
  }, [userLocation]);

  const fetchWhispers = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      
      const response = await fetch(
        API_ENDPOINTS.feed(userLocation.latitude, userLocation.longitude),
        {
          method: 'GET',
          ...DEFAULT_FETCH_OPTIONS
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch whispers: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        setWhispers([]);
        return;
      }
      
      const data: Whisper[] = JSON.parse(text);
      setWhispers(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Refetch when view mode changes (for different radius)
  useEffect(() => {
    if (userLocation) {
      fetchWhispers();
    }
  }, [viewMode]);

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const whisperTime = new Date(dateString);
    const diffMs = now.getTime() - whisperTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const handleWhisperClick = (whisperId: number) => {
    navigate(`/whisper/${whisperId}`);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleWhisperCreated = () => {
    fetchWhispers();
  };

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode,
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: muiTheme.palette.background.default 
      }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <Box
              component="h1"
              sx={{
                margin: 0,
                padding: 0,
                color: muiTheme.palette.text.primary,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 700,
                fontSize: '1.35rem',
                letterSpacing: '-0.02em',
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>🌙</span>
              Whispers Near Me
            </Box>
            <ThemeToggle />
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <CircularProgress 
              size={40} 
              thickness={4} 
              sx={{ 
                mb: 3, 
                color: muiTheme.palette.primary.main 
              }} 
            />
            <Typography sx={{ 
              color: muiTheme.palette.text.secondary, 
              fontSize: '1rem' 
            }}>
              Loading whispers...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: muiTheme.palette.background.default 
      }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <Box
              component="h1"
              sx={{
                margin: 0,
                padding: 0,
                color: muiTheme.palette.text.primary,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 700,
                fontSize: '1.35rem',
                letterSpacing: '-0.02em',
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>🌙</span>
              Whispers Near Me
            </Box>
            <ThemeToggle />
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography sx={{ fontSize: '4rem', mb: 2 }}>😞</Typography>
            <Typography sx={{ 
              color: muiTheme.palette.text.secondary, 
              mb: 4, 
              textAlign: 'center' 
            }}>
              {error}
            </Typography>
            <Button 
              onClick={fetchWhispers}
              variant="contained"
              sx={{ px: 3, py: 1 }}
            >
              Try Again
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  // Main content
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: muiTheme.palette.background.default, 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Header - Theme-aware */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Box
            component="h1"
            sx={{
              margin: 0,
              padding: 0,
              color: muiTheme.palette.text.primary,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: '1.35rem',
              letterSpacing: '-0.02em',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🌙</span>
            Whispers Near Me
          </Box>

          <Stack direction="row" alignItems="center" spacing={2}>
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Whisper Count - Theme-aware */}
            <Box
              sx={{
                backgroundColor: muiTheme.palette.action.hover,
                color: muiTheme.palette.text.secondary,
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.8rem',
                fontWeight: 500,
                border: `1px solid ${muiTheme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {filteredWhispers.length} nearby
              {selectedEmotion && (
                <Typography component="span" sx={{ 
                  color: getEmotionColor(selectedEmotion),
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}>
                  ({EMOTIONS[selectedEmotion as keyof typeof EMOTIONS]?.label})
                </Typography>
              )}
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        {viewMode === 'feed' ? (
          /* Feed View */
          <Container maxWidth="md" sx={{ py: 3, height: '100%' }}>
            {whispers.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Typography sx={{ fontSize: '4rem', mb: 3 }}>🤫</Typography>
                <Typography sx={{ 
                  fontSize: '1.5rem', 
                  color: muiTheme.palette.text.primary, 
                  fontWeight: 500, 
                  mb: 2 
                }}>
                  It's quiet around here...
                </Typography>
                <Typography sx={{ 
                  color: muiTheme.palette.text.secondary, 
                  mb: 4, 
                  maxWidth: 400, 
                  mx: 'auto' 
                }}>
                  Be the first to share your thoughts with this place. 
                  Your whisper could brighten someone's day.
                </Typography>
                <Button
                  onClick={handleCreateClick}
                  variant="contained"
                  sx={{ px: 3, py: 1.5 }}
                >
                  ✨ Share First Whisper
                </Button>
              </Box>
            ) : (
              <>
                {/* Emotion Filter - Chips variant for feed */}
                <EmotionFilter
                  whispers={whispers}
                  selectedEmotion={selectedEmotion}
                  onEmotionChange={setSelectedEmotion}
                  variant="chips"
                />

                {/* Whisper Cards - Show filtered whispers */}
                {filteredWhispers.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Typography sx={{ fontSize: '3rem', mb: 3 }}>🔍</Typography>
                    <Typography sx={{ 
                      fontSize: '1.3rem', 
                      color: muiTheme.palette.text.primary, 
                      fontWeight: 500, 
                      mb: 2 
                    }}>
                      No {EMOTIONS[selectedEmotion as keyof typeof EMOTIONS]?.label.toLowerCase()} whispers nearby
                    </Typography>
                    <Typography sx={{ 
                      color: muiTheme.palette.text.secondary, 
                      mb: 4, 
                      maxWidth: 400, 
                      mx: 'auto' 
                    }}>
                      Try a different emotion or be the first to share a {EMOTIONS[selectedEmotion as keyof typeof EMOTIONS]?.label.toLowerCase()} whisper here.
                    </Typography>
                    <Button
                      onClick={handleCreateClick}
                      variant="contained"
                      sx={{ px: 3, py: 1.5 }}
                    >
                      ✨ Share Whisper
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {filteredWhispers.map((whisper, index) => (
                      <Box
                        key={whisper.id}
                        sx={{
                          opacity: 0,
                          animation: 'fadeInUp 0.6s ease-out forwards',
                          animationDelay: `${index * 100}ms`,
                          '@keyframes fadeInUp': {
                            '0%': {
                              opacity: 0,
                              transform: 'translateY(20px)'
                            },
                            '100%': {
                              opacity: 1,
                              transform: 'translateY(0)'
                            }
                          }
                        }}
                      >
                        <WhisperCard
                          whisper={whisper}
                          onWhisperClick={handleWhisperClick}
                          formatTimeAgo={formatTimeAgo}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </>
            )}
          </Container>
        ) : (
          /* Map View */
          <WhisperMapView
            whispers={filteredWhispers}
            userLocation={userLocation}
            onWhisperClick={handleWhisperClick}
            formatTimeAgo={formatTimeAgo}
            selectedEmotion={selectedEmotion}
            onEmotionChange={setSelectedEmotion}
          />
        )}
      </Box>

      {/* Floating View Toggle - Bottom Center - Theme-aware */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 90,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000
        }}
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          sx={{
            backgroundColor: isDark 
              ? 'rgba(0, 0, 0, 0.9)' 
              : 'rgba(255, 255, 255, 0.95)',
            borderRadius: 3,
            border: `1px solid ${muiTheme.palette.divider}`,
            backdropFilter: 'blur(20px)',
            boxShadow: isDark 
              ? '0 8px 32px rgba(0, 0, 0, 0.8)' 
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <ToggleButton value="feed">
            <ViewListIcon fontSize="small" sx={{ mr: 1 }} />
            Feed
          </ToggleButton>
          <ToggleButton value="map">
            <MapIcon fontSize="small" sx={{ mr: 1 }} />
            Map
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Floating Create Button - Theme-aware shadow */}
      <Fab
        onClick={handleCreateClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          fontSize: '1.5rem',
          boxShadow: isDark 
            ? '0 8px 32px rgba(255, 255, 255, 0.1)' 
            : '0 8px 32px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: isDark 
              ? '0 12px 40px rgba(255, 255, 255, 0.15)' 
              : '0 12px 40px rgba(0, 0, 0, 0.25)',
          }
        }}
      >
        <AddIcon fontSize="large" />
      </Fab>

      {/* Create Whisper Modal */}
      <CreateWhisperModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        userLocation={userLocation}
        onWhisperCreated={handleWhisperCreated}
      />
    </Box>
  );
};

export default WhisperFeed;