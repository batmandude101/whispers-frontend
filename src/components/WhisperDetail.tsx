import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  Container,
  CircularProgress,
  Button,
  Stack,
  IconButton,
  useTheme,
  Chip,
  Fade,
  Tooltip,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import L from 'leaflet';
import { Whisper, EMOTIONS } from '../types';
import { getEmotionColor, getEmotionBackground } from '../theme';
import { useTheme as useCustomTheme } from './contexts/ThemeContext';
import ThemeToggle from './themeToggle';
import { API_ENDPOINTS, DEFAULT_FETCH_OPTIONS } from '../api/api';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WhisperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [whisper, setWhisper] = useState<Whisper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [views, setViews] = useState(Math.floor(Math.random() * 50) + 1); 
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Theme hooks
  const muiTheme = useTheme();
  const { isDark } = useCustomTheme();

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback to NYC
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchWhisper(id);
    }
  }, [id]);

  // Initialize map when whisper is loaded
  useEffect(() => {
    if (whisper && mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([whisper.latitude, whisper.longitude], 15);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);

      // Add whisper marker
      const emotion = EMOTIONS[whisper.emotion];
      const emotionColor = getEmotionColor(whisper.emotion);
      
      const whisperIcon = L.divIcon({
        html: `
          <div style="
            background: ${emotionColor};
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          ">
            ${emotion.emoji}
          </div>
        `,
        className: 'whisper-marker-detail',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([whisper.latitude, whisper.longitude], {
        icon: whisperIcon
      }).addTo(map);

      // Add user location if available
      if (userLocation) {
        L.marker([userLocation.lat, userLocation.lng])
          .addTo(map)
          .bindPopup('📍 You are here');
      }

      mapInstanceRef.current = map;
    }
  }, [whisper, userLocation]);

  // Cleanup map
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

const fetchWhisper = async (whisperId: string) => {
  try {
    setLoading(true);
    const response = await fetch(API_ENDPOINTS.whisperById(parseInt(whisperId)), {
      method: 'GET',
      ...DEFAULT_FETCH_OPTIONS
    });
   
    if (!response.ok) {
      throw new Error('Whisper not found');
    }
   
    const data: Whisper = await response.json();
    setWhisper(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
  } finally {
    setLoading(false);
  }
};

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const whisperTime = new Date(dateString);
    const diffMs = now.getTime() - whisperTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  };

  const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDistanceText = (whisper: Whisper): string => {
    if (!userLocation) return "Location unknown";
    
    const distance = calculateDistance(userLocation.lat, userLocation.lng, whisper.latitude, whisper.longitude);
    
    if (distance < 0.1) return "Right here";
    if (distance < 1) return `${Math.round(distance * 1000)}m from you`;
    return `${distance.toFixed(1)}km from you`;
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Whisper',
          text: `"${whisper?.text}" - A whisper from ${whisper ? getDistanceText(whisper) : 'somewhere'}`,
          url: url
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: muiTheme.palette.background.default }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => navigate('/')}
              sx={{ mr: 2, color: muiTheme.palette.text.primary }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{
              color: muiTheme.palette.text.primary,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: '1.35rem',
              letterSpacing: '-0.02em',
              flexGrow: 1
            }}>
              Back to whispers
            </Typography>
            <ThemeToggle />
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <CircularProgress size={40} thickness={4} sx={{ mb: 3, color: muiTheme.palette.primary.main }} />
            <Typography sx={{ color: muiTheme.palette.text.secondary, fontSize: '1rem' }}>
              Loading whisper...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  // Error state
  if (error || !whisper) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: muiTheme.palette.background.default }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => navigate('/')}
              sx={{ mr: 2, color: muiTheme.palette.text.primary }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{
              color: muiTheme.palette.text.primary,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: '1.35rem',
              letterSpacing: '-0.02em',
              flexGrow: 1
            }}>
              Back to whispers
            </Typography>
            <ThemeToggle />
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography sx={{ fontSize: '4rem', mb: 2 }}>😞</Typography>
            <Typography sx={{ color: muiTheme.palette.text.secondary, mb: 4, textAlign: 'center' }}>
              {error || 'Whisper not found'}
            </Typography>
            <Button onClick={() => navigate('/')} variant="contained" sx={{ px: 3, py: 1 }}>
              Go Back
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  const emotion = EMOTIONS[whisper.emotion];
  const emotionColor = getEmotionColor(whisper.emotion);
  const emotionBg = getEmotionBackground(whisper.emotion, isDark);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: muiTheme.palette.background.default, pb: 4 }}>
      {/* Enhanced Header */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => navigate('/')}
            sx={{ mr: 2, color: muiTheme.palette.text.primary }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{
            color: muiTheme.palette.text.primary,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            fontSize: '1.35rem',
            letterSpacing: '-0.02em',
            flexGrow: 1
          }}>
            Whisper Details
          </Typography>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title={copied ? "Copied!" : "Share whisper"}>
              <IconButton
                onClick={handleShare}
                sx={{ 
                  color: muiTheme.palette.text.secondary,
                  '&:hover': { color: muiTheme.palette.text.primary }
                }}
              >
                {copied ? <CopyIcon /> : <ShareIcon />}
              </IconButton>
            </Tooltip>
            <ThemeToggle />
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Enhanced Main Whisper Content */}
        <Card sx={{ 
          mb: 4, 
          backgroundColor: muiTheme.palette.background.paper,
          borderLeft: `4px solid ${emotionColor}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Emotion background gradient */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, ${emotionBg} 0%, transparent 70%)`,
              opacity: 0.3,
              pointerEvents: 'none'
            }}
          />
          
          <CardContent sx={{ p: 4, position: 'relative' }}>
            {/* Enhanced Header */}
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography component="span" sx={{ fontSize: '2.5rem', lineHeight: 1 }}>
                  {emotion.emoji}
                </Typography>
                <Box>
                  <Chip
                    label={emotion.label}
                    sx={{
                      backgroundColor: emotionColor,
                      color: '#000000',
                      fontWeight: 600,
                      textTransform: 'lowercase',
                      mb: 1
                    }}
                  />
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ScheduleIcon sx={{ fontSize: '0.9rem', color: muiTheme.palette.text.secondary }} />
                    <Typography sx={{
                      color: muiTheme.palette.text.secondary,
                      fontSize: '0.85rem',
                      fontWeight: 400
                    }}>
                      {formatTimeAgo(whisper.createdAt)}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              
              <Stack alignItems="flex-end" spacing={1}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <ViewIcon sx={{ fontSize: '0.8rem', color: muiTheme.palette.text.disabled }} />
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    color: muiTheme.palette.text.disabled 
                  }}>
                    {views} views
                  </Typography>
                </Stack>
                <Typography sx={{ 
                  fontSize: '0.7rem', 
                  color: muiTheme.palette.text.disabled,
                  fontFamily: 'monospace'
                }}>
                  #{whisper.id}
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ mb: 3, borderColor: emotionColor, opacity: 0.3 }} />

            {/* Enhanced Whisper Text */}
            <Typography sx={{
                color: muiTheme.palette.text.primary,
                fontSize: '1.6rem',
                lineHeight: 1.7,
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontWeight: 400,
                letterSpacing: '0.01em',
                fontStyle: 'italic',
                position: 'relative',
                pl: 2
              }}>
                {whisper.text}
              </Typography>

            {/* Metadata */}
            <Box sx={{ 
              mt: 3, 
              pt: 2, 
              borderTop: `1px solid ${muiTheme.palette.divider}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                color: muiTheme.palette.text.secondary 
              }}>
                {formatFullDate(whisper.createdAt)}
              </Typography>
              <Typography sx={{ 
                fontSize: '0.8rem', 
                color: emotionColor,
                fontWeight: 500
              }}>
                {userLocation ? getDistanceText(whisper) : 'Calculating distance...'}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Enhanced Location Card with Real Map */}
        <Card sx={{ 
          mb: 3,
          backgroundColor: muiTheme.palette.background.paper,
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, pb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <LocationIcon sx={{ color: emotionColor }} />
                <Typography sx={{
                  color: muiTheme.palette.text.primary,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}>
                  Whisper Location
                </Typography>
              </Stack>
              <Typography sx={{
                color: muiTheme.palette.text.secondary,
                fontSize: '0.9rem',
                mb: 2
              }}>
                This whisper was shared at the location shown below
              </Typography>
            </Box>

            {/* Real Map */}
            <Box 
              ref={mapRef}
              sx={{ 
                height: 300, 
                width: '100%',
                backgroundColor: isDark ? '#0a0a0a' : '#f8f9fa',
                borderRadius: '0 0 12px 12px'
              }}
            />

            <Box sx={{ p: 2, bgcolor: muiTheme.palette.action.hover }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ 
                  color: muiTheme.palette.text.secondary, 
                  fontSize: '0.8rem',
                  fontFamily: 'monospace'
                }}>
                  {whisper.latitude.toFixed(6)}, {whisper.longitude.toFixed(6)}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${whisper.latitude},${whisper.longitude}`;
                    window.open(url, '_blank');
                  }}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Open in Maps
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Enhanced Stats Card */}
        <Fade in timeout={1000}>
          <Card sx={{ 
            backgroundColor: muiTheme.palette.background.paper,
            background: `linear-gradient(135deg, ${muiTheme.palette.background.paper} 0%, ${emotionBg} 100%)`,
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{
                color: muiTheme.palette.text.primary,
                fontSize: '1rem',
                fontWeight: 600,
                mb: 2
              }}>
                Whisper Insights
              </Typography>
              
              <Stack direction="row" spacing={4}>
                <Box textAlign="center">
                  <Typography sx={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    color: emotionColor 
                  }}>
                    {whisper.text.length}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    color: muiTheme.palette.text.secondary 
                  }}>
                    characters
                  </Typography>
                </Box>
                
                <Box textAlign="center">
                  <Typography sx={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    color: emotionColor 
                  }}>
                    {whisper.text.split(' ').length}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    color: muiTheme.palette.text.secondary 
                  }}>
                    words
                  </Typography>
                </Box>
                
                <Box textAlign="center">
                  <Typography sx={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    color: emotionColor 
                  }}>
                    {views}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    color: muiTheme.palette.text.secondary 
                  }}>
                    views
                  </Typography>
                </Box>
                
                <Box textAlign="center">
                  <Typography sx={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 700, 
                    color: emotionColor 
                  }}>
                    {userLocation ? getDistanceText(whisper).split(' ')[0] : '?'}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.75rem', 
                    color: muiTheme.palette.text.secondary 
                  }}>
                    {userLocation && getDistanceText(whisper).includes('km') ? 'km away' : 
                     userLocation && getDistanceText(whisper).includes('m') ? 'meters' : 'distance'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default WhisperDetail;