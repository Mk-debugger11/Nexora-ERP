import React, { useState, useEffect, useRef } from "react";
import useApi from "../../hooks/APIHandler";
import { useNavigate } from "react-router-dom";
import { Box, Breadcrumbs, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, LinearProgress, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { toast } from 'react-toastify';
import { Inventory, WarningAmber, CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import Circle from '@mui/icons-material/Circle';

const ManageInventory = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [debounceSearch, setDebounceSearch] = useState("");
    const [ordering, setOrdering] = useState([{ field: 'id', sort: 'desc' }]);
    const { error, loading, callApi } = useApi();
    const [summary, setSummary] = useState(null);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
    const [adjustItem, setAdjustItem] = useState(null);
    const [adjustQty, setAdjustQty] = useState(0);
    const [adjustReason, setAdjustReason] = useState('');
    const [logsDialogOpen, setLogsDialogOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [logColumns, setLogColumns] = useState([]);
    const [filterFields, setFilterFields] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(searchQuery);
        }, 1000);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const getInventory = async () => {
        let order = '-id';
        if (ordering.length > 0) {
            order = ordering[0].sort === 'asc' ? ordering[0].field : '-' + ordering[0].field;
        }
        const result = await callApi({
            url: 'inventory/inventory/', method: 'GET', params: {
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize,
                search: debounceSearch,
                ordering: order
            }
        });
        if (result) {
            setData(result.data.data.data);
            setTotalItems(result.data.data.totalItems);
            if(result.data.data.filterFields) setFilterFields(result.data.data.filterFields);
            generateColumns(result.data.data.data);
        }
    }

    const getSummary = async () => {
        const result = await callApi({ url: 'inventory/inventory/summary/', method: 'GET' });
        if (result) setSummary(result.data.data);
    }

    const getLowStock = async () => {
        const result = await callApi({ url: 'inventory/inventory/low-stock/', method: 'GET' });
        if (result) setLowStockItems(result.data.data);
    }

    const onAdjustClick = (params) => {
        setAdjustItem(params.row);
        setAdjustQty(params.row.quantity);
        setAdjustReason('');
        setAdjustDialogOpen(true);
    }

    const confirmAdjust = async () => {
        if (!adjustItem) return;
        const result = await callApi({
            url: 'inventory/inventory/adjust/', method: 'POST', body: {
                inventory_id: adjustItem.id,
                quantity: adjustQty,
                reason: adjustReason || 'Manual Adjustment'
            }
        });
        if (result) {
            toast.success(result.data.message);
            getInventory();
            getSummary();
        }
        setAdjustDialogOpen(false);
        setAdjustItem(null);
    }

    const viewLogs = async (params) => {
        const result = await callApi({
            url: `inventory/inventory/logs/${params.row.id}/`, method: 'GET', params: { pageSize: 50 }
        });
        if (result && result.data.data.data) {
            setLogs(result.data.data.data);
            setLogsDialogOpen(true);
        }
    }

    const generateColumns = (data) => {
        if (data.length > 0) {
            const columns = [
                {
                    field: 'action', headerName: 'Action', width: 180, sortable: false, renderCell: (params) => {
                        return <>
                            <Button size="small" variant="outlined" onClick={() => onAdjustClick(params)} sx={{ mr: 1 }}>Adjust</Button>
                            <Button size="small" variant="outlined" onClick={() => viewLogs(params)}>Logs</Button>
                        </>
                    }
                },
                { field: 'product_name', headerName: 'Product', width: 200 },
                { field: 'product_sku', headerName: 'SKU', width: 130 },
                { field: 'warehouse_name', headerName: 'Warehouse', width: 160 },
                { field: 'rack_shelf_floor_name', headerName: 'Location', width: 150 },
                { field: 'quantity', headerName: 'Quantity', width: 100 },
                { field: 'batch_number', headerName: 'Batch', width: 130 },
                {
                    field: 'stock_status', headerName: 'Status', width: 130, renderCell: (params) => {
                        const colorMap = { 'IN_STOCK': 'success', 'OUT_OF_STOCK': 'error', 'DAMAGED': 'warning', 'LOST': 'default' };
                        return <Chip size="small" label={params.row.stock_status} color={colorMap[params.row.stock_status] || 'default'} />
                    }
                },
                { field: 'buy_price', headerName: 'Buy Price', width: 110 },
                { field: 'sell_price', headerName: 'Sell Price', width: 110 },
                { field: 'created_at', headerName: 'Created', width: 180 },
            ];
            setColumns(columns);
        }
    }

    const handleSorting = (newModel) => {
        setOrdering(newModel);
    }

    useEffect(() => {
        getInventory();
    }, [paginationModel, debounceSearch, ordering]);

    useEffect(() => {
        getSummary();
        getLowStock();
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Breadcrumbs>
                    <Typography variant="body2" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>Home</Typography>
                    <Typography variant="body2">Manage Inventory</Typography>
                </Breadcrumbs>
            </Box>

            {/* Summary Cards */}
            {summary && (
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card><CardContent>
                            <Typography variant="caption" color="text.secondary">Total Stock</Typography>
                            <Typography variant="h5" fontWeight="bold">{summary.total_stock}</Typography>
                        </CardContent></Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card><CardContent>
                            <Typography variant="caption" color="text.secondary">In Stock</Typography>
                            <Typography variant="h5" fontWeight="bold" color="success.main">{summary.in_stock}</Typography>
                        </CardContent></Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card><CardContent>
                            <Typography variant="caption" color="text.secondary">Damaged</Typography>
                            <Typography variant="h5" fontWeight="bold" color="warning.main">{summary.damaged}</Typography>
                        </CardContent></Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card><CardContent>
                            <Typography variant="caption" color="text.secondary">Out of Stock</Typography>
                            <Typography variant="h5" fontWeight="bold" color="error.main">{summary.out_of_stock}</Typography>
                        </CardContent></Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card><CardContent>
                            <Typography variant="caption" color="text.secondary">Active Products</Typography>
                            <Typography variant="h5" fontWeight="bold">{summary.total_products}</Typography>
                        </CardContent></Card>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Card><CardContent>
                            <Typography variant="caption" color="text.secondary">Warehouses</Typography>
                            <Typography variant="h5" fontWeight="bold">{summary.total_warehouses}</Typography>
                        </CardContent></Card>
                    </Grid>
                </Grid>
            )}

            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
                <Card sx={{ mb: 3, borderLeft: '4px solid', borderColor: 'error.main' }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <WarningAmber color="error" />
                            <Typography variant="h6">Low Stock Alerts ({lowStockItems.length})</Typography>
                        </Box>
                        <Grid container spacing={1}>
                            {lowStockItems.slice(0, 8).map((item, idx) => (
                                <Grid item xs={12} sm={6} md={3} key={idx}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" p={1} sx={{ borderRadius: 1, bgcolor: 'background.paper' }}>
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">SKU: {item.sku}</Typography>
                                        </Box>
                                        <Chip size="small" label={`${item.current_stock} / ${item.alert_quantity}`} color={item.current_stock === 0 ? 'error' : 'warning'} />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Inventory DataGrid */}
            <TextField label="Search" variant="outlined" fullWidth onChange={(e) => setSearchQuery(e.target.value)} margin="normal" />
            <DataGrid
                rows={data}
                columns={columns}
                autoHeight={true}
                rowHeight={60}
                sortingOrder={['asc', 'desc']}
                sortModel={ordering}
                onSortModelChange={handleSorting}
                paginationMode="server"
                initialState={{
                    pagination: { paginationModel: paginationModel }
                }}
                pageSizeOptions={[5, 10, 20, 50]}
                pagination
                rowCount={totalItems}
                loading={loading}
                rowSelection={false}
                onPaginationModelChange={(pagedetails) => {
                    setPaginationModel({
                        page: pagedetails.page,
                        pageSize: pagedetails.pageSize
                    })
                }}
                slots={{
                    loadingOverlay: LinearProgress,
                    toolbar: GridToolbar,
                }}
            />

            {/* Adjust Dialog */}
            <Dialog open={adjustDialogOpen} onClose={() => setAdjustDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Adjust Inventory</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Adjusting inventory for: <strong>{adjustItem?.product_name}</strong> at <strong>{adjustItem?.warehouse_name}</strong>
                    </DialogContentText>
                    <TextField
                        label="New Quantity"
                        type="number"
                        fullWidth
                        value={adjustQty}
                        onChange={(e) => setAdjustQty(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Reason for Adjustment"
                        fullWidth
                        multiline
                        rows={2}
                        value={adjustReason}
                        onChange={(e) => setAdjustReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAdjustDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmAdjust} variant="contained" color="primary">Apply Adjustment</Button>
                </DialogActions>
            </Dialog>

            {/* Logs Dialog */}
            <Dialog open={logsDialogOpen} onClose={() => setLogsDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Inventory Logs</DialogTitle>
                <DialogContent>
                    {logs.length > 0 ? logs.map((log, idx) => (
                        <React.Fragment key={idx}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
                                <Box>
                                    <Chip size="small" label={log.status} sx={{ mr: 1 }} />
                                    <Typography variant="body2" component="span">
                                        Qty Change: <strong>{log.quantity > 0 ? '+' : ''}{log.quantity}</strong>
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">{log.created_at}</Typography>
                            </Box>
                            {log.additional_details && log.additional_details.map((detail, i) => (
                                <Typography key={i} variant="caption" color="text.secondary" display="block" pl={2}>
                                    {detail.key}: {detail.value}
                                </Typography>
                            ))}
                            <Divider />
                        </React.Fragment>
                    )) : (
                        <Typography variant="body2" color="text.secondary" py={2}>No logs available for this inventory item.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogsDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ManageInventory;
