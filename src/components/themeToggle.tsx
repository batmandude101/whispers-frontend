// components/ThemeToggle.tsx
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from './contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  sx?: any;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'medium', sx = {} }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`} arrow>
      <IconButton
        onClick={toggleTheme}
        size={size}
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
          ...sx
        }}
      >
        {isDark ? (
          <LightMode sx={{ fontSize: 'inherit' }} />
        ) : (
          <DarkMode sx={{ fontSize: 'inherit' }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;