import React, { useState, useEffect } from 'react';
import { Box, Breadcrumbs, Typography, Card, CardContent, Grid, TextField, Button, CircularProgress } from '@mui/material';
import useApi from '../../hooks/APIHandler';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';

const ManageSettings = () => {
    const { loading, callApi } = useApi();
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        company_name: '',
        company_email: '',
        gst_number: '',
        currency: 'USD',
        timezone: 'UTC'
    });
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsFetching(true);
        const res = await callApi({ url: 'auth/settings/', method: 'GET' });
        if (res && res.data && res.data.data) {
            setSettings({
                company_name: res.data.data.company_name || '',
                company_email: res.data.data.company_email || '',
                gst_number: res.data.data.gst_number || '',
                currency: res.data.data.currency || 'USD',
                timezone: res.data.data.timezone || 'UTC'
            });
        }
        setIsFetching(false);
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await callApi({
            url: 'auth/settings/',
            method: 'POST',
            data: settings
        });
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
                <Typography variant="h5">Company Settings</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Breadcrumbs>
                    <Typography variant="body2" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>Home</Typography>
                    <Typography variant="body2" color="text.primary">Settings</Typography>
                </Breadcrumbs>
            </Box>

            {isFetching ? (
                <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
            ) : (
                <Card elevation={3} sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" mb={3}>Global Configuration</Typography>
                        <form onSubmit={handleSave}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Company Name"
                                        name="company_name"
                                        value={settings.company_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="email"
                                        label="Company Email"
                                        name="company_email"
                                        value={settings.company_email}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="GST / Tax Number"
                                        name="gst_number"
                                        value={settings.gst_number}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Default Currency (e.g. USD, INR)"
                                        name="currency"
                                        value={settings.currency}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Default Timezone"
                                        name="timezone"
                                        value={settings.timezone}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
                                        disabled={loading}
                                        size="large"
                                    >
                                        Save Configuration
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default ManageSettings;
