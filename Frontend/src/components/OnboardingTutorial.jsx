import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Button, IconButton, LinearProgress, Fade, Grow } from '@mui/material';
import { 
    Close, ArrowForward, ArrowBack, 
    DashboardOutlined, Inventory, ShoppingCart, LocalShipping, 
    CategoryOutlined, WarehouseOutlined, AutoAwesomeTwoTone, AccountCircle,
    RocketLaunchOutlined, CheckCircleOutline
} from '@mui/icons-material';

const TUTORIAL_STEPS = [
    {
        targetId: 'onboarding-sidebar',
        title: 'Navigation Sidebar',
        description: 'This is your command center. Access every module — Products, Orders, Inventory, Warehouses, and more — from this sidebar.',
        icon: <DashboardOutlined />,
        position: 'right',
    },
    {
        targetId: 'onboarding-dashboard-cards',
        title: 'Dashboard Metrics',
        description: 'Your key business KPIs at a glance. Track total products, inventory value, sales orders, revenue, and stock alerts in real-time.',
        icon: <Inventory />,
        position: 'bottom',
    },
    {
        targetId: 'onboarding-sidebar-products',
        title: 'Product Management',
        description: 'Manage your entire product catalog here. Add categories, create products, set pricing, and track stock quantities.',
        icon: <CategoryOutlined />,
        position: 'right',
    },
    {
        targetId: 'onboarding-sidebar-purchase-orders',
        title: 'Purchase Orders',
        description: 'Create and track purchase orders with your suppliers. Manage inward stock, approve deliveries, and maintain supplier relationships.',
        icon: <LocalShipping />,
        position: 'right',
    },
    {
        targetId: 'onboarding-sidebar-sales-orders',
        title: 'Sales Orders',
        description: 'Handle customer orders end-to-end — from creation to invoice generation and delivery tracking.',
        icon: <ShoppingCart />,
        position: 'right',
    },
    {
        targetId: 'onboarding-sidebar-inventory',
        title: 'Inventory Management',
        description: 'Monitor stock levels across all warehouses. Get alerts for low stock and out-of-stock items automatically.',
        icon: <WarehouseOutlined />,
        position: 'right',
    },
    {
        targetId: 'onboarding-theme-icon',
        title: 'Personalize Your Workspace',
        description: 'Choose from 12+ premium themes to customize the look and feel of your dashboard. Make it truly yours.',
        icon: <AutoAwesomeTwoTone />,
        position: 'bottom-left',
    },
    {
        targetId: 'onboarding-profile-icon',
        title: 'Your Profile & Settings',
        description: 'Access your profile, manage account settings, configure notifications, and logout securely from here.',
        icon: <AccountCircle />,
        position: 'bottom-left',
    },
];

const OnboardingTutorial = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(-1); // -1 = welcome screen
    const [tooltipStyle, setTooltipStyle] = useState({});
    const [spotlightStyle, setSpotlightStyle] = useState({});
    const [isVisible, setIsVisible] = useState(true);
    const overlayRef = useRef(null);

    const positionTooltip = useCallback((step) => {
        if (step < 0 || step >= TUTORIAL_STEPS.length) return;

        const { targetId, position } = TUTORIAL_STEPS[step];
        const el = document.getElementById(targetId);

        if (!el) {
            // Element not found, try expanding sidebar items
            const sidebarItems = document.querySelectorAll('[class*="MuiListItemButton"]');
            sidebarItems.forEach(item => {
                if (item.textContent.includes('Products') || 
                    item.textContent.includes('Purchase') || 
                    item.textContent.includes('Sales')) {
                    // These might need expanding
                }
            });
            return;
        }

        const rect = el.getBoundingClientRect();
        const padding = 8;

        // Spotlight
        setSpotlightStyle({
            top: rect.top - padding,
            left: rect.left - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
            borderRadius: '12px',
        });

        // Tooltip position
        const tooltipWidth = 380;
        const tooltipHeight = 240;
        let top, left;

        switch (position) {
            case 'right':
                top = rect.top + rect.height / 2 - tooltipHeight / 2;
                left = rect.right + 20;
                if (left + tooltipWidth > window.innerWidth) {
                    left = rect.left - tooltipWidth - 20;
                }
                break;
            case 'bottom':
                top = rect.bottom + 20;
                left = rect.left + rect.width / 2 - tooltipWidth / 2;
                break;
            case 'bottom-left':
                top = rect.bottom + 20;
                left = rect.right - tooltipWidth;
                break;
            default:
                top = rect.bottom + 20;
                left = rect.left;
        }

        // Clamp to viewport
        top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));
        left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

        setTooltipStyle({ top, left, width: tooltipWidth });
    }, []);

    useEffect(() => {
        if (currentStep >= 0) {
            // Small delay to let any sidebar animations complete
            const timer = setTimeout(() => positionTooltip(currentStep), 150);
            return () => clearTimeout(timer);
        }
    }, [currentStep, positionTooltip]);

    useEffect(() => {
        const handleResize = () => {
            if (currentStep >= 0) positionTooltip(currentStep);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentStep, positionTooltip]);

    const handleNext = () => {
        if (currentStep >= TUTORIAL_STEPS.length - 1) {
            finishTutorial();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else if (currentStep === 0) {
            setCurrentStep(-1);
        }
    };

    const finishTutorial = () => {
        setIsVisible(false);
        localStorage.setItem('nexora_onboarding_done', 'true');
        setTimeout(() => {
            if (onComplete) onComplete();
        }, 400);
    };

    const skipTutorial = () => {
        finishTutorial();
    };

    const progress = currentStep >= 0 ? ((currentStep + 1) / TUTORIAL_STEPS.length) * 100 : 0;

    if (!isVisible) return null;

    // Welcome Screen
    if (currentStep === -1) {
        return (
            <Fade in={true} timeout={600}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <Grow in={true} timeout={800}>
                        <Box
                            sx={{
                                maxWidth: 520,
                                width: '90%',
                                backgroundColor: '#1E1E2E',
                                borderRadius: '24px',
                                p: 5,
                                textAlign: 'center',
                                border: '1px solid rgba(124, 92, 252, 0.3)',
                                boxShadow: '0 24px 80px rgba(124, 92, 252, 0.15), 0 0 0 1px rgba(124, 92, 252, 0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Decorative gradient orb */}
                            <Box sx={{
                                position: 'absolute',
                                top: '-60px',
                                right: '-60px',
                                width: 200,
                                height: 200,
                                backgroundColor: 'rgba(124, 92, 252, 0.1)',
                                borderRadius: '50%',
                            }} />
                            <Box sx={{
                                position: 'absolute',
                                bottom: '-40px',
                                left: '-40px',
                                width: 160,
                                height: 160,
                                backgroundColor: 'rgba(124, 92, 252, 0.05)',
                                borderRadius: '50%',
                            }} />

                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '20px',
                                        backgroundColor: '#7C5CFC',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3,
                                        boxShadow: '0 8px 32px rgba(124, 92, 252, 0.3)',
                                    }}
                                >
                                    <RocketLaunchOutlined sx={{ fontSize: 40, color: '#fff' }} />
                                </Box>

                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 1.5, letterSpacing: -0.5 }}>
                                    Welcome to Nexora!
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', mb: 4, lineHeight: 1.7, fontSize: 16 }}>
                                    Let us take you on a quick tour of your new enterprise workspace.
                                    It only takes a minute.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Button
                                        variant="text"
                                        onClick={skipTutorial}
                                        sx={{
                                            color: 'rgba(255,255,255,0.5)',
                                            textTransform: 'none',
                                            fontWeight: 500,
                                            fontSize: 15,
                                            px: 3,
                                            py: 1.5,
                                            '&:hover': { color: 'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.05)' }
                                        }}
                                    >
                                        Skip Tour
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            backgroundColor: '#7C5CFC',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: 15,
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: '14px',
                                            boxShadow: '0 4px 20px rgba(124, 92, 252, 0.35)',
                                            '&:hover': {
                                                backgroundColor: '#6A4DDF',
                                                boxShadow: '0 6px 28px rgba(124, 92, 252, 0.45)',
                                            }
                                        }}
                                    >
                                        Start Tour
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Grow>
                </Box>
            </Fade>
        );
    }

    const step = TUTORIAL_STEPS[currentStep];
    const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

    return (
        <Box
            ref={overlayRef}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
                pointerEvents: 'auto',
            }}
        >
            {/* Overlay with spotlight cutout using box-shadow technique */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                }}
            >
                {/* Dark overlay with cutout */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: spotlightStyle.top || 0,
                        left: spotlightStyle.left || 0,
                        width: spotlightStyle.width || 0,
                        height: spotlightStyle.height || 0,
                        borderRadius: spotlightStyle.borderRadius || '12px',
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 10000,
                        pointerEvents: 'none',
                        border: '2px solid rgba(124, 92, 252, 0.5)',
                    }}
                >
                    {/* Pulsing ring */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -6,
                            left: -6,
                            right: -6,
                            bottom: -6,
                            borderRadius: 'inherit',
                            border: '2px solid rgba(124, 92, 252, 0.3)',
                            animation: 'onboarding-pulse 2s ease-in-out infinite',
                            '@keyframes onboarding-pulse': {
                                '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                                '50%': { opacity: 0.8, transform: 'scale(1.02)' },
                            },
                        }}
                    />
                </Box>

                {/* Click blocker for the overlay area (not the spotlight) */}
                <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                    }}
                />

                {/* Tooltip Card */}
                <Fade in={true} timeout={400} key={currentStep}>
                    <Box
                        sx={{
                            position: 'fixed',
                            ...tooltipStyle,
                            zIndex: 10001,
                            backgroundColor: '#1E1E2E',
                            borderRadius: '20px',
                            border: '1px solid rgba(124, 92, 252, 0.25)',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(124, 92, 252, 0.1)',
                            overflow: 'hidden',
                            transition: 'top 0.4s cubic-bezier(0.4, 0, 0.2, 1), left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        {/* Progress bar */}
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 3,
                                backgroundColor: 'rgba(124, 92, 252, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#7C5CFC',
                                    transition: 'transform 0.4s ease',
                                },
                            }}
                        />

                        <Box sx={{ p: 3 }}>
                            {/* Header */}
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                <Box display="flex" alignItems="center" gap={1.5}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '12px',
                                            backgroundColor: 'rgba(124, 92, 252, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid rgba(124, 92, 252, 0.2)',
                                        }}
                                    >
                                        {React.cloneElement(step.icon, { sx: { color: '#7C5CFC', fontSize: 22 } })}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2, fontSize: 16 }}>
                                            {step.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                                            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton
                                    onClick={skipTutorial}
                                    size="small"
                                    sx={{
                                        color: 'rgba(255,255,255,0.3)',
                                        '&:hover': { color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.05)' },
                                    }}
                                >
                                    <Close fontSize="small" />
                                </IconButton>
                            </Box>

                            {/* Description */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'rgba(255,255,255,0.6)',
                                    lineHeight: 1.7,
                                    mb: 3,
                                    fontSize: 14,
                                }}
                            >
                                {step.description}
                            </Typography>

                            {/* Step indicators */}
                            <Box display="flex" gap={0.5} mb={2.5}>
                                {TUTORIAL_STEPS.map((_, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            height: 4,
                                            flex: 1,
                                            borderRadius: 2,
                                            backgroundColor: i <= currentStep ? '#7C5CFC' : 'rgba(255,255,255,0.1)',
                                            transition: 'background-color 0.3s ease',
                                        }}
                                    />
                                ))}
                            </Box>

                            {/* Buttons */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Button
                                    onClick={handleBack}
                                    startIcon={<ArrowBack />}
                                    disabled={currentStep === 0}
                                    sx={{
                                        color: 'rgba(255,255,255,0.5)',
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: 14,
                                        '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)' },
                                        '&.Mui-disabled': { color: 'rgba(255,255,255,0.15)' },
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    variant="contained"
                                    endIcon={isLastStep ? <CheckCircleOutline /> : <ArrowForward />}
                                    sx={{
                                        backgroundColor: '#7C5CFC',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: 14,
                                        px: 3,
                                        py: 1,
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 16px rgba(124, 92, 252, 0.3)',
                                        '&:hover': {
                                            backgroundColor: '#6A4DDF',
                                            boxShadow: '0 6px 24px rgba(124, 92, 252, 0.4)',
                                        }
                                    }}
                                >
                                    {isLastStep ? 'Finish' : 'Next'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Box>
        </Box>
    );
};

export default OnboardingTutorial;
