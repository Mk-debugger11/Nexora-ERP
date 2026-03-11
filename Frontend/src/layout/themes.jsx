import { createTheme } from '@mui/material/styles';
// Dark Theme
export const orangeDarkTheme = createTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(255, 165, 0, 1)',
      dark: 'rgba(255, 140, 0, 1)',
      light: 'rgba(255, 140, 0, 1)',
    },
    secondary: {
      main: 'rgba(255, 222, 173, 1)',
    },
    background: {
      paper: 'rgba(45, 24, 0, 1)',
      default: 'rgba(45, 24, 0, 1)',
    },
    error: {
      main: '#f44336',
    },
    success: {
      main: '#4caf50', // Default MUI success color
    },
    warning: {
      main: '#ff9800', // Default MUI warning color
    },
    info: {
      main: '#2196f3', // Default MUI info color
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)',
      secondary: 'rgba(255, 255, 255, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'rgba(255, 165, 0, 1)',
          color: 'rgba(45, 24, 0, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 140, 0, 1)', // Orange hover color
          },
        },
        containedSecondary: {
          backgroundColor: 'rgba(255, 250, 240, 1)',
          color: 'rgba(45, 24, 0, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 222, 173, 1)', // Light orange hover color
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(45, 24, 0, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottomColor: 'rgb(71,52,31)!important',
        },
      },
    },
  },
  logo:{
    rectangle:'/logo_light.png',
    square:'/logo_square_light.png',
  },
});

export const orangeLightTheme = createTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    mode: 'light',
    primary: {
      main: 'rgba(255, 165, 0, 1)',
      dark: 'rgba(255, 140, 0, 1)',
      light: 'rgba(255, 140, 0, 1)',
    },
    secondary: {
      main: 'rgba(255, 222, 173, 1)',
    },
    background: {
      paper: 'rgba(255, 250, 240, 1)',
      default: 'rgba(253, 245, 230, 1)',
    },
    error: {
      main: '#f44336', // Default MUI error color
    },
    success: {
      main: '#4caf50', // Default MUI success color
    },
    warning: {
      main: '#ff9800', // Default MUI warning color
    },
    info: {
      main: '#2196f3', // Default MUI info color
    },
    text: {
      primary: 'rgba(0, 0, 0, 1)',
      secondary: 'rgba(0, 0, 0, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'rgba(255, 165, 0, 1)',
          color: 'rgba(255, 250, 240, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 140, 0, 1)', // Orange hover color
          },
        },
        containedSecondary: {
          backgroundColor: 'rgba(255, 250, 240, 1)',
          color: 'rgba(0, 0, 0, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 222, 173, 1)', // Light orange hover color
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 250, 240, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottomColor: 'rgb(224,220,211)!important',
        },
      },
    },
  },
  logo:{
    rectangle:'/logo_dark.png',
    square:'/logo_square_dark.png',
  },
});

export const redDarkTheme = createTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(255, 0, 0, 1)',
      dark: 'rgba(139, 0, 0, 1)',
      light: 'rgba(255, 0, 0, 1)',
    },
    secondary: {
      main: 'rgba(255, 228, 225, 1)',
    },
    background: {
      paper: 'rgba(55, 10, 10, 1)',
      default: 'rgba(55, 10, 10, 1)',
    },
    error: {
      main: 'rgba(255, 0, 0, 1)',
    },
    success: {
      main: '#4caf50', // Default MUI success color
    },
    warning: {
      main: '#ff9800', // Default MUI warning color
    },
    info: {
      main: '#2196f3', // Default MUI info color
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)',
      secondary: 'rgba(255, 255, 255, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'rgba(255, 0, 0, 1)',
          color: 'rgba(255, 255, 255, 1)',
          '&:hover': {
            backgroundColor: 'rgba(139, 0, 0, 1)', // Dark red hover color
          },
        },
        containedSecondary: {
          backgroundColor: 'rgba(255, 228, 225, 1)',
          color: 'rgba(55, 10, 10, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 192, 203, 1)', // Light red hover color
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(55, 10, 10, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(55, 10, 10, 1)',
          borderBottom: '1px solid #616161',
          backgroundImage: 'none',
          borderBottomColor: 'rgb(79,40,40)!important',
        },
      },
    },
  },
  logo:{
    rectangle:'/logo_light.png',
    square:'/logo_square_light.png',
  },
});

export const redLightTheme = createTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    mode: 'light',
    primary: {
      main: 'rgba(255, 0, 0, 1)',
      dark: 'rgba(139, 0, 0, 1)',
      light: 'rgba(255, 192, 203, 1)',
    },
    secondary: {
      main: '#f44336',
    },
    background: {
      paper: 'rgba(255, 228, 225, 1)',
      default: 'rgba(253, 236, 234, 1)',
      light:'rgba(255, 255, 255, 1)',
    },
    error: {
      main: '#f44336', // Default MUI error color
    },
    success: {
      main: '#4caf50', // Default MUI success color
    },
    warning: {
      main: '#ff9800', // Default MUI warning color
    },
    info: {
      main: '#2196f3', // Default MUI info color
    },
    text: {
      primary: 'rgba(0, 0, 0, 1)',
      secondary: 'rgba(0, 0, 0, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'rgba(255, 0, 0, 1)',
          color: 'rgba(255, 228, 225, 1)',
          '&:hover': {
            backgroundColor: 'rgba(139, 0, 0, 1)', // Dark red hover color
          },
        },
        containedSecondary: {
          backgroundColor: 'rgba(255, 228, 225, 1)',
          color: 'rgba(255, 0, 0, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 192, 203, 1)', // Light red hover color
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 228, 225, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: 'rgba(0, 0, 0, 1)',
          borderBottomColor: 'rgb(224,200,198)!important',
        },
      },
    },
  },
  logo:{
    rectangle:'/logo_dark.png',
    square:'/logo_square_dark.png',
  },

});
export const greenDarkTheme = createTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(0, 128, 0, 1)',
      dark: 'rgba(0, 100, 0, 1)',
      light: 'rgba(0, 128, 0, 1)',
    },
    secondary: {
      main: 'rgba(240, 255, 240, 1)',
    },
    background: {
      paper: 'rgba(7, 35, 30, 1)',
      default: 'rgba(7, 35, 30, 1)',
    },
    error: {
      main: '#f44336', // Default MUI error color
    },
    success: {
      main: '#4caf50', // Default MUI success color
    },
    warning: {
      main: '#ff9800', // Default MUI warning color
    },
    info: {
      main: '#2196f3', // Default MUI info color
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)',
      secondary: 'rgba(255, 255, 255, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'rgba(0, 128, 0, 1)',
          color: 'rgba(255, 255, 255, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 100, 0, 1)', // Dark green hover color
          },
        },
        containedSecondary: {
          backgroundColor: 'rgba(240, 255, 240, 1)',
          color: 'rgba(0, 128, 0, 1)',
          '&:hover': {
            backgroundColor: 'rgba(144, 238, 144, 1)', // Light green hover color
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(7, 35, 30, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottomColor: 'rgb(37,62,57)!important',
        },
      },
    },
  },
  logo:{
    rectangle:'/logo_light.png',
    square:'/logo_square_light.png',
  },
});
export const greenLightTheme = createTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    mode: 'light',
    primary: {
      main: 'rgba(0, 128, 0, 1)',
      dark: 'rgba(0, 100, 0, 1)',
      light: 'rgba(144, 238, 144, 1)',
    },
    secondary: {
      main: 'rgba(144, 238, 144, 1)',
    },
    background: {
      paper: 'rgba(240, 255, 240, 1)',
      default: 'rgba(232, 248, 232, 1)',
      light:'rgba(255, 255, 255, 1)',
    },
    error: {
      main: '#f44336', // Default MUI error color
    },
    success: {
      main: '#4caf50', // Default MUI success color
    },
    warning: {
      main: '#ff9800', // Default MUI warning color
    },
    info: {
      main: '#2196f3', // Default MUI info color
    },
    text: {
      primary: 'rgba(0, 0, 0, 1)',
      secondary: 'rgba(0, 0, 0, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'rgba(0, 128, 0, 1)',
          color: 'rgba(255, 255, 255, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 100, 0, 1)', // Dark green hover color
          },
        },
        containedSecondary: {
          backgroundColor: 'rgba(240, 255, 240, 1)',
          color: 'rgba(0, 128, 0, 1)',
          '&:hover': {
            backgroundColor: 'rgba(144, 238, 144, 1)', // Light green hover color
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(240, 255, 240, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: 'rgba(0, 0, 0, 1)',
          borderBottomColor: 'rgb(211,224,211)!important',
        },
      },
    },
  },
  logo:{
    rectangle:'/logo_dark.png',
    square:'/logo_square_dark.png',
  },

});

export const blueDarkTheme = createTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(70, 130, 255, 1)',
      dark: 'rgba(0, 0, 255, 1)',
      light: 'rgba(70, 130, 255, 1)',
    },
    secondary: {
      main: 'rgba(70, 130, 255, 1)',
    },
    background: {
      paper: 'rgba(11, 6, 47, 1)',
      default: 'rgba(11, 6, 47, 1)',
    },
    error: {
      main: '#f44336', // Default MUI error color
    },
    success: {
      main: '#4caf50', // Default MUI success color
    },
    warning: {
      main: '#ff9800', // Default MUI warning color
    },
    info: {
      main: '#2196f3', // Default MUI info color
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)',
      secondary: 'rgba(255, 255, 255, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'rgba(70, 130, 255, 1)',
          color: 'rgba(11, 6, 47, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 255, 1)', // Dark blue hover color
          },
        },
        containedSecondary: {
          backgroundColor: 'rgba(240, 248, 255, 1)',
          color: 'rgba(70, 130, 255, 1)',
          '&:hover': {
            backgroundColor: 'rgba(135, 206, 250, 1)', // Light blue hover color
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(11, 6, 47, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottomColor: 'rgb(41,36,72)!important',
        },
      },
    },
  },
  logo:{
    rectangle:'/logo_light.png',
    square:'/logo_square_light.png',
  },

});

export const blueLightTheme = createTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    mode: 'light',
    primary: {
      main: 'rgba(70, 130, 255, 1)',
      dark: 'rgba(0, 0, 255, 1)',
      light: 'rgba(135, 206, 250, 1)',
    },
    secondary: {
      main: 'rgba(135, 206, 250, 1)',
    },
    background: {
      paper: 'rgba(240, 248, 255, 1)',
      default: 'rgba(232, 242, 253, 1)',
      light:'rgba(255, 255, 255, 1)'
    },
    error: {
      main: '#f44336', // Default MUI error color
    },
    success: {
      main: '#4caf50', // Default MUI success color
    },
    warning: {
      main: '#ff9800', // Default MUI warning color
    },
    info: {
      main: '#2196f3', // Default MUI info color
    },
    text: {
      primary: 'rgba(0, 0, 0, 1)',
      secondary: 'rgba(0, 0, 0, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'rgba(70, 130, 255, 1)',
          color: 'rgba(240, 248, 255, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 255, 1)', // Dark blue hover color
          },
        },
        containedSecondary: {
          backgroundColor: 'rgba(240, 248, 255, 1)',
          color: 'rgba(70, 130, 255, 1)',
          '&:hover': {
            backgroundColor: 'rgba(135, 206, 250, 1)', // Light blue hover color
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(240, 248, 255, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: 'rgba(0, 0, 0, 1)',
          borderBottomColor: 'rgb(211,218,224)!important',
        },
      },
    },
  },
  logo:{
    rectangle:'/logo_dark.png',
    square:'/logo_square_dark.png',
  },
});


export const customTheme = createTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    mode: 'light',
    primary: {
      main: 'rgba(128, 109, 255, 1)',
      dark: 'rgba(111, 88, 255, 1)',
      light: 'rgba(159, 84, 252, 1)',
    },
    secondary: {
      main: 'rgba(159, 84, 252, 1)',
    },
    background: {
      paper: 'rgba(255, 255, 255, 1)',
      default: 'rgba(230, 230, 230, 1)',
    },
    error: {
      main: '#f44336', // Default MUI error color
    },
    success: {
      main: '#4caf50', // Default MUI success color
    },
    warning: {
      main: '#ff9800', // Default MUI warning color
    },
    info: {
      main: '#2196f3', // Default MUI info color
    },
    text: {
      primary: 'rgba(0, 0, 0, 1)',
      secondary: 'rgba(0, 0, 0, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'rgba(128, 109, 255, 1)',
          color: 'rgba(255, 255, 255, 1)',
        },
        containedSecondary: {
          backgroundColor: 'rgba(255, 255, 255, 1)',
          color: 'rgba(128, 109, 255, 1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: 'rgba(0, 0, 0, 1)',
        },
      },
    },
  },
  logo:{
    rectangle:'/logo_dark.png',
    square:'/logo_square_dark.png',
  },
});
export const lightTheme = createTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    mode: 'light',
    primary: {
      main: 'rgba(128, 109, 255, 1)',
      dark: 'rgba(111, 88, 255, 1)',
      light: 'rgba(159, 84, 252, 1)',
    },
    secondary: {
      main: 'rgba(159, 84, 252, 1)',
    },
    background: {
      paper: 'rgba(241, 244, 250, 1)',
      default: 'rgba(255, 255, 255, 1)',
      light: 'rgba(255, 255, 255, 1)',
    },
    error: {
      main: 'rgba(255, 0, 0, 1)', // Set error color to red
    },
    success: {
      main: 'rgba(0, 128, 0, 1)', // Set success color to green
    },
    warning: {
      main: 'rgba(255, 165, 0, 1)', // Set warning color to orange
    },
    text: {
      primary: 'rgba(0, 0, 0, 1)', // Set primary text color to black
      secondary: 'rgba(0, 0, 0, 1)', // Set secondary text color to black
      icon: 'rgba(0, 0, 0, 1)', // Set icon color to black
      color: 'rgba(0, 0, 0, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'rgba(128, 109, 255, 1)',
          color: 'rgba(255, 255, 255, 1)',
        },
        containedSecondary: {
          backgroundColor: 'rgba(255, 255, 255, 1)',
          color: 'rgba(128, 109, 255, 1)',
        },
        containedError: {
          backgroundColor: 'rgba(255, 0, 0, 1)', // Set background color for error button
          color: 'rgba(255, 255, 255, 1)', // Set text color for error button
        },
        containedSuccess: {
          backgroundColor: 'rgba(0, 128, 0, 1)', // Set background color for success button
          color: 'rgba(255, 255, 255, 1)', // Set text color for success button
        },
        containedWarning: {
          backgroundColor: 'rgba(255, 165, 0, 1)', // Set background color for warning button
          color: 'rgba(255, 255, 255, 1)', // Set text color for warning button
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(241, 244, 250, 1)',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: 'rgba(0, 0, 0, 1)', // Set input text color to black
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& $notchedOutline': {
            borderColor: 'rgba(128, 109, 255, 1)', // Set input outline color to primary color
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: 'rgba(0, 0, 0, 1)',
          borderBottomColor: 'rgb(212,214,220)!important',
        },
      },
    },
  },
  logo:{
    rectangle:'/logo_dark.png',
    square:'/logo_square_dark.png',
  },

});


export const darkTheme = createTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgba(128, 109, 255, 1)',
      dark: 'rgba(111, 88, 255, 1)',
      light: 'rgba(159, 84, 252, 1)',
    },
    secondary: {
      main: 'rgba(159, 84, 252, 1)',
    },
    background: {
      paper: 'rgba(17, 17, 17, 1)',
      default: 'rgba(35, 35, 35, 1)',
    },
    error: {
      main: 'rgba(255, 0, 0, 1)',
    },
    success: {
      main: 'rgba(0, 128, 0, 1)', // Set success color to green
    },
    warning: {
      main: 'rgba(255, 165, 0, 1)', // Set warning color to orange
    },
    text: {
      primary: 'rgba(255, 255, 255, 1)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: 'rgba(128, 109, 255, 1)',
          color: 'rgba(255, 255, 255, 1)',
          '&:hover': {
            backgroundColor: 'rgba(111, 88, 255, 1)', // Darker shade of primary color for hover
          },
        },
        containedSecondary: {
          backgroundColor: 'rgba(0, 0, 0, 1)',
          color: 'rgba(255, 255, 255, 1)',
          '&:hover': {
            backgroundColor: 'rgba(41, 36, 72, 1)', // Darker shade of secondary color for hover
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17, 17, 17, 1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottomColor: 'rgb(71,71,71)!important',
        },
      },
    },
  },
  logo:{
    rectangle:'/logo_light.png',
    square:'/logo_square_light.png',
  },
});
export const basicTheme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontSize: 34, fontWeight: 700 },
    h2: { fontSize: 24, fontWeight: 600 },
    h3: { fontSize: 20, fontWeight: 600 },
    h4: { fontSize: 18, fontWeight: 600 },
    h5: { fontSize: 16, fontWeight: 600 },
    h6: { fontSize: 14, fontWeight: 600 },
    subtitle1: { fontSize: 16, fontWeight: 500, color: '#9CA3AF' },
    subtitle2: { fontSize: 14, fontWeight: 500, color: '#9CA3AF' },
    body1: { fontSize: 14, fontWeight: 500 },
    body2: { fontSize: 14, fontWeight: 400, color: '#9CA3AF' },
    caption: { fontSize: 12, fontWeight: 500, color: '#6B7280' },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C5CFC',
      light: '#8B6EFF',
      dark: '#6A4DDF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#22262B',
      contrastText: '#FFFFFF',
    },
    background: {
      paper: '#1A1D21',
      default: '#111315',
    },
    error: { main: '#F31260' },
    success: { main: '#16C784' },
    warning: { main: '#F5A524' },
    text: {
      primary: '#FFFFFF',
      secondary: '#9CA3AF',
      disabled: '#6B7280'
    },
    divider: 'rgba(255,255,255,0.06)',
  },
  shape: { borderRadius: 16 },
  logo:{
    rectangle:'/logo_light.png',
    square:'/logo_square_light.png',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 14,
          padding: '8px 24px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          '&:hover': { backgroundColor: '#8B6EFF' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundColor: '#1A1D21',
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 14,
            backgroundColor: '#15171A',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.06)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
            '&.Mui-focused fieldset': { borderColor: '#7C5CFC', borderWidth: '1px' },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: 14,
          backgroundColor: '#15171A',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          backgroundColor: '#1A1D21',
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          backgroundColor: '#1A1D21',
          '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(255,255,255,0.06)' },
          '& .MuiDataGrid-columnHeaders': { 
            backgroundColor: '#1A1D21',
            borderBottom: '1px solid rgba(255,255,255,0.06)' 
          },
          '& .MuiDataGrid-row:hover': { backgroundColor: '#22262B' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#171A1D',
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#15171A',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          margin: '4px 8px',
          padding: '8px 16px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(124, 92, 252, 0.1)',
            color: '#7C5CFC',
            '& .MuiListItemIcon-root': { color: '#7C5CFC' },
          },
          '&:hover': { backgroundColor: '#22262B' },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1D21',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        },
      },
    },
  },
});
