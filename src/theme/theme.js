import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#2f81f7' : '#0969da',
        light: '#58a6ff',
        dark: '#1f6feb',
        contrastText: '#ffffff'
      },
      secondary: {
        main: isDark ? '#238636' : '#1f883d',
        light: '#2ea043',
        dark: '#196c2e',
        contrastText: '#ffffff'
      },
      background: {
        default: isDark ? '#0d1117' : '#f6f8fa',
        paper: isDark ? '#161b22' : '#ffffff',
        subtle: isDark ? '#21262d' : '#eaeef2'
      },
      text: {
        primary: isDark ? '#f0f6fc' : '#1f2328',
        secondary: isDark ? '#8b949e' : '#656d76',
        disabled: isDark ? '#484f58' : '#8c959f'
      },
      divider: isDark ? 'rgba(240, 246, 252, 0.1)' : 'rgba(31, 35, 40, 0.12)',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDark ? 'rgba(47, 129, 247, 0.15)' : 'rgba(9, 105, 218, 0.1)'
      }
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.02em'
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.01em'
      },
      h6: {
        fontWeight: 600
      },
      subtitle1: {
        fontWeight: 500
      },
      button: {
        textTransform: 'none',
        fontWeight: 600
      }
    },
    shape: {
      borderRadius: 10
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: isDark ? '1px solid rgba(240, 246, 252, 0.1)' : '1px solid rgba(31, 35, 40, 0.12)',
            boxShadow: isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.35)'
              : '0 2px 12px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none'
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: 6
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '& fieldset': {
              borderColor: isDark ? 'rgba(240, 246, 252, 0.15)' : 'rgba(31, 35, 40, 0.18)'
            },
            '&:hover fieldset': {
              borderColor: isDark ? '#58a6ff' : '#0969da'
            }
          }
        }
      }
    }
  });
};

