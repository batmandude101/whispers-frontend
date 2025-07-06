import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BasicLeafletTest: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      console.log('Creating Leaflet map...');
      
      // Create map
      const map = L.map(mapRef.current).setView([40.7128, -74.0060], 13);
      
      // Add tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);
      
      // Add test marker
      L.marker([40.7128, -74.0060])
        .addTo(map)
        .bindPopup('Test marker - Map is working! 🗺️')
        .openPopup();
      
      mapInstanceRef.current = map;
      console.log('Map created successfully!');
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '20px' }}>Basic Leaflet Test</h2>
      <div 
        ref={mapRef} 
        style={{ 
          height: '400px', 
          width: '100%',
          backgroundColor: '#333333',
          border: '2px solid #666666',
          borderRadius: '8px'
        }}
      />
      <p style={{ color: '#cccccc', marginTop: '10px', fontSize: '14px' }}>
        If you see a map with a marker above, Leaflet is working!
        Check the browser console for any error messages.
      </p>
    </div>
  );
};

export default BasicLeafletTest;