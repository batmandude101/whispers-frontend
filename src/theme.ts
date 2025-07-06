// theme.ts - Unified Theme System
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Color palette
const colors = {
  // Brand colors
  primary: {
    main: '#ffffff',
    dark: '#f5f5f5',
    light: '#ffffff',
  },
  
  // Emotion colors (consistent across light/dark)
  emotions: {
    melancholy: '#7c9fff',
    joy: '#ffd93d', 
    anxiety: '#ff6b6b',
    peace: '#51cf85',
  },
  
  // Semantic colors
  success: '#51cf85',
  warning: '#ffd93d',
  error: '#ff6b6b',
  info: '#7c9fff',
};

// Common theme options
const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
    }
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
};

// Dark theme
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      dark: '#f5f5f5',
      contrastText: '#000000'
    },
    secondary: {
      main: '#666666',
      dark: '#333333',
      light: '#999999'
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
      disabled: '#666666'
    },
    divider: '#333333',
    error: {
      main: colors.error,
    },
    warning: {
      main: colors.warning,
    },
    success: {
      main: colors.success,
    },
    info: {
      main: colors.info,
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          color: '#ffffff'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '1px solid #222222',
          boxShadow: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#111111',
          borderRadius: 12,
          border: '1px solid #222222',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            border: '1px solid #333333',
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.02)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9rem'
        },
        contained: {
          backgroundColor: '#ffffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#f5f5f5',
            boxShadow: '0 4px 16px rgba(255, 255, 255, 0.1)'
          }
        },
        outlined: {
          borderColor: '#333333',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#555555',
            backgroundColor: 'rgba(255, 255, 255, 0.02)'
          }
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#f5f5f5',
            transform: 'scale(1.05)',
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.15)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1a1a1a',
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#333333'
            },
            '&:hover fieldset': {
              borderColor: '#555555'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff'
            },
            '& input, & textarea': {
              color: '#ffffff'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#cccccc'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111111',
          borderRadius: 16,
          border: '1px solid #222222'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#cccccc',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff'
          }
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#cccccc',
          border: 'none',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          },
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }
        }
      }
    }
  }
});

// Light theme
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      dark: '#333333',
      light: '#666666',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#666666',
      dark: '#333333',
      light: '#999999'
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
      disabled: '#999999'
    },
    divider: '#e0e0e0',
    error: {
      main: colors.error,
    },
    warning: {
      main: colors.warning,
    },
    success: {
      main: colors.success,
    },
    info: {
      main: colors.info,
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff',
          color: '#000000'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          color: '#000000'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9rem'
        },
        contained: {
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
          }
        },
        outlined: {
          borderColor: '#e0e0e0',
          color: '#000000',
          '&:hover': {
            borderColor: '#cccccc',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
            transform: 'scale(1.05)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#e0e0e0'
            },
            '&:hover fieldset': {
              borderColor: '#cccccc'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000'
            },
            '& input, & textarea': {
              color: '#000000'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#666666'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e0e0e0',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#666666',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            color: '#000000'
          }
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#666666',
          border: 'none',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
          },
          '&.Mui-selected': {
            backgroundColor: '#000000',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333'
            }
          }
        }
      }
    }
  }
});

// Emotion color functions (theme-aware)
export const getEmotionColor = (emotion: string) => {
  return colors.emotions[emotion as keyof typeof colors.emotions] || '#888888';
};

export const getEmotionBackground = (emotion: string, isDark: boolean = true) => {
  const color = getEmotionColor(emotion);
  return isDark 
    ? `${color}15` // 15% opacity for dark theme
    : `${color}08`; // 8% opacity for light theme
};

// Theme-aware helper functions
export const getOverlayColor = (isDark: boolean) => {
  return isDark 
    ? 'rgba(0, 0, 0, 0.9)' 
    : 'rgba(255, 255, 255, 0.95)';
};

export const getBorderColor = (isDark: boolean) => {
  return isDark ? '#333333' : '#e0e0e0';
};

export const getMapOverlayStyles = (isDark: boolean) => ({
  backgroundColor: getOverlayColor(isDark),
  border: `1px solid ${getBorderColor(isDark)}`,
  backdropFilter: 'blur(10px)',
  borderRadius: 2,
});

// Default export
export default darkTheme;