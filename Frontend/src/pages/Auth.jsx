import React, { useState, useMemo } from 'react';
import { 
    Box, Typography, TextField, Button, Grid, Paper,
    ThemeProvider, createTheme, CssBaseline, CircularProgress, 
    InputAdornment, IconButton, Checkbox, FormControlLabel, Fade, Link 
} from '@mui/material';
import { ThemeProvider as Emotion10ThemeProvider } from '@emotion/react';
import { 
    Visibility, VisibilityOff, CheckCircleOutline, Security, 
    LockOutlined, PersonOutline, AlternateEmailOutlined,
    BusinessOutlined, PhoneOutlined, ArrowRightAlt
} from '@mui/icons-material';
import { basicTheme } from '../layout/themes';
import { GlobalStyles } from '../layout/GlobalStyle';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/APIHandler';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from '../redux/reducer/IsLoggedInReducer';
import newLogo from '../assets/newLogo.png';

// Custom Enterprise Theme Additions
const enterpriseTheme = createTheme({
    ...basicTheme,
    typography: {
        fontFamily: 'Inter, sans-serif',
        button: { textTransform: 'none', fontWeight: 600 },
    },
    palette: {
        mode: 'dark',
        background: { default: '#0F1115', paper: '#181A20' },
        primary: { main: '#7C5CFC' },
        text: { primary: '#FFFFFF', secondary: '#9CA3AF' },
        divider: 'rgba(255,255,255,0.08)'
    },
    components: {
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderRadius: 14,
                    height: 54,
                    transition: 'all 0.2s ease',
                    border: '1px solid transparent',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.06)',
                    },
                    '&.Mui-focused': {
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid #7C5CFC',
                        boxShadow: '0 0 0 4px rgba(124, 92, 252, 0.1)',
                    },
                    '&:before': { display: 'none' },
                    '&:after': { display: 'none' },
                },
                input: {
                    paddingTop: '18px',
                    paddingBottom: '8px',
                    fontSize: '14px',
                    '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 100px #1A1D24 inset',
                        WebkitTextFillColor: '#FFFFFF',
                        borderRadius: '14px',
                    }
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    color: '#9CA3AF',
                    '&.Mui-focused': { color: '#7C5CFC' }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    height: 54,
                    borderRadius: 14,
                    fontSize: '15px',
                    boxShadow: '0 4px 14px rgba(124, 92, 252, 0.3)',
                    '&:hover': {
                        boxShadow: '0 6px 20px rgba(124, 92, 252, 0.4)',
                        backgroundColor: '#6A4DDF'
                    }
                }
            }
        }
    }
});

const FeatureCheck = ({ label }) => (
    <Box display="flex" alignItems="center" mb={2}>
        <CheckCircleOutline sx={{ color: '#7C5CFC', fontSize: 20, mr: 1.5 }} />
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, fontSize: 15 }}>{label}</Typography>
    </Box>
);

const IsometricWarehouse = () => (
    <Box sx={{ position: 'relative', width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.8 }}>
        <svg width="240" height="200" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M120 180L30 130V50L120 100L210 50V130L120 180Z" fill="rgba(124, 92, 252, 0.05)" stroke="#7C5CFC" strokeWidth="1" strokeLinejoin="round"/>
            <path d="M120 100L30 50L120 10L210 50L120 100Z" fill="rgba(124, 92, 252, 0.1)" stroke="#7C5CFC" strokeWidth="1" strokeLinejoin="round"/>
            <path d="M120 100V180" stroke="#7C5CFC" strokeWidth="1" strokeLinejoin="round"/>
            <path d="M75 75L120 100L165 75" stroke="#7C5CFC" strokeWidth="1" strokeLinejoin="round"/>
            <path d="M75 75V155" stroke="rgba(124, 92, 252, 0.5)" strokeWidth="1" strokeDasharray="4 4"/>
            <path d="M165 75V155" stroke="rgba(124, 92, 252, 0.5)" strokeWidth="1" strokeDasharray="4 4"/>
            <rect x="100" y="30" width="40" height="40" transform="rotate(45 100 30)" fill="rgba(255,255,255,0.1)"/>
        </svg>
    </Box>
);

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { callApi, loading } = useApi();
    const dispatch = useDispatch();

    const doSignup = async(e) => {
        e.preventDefault();
        // Preserving identical authentication logic
        let response = await callApi({
            url: "auth/signup/",
            method: "POST",
            body: {
                username: e.target.username.value,
                password: e.target.password.value,
                email: e.target.email.value,
                profile_pic: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
            }
        });
        if(response?.data?.access){
            localStorage.setItem("token", response.data.access);
            localStorage.setItem("nexora_onboarding_done", "false");
            toast.success("Account created successfully");
            dispatch(login());
            navigate("/");
        } else {
            toast.error("Signup failed. Please verify your details.");
        }
    }

    const doLogin = async(e) => {
        e.preventDefault();
        let response = await callApi({
            url: "auth/login/",
            method: "POST",
            body: {
                username: e.target.username.value,
                password: e.target.password.value
            }
        });
        if(response?.data?.access){
            localStorage.setItem("token", response.data.access);
            toast.success("Authentication successful");
            dispatch(login());
            navigate("/");
        } else {
            toast.error("Invalid credentials.");
        }
    }

    return (
        <Emotion10ThemeProvider theme={enterpriseTheme}>
            <ThemeProvider theme={enterpriseTheme}>
                <CssBaseline />
                <GlobalStyles />
                <Grid container sx={{ height: '100vh', overflow: 'hidden', backgroundColor: 'background.default' }}>
                    
                    {/* LEFT PANEL - 40% SPLIT */}
                    <Grid 
                        item xs={12} md={5} lg={4.8} 
                        sx={{ 
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'column',
                            p: { md: 6, lg: 8 },
                            backgroundColor: '#14161A',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                            position: 'relative'
                        }}
                    >
                        {/* Subtle Grid Background */}
                        <Box sx={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                            backgroundSize: '32px 32px',
                            zIndex: 0
                        }}/>

                        <Box sx={{ position: 'relative', zIndex: 1, flexGrow: 1 }}>
                            {/* Logo */}
                            <Box sx={{ height: 80, display: 'flex', alignItems: 'center', mb: 6, mt: 2, ml: -4.5 }}>
                                <Box component="img" src={newLogo} alt="Nexora" sx={{ height: 240, objectFit: 'contain', pointerEvents: 'none' }} />
                            </Box>

                            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 2, letterSpacing: -0.5 }}>
                                Enterprise Resource Planning
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6, maxWidth: 400, lineHeight: 1.6, fontSize: 16 }}>
                                A unified workspace for high-performance supply chain and inventory management.
                            </Typography>

                            <Box sx={{ mb: 8 }}>
                                <FeatureCheck label="Inventory Management" />
                                <FeatureCheck label="Warehouse Tracking" />
                                <FeatureCheck label="Purchase Orders" />
                                <FeatureCheck label="Sales Analytics" />
                            </Box>

                            <IsometricWarehouse />
                        </Box>

                        <Box sx={{ position: 'relative', zIndex: 1, mt: 4 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    ERP Version 1.0.0
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    &copy; 2026 Nexora ERP
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* RIGHT PANEL - 60% SPLIT */}
                    <Grid 
                        item xs={12} md={7} lg={7.2} 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            p: { xs: 3, md: 6 },
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ width: '100%', maxWidth: 460 }}>
                            
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: { xs: 4, sm: 5 }, 
                                    borderRadius: '20px', 
                                    backgroundColor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                                }}
                            >
                                {/* Mobile Logo */}
                                <Box sx={{ display: { xs: 'flex', md: 'none' }, height: 50, alignItems: 'center', mb: 4, ml: -2.5 }}>
                                    <Box component="img" src={newLogo} alt="Nexora" sx={{ height: 140, objectFit: 'contain', pointerEvents: 'none' }} />
                                </Box>

                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5, letterSpacing: -0.5, fontSize: 32 }}>
                                        {isLogin ? "Welcome Back" : "Create Account"}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 16 }}>
                                        {isLogin ? "Sign in to access your enterprise dashboard." : "Set up your corporate workspace."}
                                    </Typography>
                                </Box>

                                <Fade in={isLogin} unmountOnExit timeout={300}>
                                    <Box component="form" onSubmit={doLogin} sx={{ display: isLogin ? 'block' : 'none' }}>
                                        <TextField 
                                            fullWidth label="Username" name="username" 
                                            variant="filled" sx={{ mb: 2.5 }} required 
                                            InputProps={{ 
                                                startAdornment: <InputAdornment position="start"><PersonOutline sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>
                                            }}
                                        />
                                        <TextField 
                                            fullWidth label="Password" name="password" 
                                            variant="filled" type={showPassword ? "text" : "password"} 
                                            sx={{ mb: 3 }} required
                                            InputProps={{ 
                                                startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'text.secondary' }}>
                                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                                            <FormControlLabel 
                                                control={<Checkbox size="small" sx={{ color: 'text.secondary', '&.Mui-checked': { color: '#7C5CFC' } }}/>} 
                                                label={<Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: 14 }}>Remember Me</Typography>} 
                                            />
                                            <Link href="#" underline="hover" sx={{ color: '#7C5CFC', fontSize: 14, fontWeight: 500 }}>
                                                Forgot Password?
                                            </Link>
                                        </Box>

                                        <Button 
                                            fullWidth type="submit" variant="contained" color="primary" 
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit"/> : "Sign In"}
                                        </Button>
                                    </Box>
                                </Fade>

                                <Fade in={!isLogin} unmountOnExit timeout={300}>
                                    <Box component="form" onSubmit={doSignup} sx={{ display: !isLogin ? 'block' : 'none' }}>
                                        <TextField 
                                            fullWidth label="Email Address" name="email" 
                                            variant="filled" type="email" sx={{ mb: 2.5 }} required 
                                            InputProps={{ 
                                                startAdornment: <InputAdornment position="start"><AlternateEmailOutlined sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>
                                            }}
                                        />
                                        
                                        <TextField 
                                            fullWidth label="Username" name="username" variant="filled" required sx={{ mb: 2.5 }}
                                            InputProps={{ 
                                                startAdornment: <InputAdornment position="start"><PersonOutline sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>
                                            }}
                                        />

                                        <TextField 
                                            fullWidth label="Password" name="password" 
                                            variant="filled" type={showPassword ? "text" : "password"} 
                                            sx={{ mb: 3 }} required
                                            InputProps={{ 
                                                startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'text.secondary' }}>
                                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />

                                        <Box sx={{ mb: 4 }}></Box>

                                        <Button 
                                            fullWidth type="submit" variant="contained" color="primary" 
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit"/> : "Create Account"}
                                        </Button>
                                    </Box>
                                </Fade>
                                
                                <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 14 }}>
                                        {isLogin ? "Need an account? " : "Already have an account? "}
                                        <Link 
                                            component="button"
                                            onClick={() => setIsLogin(!isLogin)}
                                            sx={{ 
                                                color: '#FFFFFF', 
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                '&:hover': { color: '#7C5CFC' }
                                            }}
                                        >
                                            {isLogin ? "Create account" : "Sign in"}
                                        </Link>
                                    </Typography>
                                </Box>

                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </Emotion10ThemeProvider>
    );
};

export default Auth;