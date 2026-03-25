import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const EmptyState = ({ icon, title, description, actionText, onAction }) => {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 10,
                textAlign: 'center'
            }}
        >
            <Box 
                sx={{ 
                    backgroundColor: 'rgba(124, 92, 252, 0.1)', 
                    color: '#7C5CFC',
                    p: 2.5, 
                    borderRadius: '50%', 
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {React.cloneElement(icon, { sx: { fontSize: 48 } })}
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 4, lineHeight: 1.6 }}>
                {description}
            </Typography>
            {actionText && onAction && (
                <Button variant="contained" color="primary" onClick={onAction}>
                    {actionText}
                </Button>
            )}
        </Box>
    );
};

export default EmptyState;
