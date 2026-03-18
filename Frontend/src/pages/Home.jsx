import React, { useEffect, useState } from 'react';
import { 
    Grid, Card, CardContent, Typography, Box, CircularProgress, 
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { 
    Inventory, ShoppingCart, People, Storefront, LocalShipping, AttachMoney, 
    WarningAmber, ErrorOutline
} from '@mui/icons-material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import useApi from '../hooks/APIHandler';
import { getUser } from '../utils/Helper';
import OnboardingTutorial from '../components/OnboardingTutorial';

const MetricCard = ({ title, value, icon, color }) => (
    <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 24px ${color}33`,
            border: `1px solid ${color}40`
        }
    }}>
        <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                <Box>
                    <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: 12, mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {value !== undefined ? value : <CircularProgress size={20} />}
                    </Typography>
                </Box>
                <Box 
                    sx={{ 
                        backgroundColor: `${color}1A`, 
                        borderRadius: '12px', 
                        p: 1.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}
                >
                    {React.cloneElement(icon, { sx: { color: color, fontSize: 24 } })}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const Home = () => {
    const { callApi } = useApi();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const response = await callApi({ url: 'auth/dashboard/', method: 'GET' });
            if (response && response.data) {
                setData(response.data);
            }
            setLoading(false);
        };
        fetchDashboardData();
    }, []);

    useEffect(() => {
        const onboardingDone = localStorage.getItem('nexora_onboarding_done');
        if (onboardingDone === 'false') {
            // Small delay to let the dashboard render first
            const timer = setTimeout(() => setShowOnboarding(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const user = getUser();

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            {showOnboarding && (
                <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />
            )}
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
                Welcome back, {user?.username}. Here's what's happening with your inventory today.
            </Typography>

            <Grid id="onboarding-dashboard-cards" container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Total Products" value={data?.total_products} icon={<Inventory />} color="#9c27b0" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Total Inventory Value" value={data?.total_inventory} icon={<Storefront />} color="#2e7d32" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Sales Orders" value={data?.total_sales_orders} icon={<ShoppingCart />} color="#ed6c02" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Total Revenue" value={data?.total_revenue ? `₹${data.total_revenue}` : 0} icon={<AttachMoney />} color="#1976d2" />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Purchase Orders" value={data?.total_purchase_orders} icon={<LocalShipping />} color="#0288d1" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Suppliers" value={data?.total_suppliers} icon={<People />} color="#d32f2f" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Low Stock Items" value={data?.low_stock_products} icon={<WarningAmber />} color="#ff9800" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard title="Out of Stock" value={data?.out_of_stock_products} icon={<ErrorOutline />} color="#d32f2f" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Recent Purchase Orders Table */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Recent Purchase Orders
                        </Typography>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>PO Code</TableCell>
                                        <TableCell>Supplier</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
                                        </TableRow>
                                    ) : data?.recent_purchase_orders?.length > 0 ? (
                                        data.recent_purchase_orders.map((po) => (
                                            <TableRow key={po.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">{po.po_code}</TableCell>
                                                <TableCell>{po.supplier_id__username}</TableCell>
                                                <TableCell>{new Date(po.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={po.status} 
                                                        color={
                                                            po.status === 'RECEIVED' ? 'success' : 
                                                            po.status === 'DRAFT' ? 'default' : 
                                                            'primary'
                                                        } 
                                                        size="small" 
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">No recent purchase orders found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* System Summary */}
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Typography variant="h6" gutterBottom component="div">
                            System Summary
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography color="textSecondary">Active Categories</Typography>
                                <Typography fontWeight="bold">{data?.total_categories || 0}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography color="textSecondary">Active Warehouses</Typography>
                                <Typography fontWeight="bold">{data?.total_warehouses || 0}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography color="textSecondary">Registered Customers</Typography>
                                <Typography fontWeight="bold">{data?.total_customers || 0}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                
                {/* Monthly Sales vs Purchases Chart */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Sales vs Purchases (Monthly)
                        </Typography>
                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <CircularProgress />
                            </Box>
                        ) : data?.monthly_chart_data && data.monthly_chart_data.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={data.monthly_chart_data}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="sales" name="Sales" fill="#8884d8" />
                                    <Bar dataKey="purchases" name="Purchases" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <Typography color="textSecondary">No data available for charts.</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;