import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../../hooks/APIHandler";
import { Box, Breadcrumbs, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { CheckCircle, Cancel, LocalShipping, Timeline, Assignment, Receipt } from "@mui/icons-material";

const PurchaseOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { callApi, loading } = useApi();
    const [po, setPo] = useState(null);
    const [items, setItems] = useState([]);
    const [logs, setLogs] = useState([]);
    const [inwards, setInwards] = useState([]);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [grnDialogOpen, setGrnDialogOpen] = useState(false);
    const [grnData, setGrnData] = useState({});
    const [grnInvoice, setGrnInvoice] = useState('');
    const [grnNotes, setGrnNotes] = useState('');

    const fetchDetails = async () => {
        const res = await callApi({ url: `orders/purchaseOrder/details/${id}/`, method: 'GET' });
        if (res) {
            setPo(res.data.data.po);
            setItems(res.data.data.items);
            setLogs(res.data.data.logs);
            setInwards(res.data.data.inwards);
            
            // init GRN data
            const initialGrn = {};
            res.data.data.items.forEach(item => {
                const remaining = item.quantity_ordered - item.quantity_received;
                if (remaining > 0) {
                    initialGrn[item.id] = remaining;
                }
            });
            setGrnData(initialGrn);
        }
    };

    useEffect(() => {
        if (id) fetchDetails();
    }, [id]);

    const handleStatusUpdate = async (status, reason = '') => {
        const body = { status };
        if (reason) body.reason = reason;
        const res = await callApi({ url: `orders/purchaseOrder/status/${id}/`, method: 'POST', body });
        if (res) {
            toast.success(res.data.message);
            setCancelDialogOpen(false);
            fetchDetails();
        }
    };

    const handleGrnSubmit = async () => {
        const itemsToReceive = Object.keys(grnData).map(itemId => ({
            po_item_id: parseInt(itemId),
            quantity_received: parseInt(grnData[itemId]),
            warehouse_id: po.warehouse_id, // assuming receiving into original PO warehouse
        })).filter(i => i.quantity_received > 0);

        if (itemsToReceive.length === 0) {
            toast.error("Please enter at least one item quantity to receive");
            return;
        }

        const body = {
            invoice_number: grnInvoice,
            notes: grnNotes,
            items: itemsToReceive
        };

        const res = await callApi({ url: `orders/purchaseOrder/receive/${id}/`, method: 'POST', body });
        if (res) {
            toast.success(res.data.message);
            setGrnDialogOpen(false);
            setGrnInvoice('');
            setGrnNotes('');
            fetchDetails();
        }
    };

    if (!po) return null;

    const getStatusColor = (status) => {
        const colors = {
            'DRAFT': 'default', 'CREATED': 'info', 'APPROVED': 'primary',
            'RECEIVED': 'success', 'PARTIAL RECEIVED': 'warning', 'CANCELLED': 'error'
        };
        return colors[status] || 'default';
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Breadcrumbs>
                    <Typography variant="body2" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>Home</Typography>
                    <Typography variant="body2" onClick={() => navigate('/manage/purchaseorder')} sx={{ cursor: 'pointer' }}>Manage Purchase Order</Typography>
                    <Typography variant="body2">PO Details</Typography>
                </Breadcrumbs>
                <Box>
                    {(po.status === 'DRAFT' || po.status === 'CREATED') && (
                        <>
                            <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleStatusUpdate('APPROVED')} startIcon={<CheckCircle />}>Approve</Button>
                            <Button variant="outlined" color="error" onClick={() => setCancelDialogOpen(true)} startIcon={<Cancel />}>Cancel</Button>
                        </>
                    )}
                    {(po.status === 'APPROVED' || po.status === 'PARTIAL RECEIVED') && (
                        <Button variant="contained" color="success" onClick={() => setGrnDialogOpen(true)} startIcon={<LocalShipping />}>Receive Goods (GRN)</Button>
                    )}
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* PO Summary */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="h5" display="flex" alignItems="center" gap={1}><Assignment color="primary" /> PO #{po.po_code}</Typography>
                                <Chip label={po.status} color={getStatusColor(po.status)} />
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="textSecondary">Supplier</Typography>
                                    <Typography variant="body1">{po.supplier_id}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="textSecondary">Warehouse</Typography>
                                    <Typography variant="body1">{po.warehouse_id}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="textSecondary">Expected Delivery</Typography>
                                    <Typography variant="body1">{new Date(po.expected_delivery_date).toLocaleDateString()}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="textSecondary">Payment Terms</Typography>
                                    <Typography variant="body1">{po.payment_terms}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" color="textSecondary">Payment Status</Typography>
                                    <Typography variant="body1">{po.payment_status}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* PO Items */}
                    <Typography variant="h6" mb={2}>Ordered Items</Typography>
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>SKU</TableCell>
                                    <TableCell align="right">Qty Ordered</TableCell>
                                    <TableCell align="right">Qty Received</TableCell>
                                    <TableCell align="right">Pending</TableCell>
                                    <TableCell align="right">Buy Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.product_name}</TableCell>
                                        <TableCell>{item.sku}</TableCell>
                                        <TableCell align="right">{item.quantity_ordered}</TableCell>
                                        <TableCell align="right">
                                            <Chip size="small" label={item.quantity_received} color={item.quantity_received >= item.quantity_ordered ? 'success' : item.quantity_received > 0 ? 'warning' : 'default'} />
                                        </TableCell>
                                        <TableCell align="right">{item.quantity_ordered - item.quantity_received}</TableCell>
                                        <TableCell align="right">₹{item.buying_price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Inwards History */}
                    {inwards.length > 0 && (
                        <>
                            <Typography variant="h6" mb={2} display="flex" alignItems="center" gap={1}><Receipt /> Goods Receipt Notes (GRN)</Typography>
                            {inwards.map((inv) => (
                                <Card key={inv.id} sx={{ mb: 2, bgcolor: 'background.default' }}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">Invoice: {inv.invoice_number || 'N/A'}</Typography>
                                                <Typography variant="caption" color="textSecondary">Received: {new Date(inv.inwarded_at).toLocaleString()}</Typography>
                                            </Box>
                                            <Box textAlign="right">
                                                <Typography variant="body2">Items: {inv.items_count} | Qty: {inv.total_qty}</Typography>
                                                <Chip size="small" label={inv.status} color="success" sx={{ mt: 0.5 }} />
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    )}
                </Grid>

                {/* Timeline */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" mb={2} display="flex" alignItems="center" gap={1}><Timeline color="action" /> Timeline</Typography>
                            {logs.map((log, index) => (
                                <Box key={log.id} sx={{ position: 'relative', pl: 3, pb: 2 }}>
                                    {index !== logs.length - 1 && <Box sx={{ position: 'absolute', left: '7px', top: '24px', bottom: 0, width: '2px', bgcolor: 'divider' }} />}
                                    <Box sx={{ position: 'absolute', left: 0, top: '4px', width: '16px', height: '16px', borderRadius: '50%', bgcolor: 'primary.main', border: '3px solid white', boxShadow: 1 }} />
                                    <Typography variant="body2" fontWeight="bold">{log.comment}</Typography>
                                    <Typography variant="caption" color="textSecondary" display="block">{new Date(log.created_at).toLocaleString()} by {log.created_by}</Typography>
                                    {log.additional_details && log.additional_details.map((detail, idx) => (
                                        <Typography key={idx} variant="caption" color="textSecondary" display="block">
                                            - {detail.key}: {detail.value}
                                        </Typography>
                                    ))}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Cancel Dialog */}
            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Cancel Purchase Order</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus margin="dense" label="Cancellation Reason" type="text" fullWidth multiline rows={3}
                        value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>Back</Button>
                    <Button onClick={() => handleStatusUpdate('CANCELLED', cancelReason)} color="error" variant="contained">Confirm Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* GRN Dialog */}
            <Dialog open={grnDialogOpen} onClose={() => setGrnDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Receive Goods (GRN)</DialogTitle>
                <DialogContent>
                    <Box display="flex" gap={2} mb={3} mt={1}>
                        <TextField label="Invoice Number" variant="outlined" fullWidth size="small" value={grnInvoice} onChange={(e) => setGrnInvoice(e.target.value)} />
                        <TextField label="Notes" variant="outlined" fullWidth size="small" value={grnNotes} onChange={(e) => setGrnNotes(e.target.value)} />
                    </Box>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell align="right">Pending</TableCell>
                                <TableCell align="right">Receiving Now</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => {
                                const pending = item.quantity_ordered - item.quantity_received;
                                if (pending <= 0) return null;
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.product_name} ({item.sku})</TableCell>
                                        <TableCell align="right">{pending}</TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                type="number" size="small" sx={{ width: 100 }}
                                                inputProps={{ min: 0, max: pending }}
                                                value={grnData[item.id] !== undefined ? grnData[item.id] : 0}
                                                onChange={(e) => {
                                                    const val = Math.min(Math.max(0, parseInt(e.target.value) || 0), pending);
                                                    setGrnData({ ...grnData, [item.id]: val });
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setGrnDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleGrnSubmit} color="success" variant="contained">Confirm Receive</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PurchaseOrderDetails;
