import React, { useState, useEffect } from 'react';
import { Box, Breadcrumbs, Typography, Tab, Tabs, Button, Card, CardContent, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import useApi from '../../hooks/APIHandler';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';

const ManageReports = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [groupBy, setGroupBy] = useState('month');
    const [reportData, setReportData] = useState([]);
    const { loading, callApi } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        fetchReport();
    }, [currentTab, groupBy]);

    const fetchReport = async () => {
        let url = '';
        if (currentTab === 0) url = `orders/reports/sales/?group_by=${groupBy}`;
        else if (currentTab === 1) url = `orders/reports/purchases/?group_by=${groupBy}`;
        else if (currentTab === 2) url = `orders/reports/inventory/`;

        const res = await callApi({ url, method: 'GET' });
        if (res) {
            if (currentTab === 2) {
                setReportData(res.data.data.items);
            } else {
                setReportData(res.data.data);
            }
        }
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        setReportData([]);
    };

    const exportToCSV = () => {
        if (!reportData || reportData.length === 0) return;
        
        const keys = Object.keys(reportData[0]);
        const csvRows = [];
        
        csvRows.push(keys.join(','));

        for (const row of reportData) {
            const values = keys.map(k => {
                let val = row[k] === null ? '' : row[k];
                val = String(val).replace(/"/g, '""');
                return `"${val}"`;
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${['Sales', 'Purchases', 'Inventory'][currentTab]}_Report.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const getColumns = () => {
        if (currentTab === 0) return [
            { field: 'period', headerName: 'Period', width: 200 },
            { field: 'order_count', headerName: 'Total Orders', width: 150 },
            { field: 'total_qty', headerName: 'Total Qty Sold', width: 150 },
            { field: 'total_sales', headerName: 'Total Revenue ($)', width: 200 }
        ];
        if (currentTab === 1) return [
            { field: 'period', headerName: 'Period', width: 200 },
            { field: 'order_count', headerName: 'Total POs', width: 150 },
            { field: 'total_qty', headerName: 'Total Qty Bought', width: 150 },
            { field: 'total_purchases', headerName: 'Total Spend ($)', width: 200 }
        ];
        if (currentTab === 2) return [
            { field: 'product_name', headerName: 'Product', width: 250 },
            { field: 'sku', headerName: 'SKU', width: 150 },
            { field: 'quantity', headerName: 'Current Stock', width: 150 },
            { field: 'buying_price', headerName: 'Unit Price ($)', width: 150 },
            { field: 'valuation', headerName: 'Valuation ($)', width: 200 }
        ];
        return [];
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
                <Typography variant="h5">Reports & Analytics</Typography>
                <Button variant="contained" startIcon={<DownloadIcon />} onClick={exportToCSV}>
                    Export CSV
                </Button>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Breadcrumbs>
                    <Typography variant="body2" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>Home</Typography>
                    <Typography variant="body2" color="text.primary">Manage Reports</Typography>
                </Breadcrumbs>
            </Box>

            <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Tabs value={currentTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                            <Tab label="Sales Report" />
                            <Tab label="Purchase Report" />
                            <Tab label="Inventory Valuation" />
                        </Tabs>

                        {currentTab !== 2 && (
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Group By</InputLabel>
                                <Select value={groupBy} label="Group By" onChange={(e) => setGroupBy(e.target.value)}>
                                    <MenuItem value="month">Monthly</MenuItem>
                                    <MenuItem value="date">Daily</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </Box>

                    {/* Chart Container */}
                    {reportData.length > 0 && currentTab !== 2 && (
                        <Box sx={{ width: '100%', height: 350, mt: 3, mb: 3 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reportData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="period" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey={currentTab === 0 ? "total_sales" : "total_purchases"} fill={currentTab === 0 ? "#8884d8" : "#82ca9d"} name={currentTab === 0 ? "Revenue ($)" : "Spend ($)"} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    )}

                    {/* DataGrid Container */}
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={reportData.map((row, index) => ({ id: index, ...row }))}
                            columns={getColumns()}
                            pageSizeOptions={[5, 10, 25, 50]}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            loading={loading}
                            disableRowSelectionOnClick
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ManageReports;
