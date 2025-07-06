import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import L from 'leaflet';
import { Whisper, Location, EMOTIONS } from '../types';
import { getEmotionColor } from '../theme';
import EmotionFilter from './EmotionFilter';

import { useTheme as useCustomTheme } from './contexts/ThemeContext';


// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WhisperMapViewProps {
  whispers: Whisper[];
  userLocation: Location | null;
  onWhisperClick: (id: number) => void;
  formatTimeAgo: (dateString: string) => string;
  selectedEmotion: string | null;
  onEmotionChange: (emotion: string | null) => void;
}

const WhisperMapView: React.FC<WhisperMapViewProps> = ({
  whispers,
  userLocation,
  onWhisperClick,
  formatTimeAgo,
  selectedEmotion,
  onEmotionChange
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { isDark } = useCustomTheme();

  // Filter whispers based on selected emotion (consistent with parent state)
  const filteredWhispers = selectedEmotion 
    ? whispers.filter(w => w.emotion === selectedEmotion)
    : whispers;

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      console.log('Creating whisper map...');
      
      // Create map centered on user location or NYC
      const center: [number, number] = userLocation 
        ? [userLocation.latitude, userLocation.longitude]
        : [40.7128, -74.0060];
      
      const map = L.map(mapRef.current).setView(center, 13);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);
      
      mapInstanceRef.current = map;
    }
  }, [userLocation]);

  // Update markers when filtered whispers change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    
    // Clear existing markers (except map layers)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add user location marker
    if (userLocation) {
      const userMarker = L.marker([userLocation.latitude, userLocation.longitude])
        .addTo(map)
        .bindPopup(`
          <div style="color: #000000; text-align: center; padding: 5px;">
            <strong>📍 You are here</strong>
          </div>
        `);
    }

    // Add whisper markers (using filteredWhispers for consistency)
    filteredWhispers.forEach((whisper) => {
      const emotion = EMOTIONS[whisper.emotion];
      const emotionColor = getEmotionColor(whisper.emotion);
      
      // Create custom icon with emotion color
      const emotionIcon = L.divIcon({
        html: `
          <div style="
            background: ${emotionColor};
            width: 35px;
            height: 35px;
            border-radius: 50%;
            border: 3px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            cursor: pointer;
          ">
            ${emotion.emoji}
          </div>
        `,
        className: 'whisper-marker',
        iconSize: [35, 35],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([whisper.latitude, whisper.longitude], {
        icon: emotionIcon
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="
         color:isDark ?  'rgba(0, 0, 0, 0.9)': 'rgba(255, 255, 255, 0.95)' ;
          max-width: 250px; 
          padding: 10px;
          font-family: 'Inter', sans-serif;
        ">
          <div style="
            display: flex; 
            align-items: center; 
            gap: 8px; 
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
          ">
            <span style="font-size: 1.2rem;">${emotion.emoji}</span>
            <div>
              <div style="
                color: ${emotionColor}; 
                font-size: 0.9rem; 
                font-weight: 600;
                text-transform: lowercase;
              ">
                ${emotion.label}
              </div>
              <div style="font-size: 0.75rem; color: #666666;">
                ${formatTimeAgo(whisper.createdAt)}
              </div>
            </div>
          </div>
          <div style="
            font-size: 0.9rem; 
            line-height: 1.4;
            margin-bottom: 10px;
            font-style: italic;
            color   color:isDark ?  'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9);
            font-family: 'Georgia', serif;
          ">
            "${whisper.text.slice(0, 100)}${whisper.text.length > 100 ? '...' : ''}"
          </div>
          <button 
            onclick="window.whisperClick(${whisper.id})"
            style="
              background: ${emotionColor};
              color:isDark ?  'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9);
              border: none;
              padding: 6px 12px;
              border-radius: 4px;
              font-size: 0.8rem;
              cursor: pointer;
              width: 100%;
              font-weight: 500;
            "
          >
            Read Full Whisper
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Add global function for popup button clicks
    (window as any).whisperClick = (id: number) => {
      onWhisperClick(id);
    };

  }, [filteredWhispers, userLocation, onWhisperClick, formatTimeAgo]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <Box sx={{ height: '100vh', width: '100%', position: 'relative' }}>
      {/* Map Stats Overlay - Top Left */}
      <Box
        sx={{
          position: 'absolute',
          top: 80,
          left: 16,
          zIndex: 1000,
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2,
          p: 2,
          border: '1px solid #333333',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography sx={{ color:  isDark ?  'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)' , fontSize: '0.9rem', fontWeight: 500 }}>
          🗺️ {filteredWhispers.length} whispers nearby
        </Typography>
        <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>
          {selectedEmotion 
            ? `Showing ${EMOTIONS[selectedEmotion as keyof typeof EMOTIONS]?.label.toLowerCase()}` 
            : 'Click markers to read whispers'
          }
        </Typography>
      </Box>

      {/* Use the unified EmotionFilter component */}
      <EmotionFilter
        whispers={whispers}
        selectedEmotion={selectedEmotion}
        onEmotionChange={onEmotionChange}
        position="top-right"
        variant="panel"
      />

      {/* Map Container */}
      <div 
        ref={mapRef} 
        style={{ 
          height: '100%', 
          width: '100%',
          backgroundColor: '#000000'
        }}
      />
    </Box>
  );
};

export default WhisperMapView;