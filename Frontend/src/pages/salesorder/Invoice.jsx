import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../../hooks/APIHandler';
import { Card, CardContent, Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Divider, LinearProgress } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Invoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { callApi, loading } = useApi();
    const [invoiceData, setInvoiceData] = useState(null);

    useEffect(() => {
        if (id) fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        const res = await callApi({ url: `orders/invoice/${id}/`, method: 'GET' });
        if (res) setInvoiceData(res.data.data);
    };

    if (loading || !invoiceData) return <LinearProgress />;

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={3} className="no-print">
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
                <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>Print / Export PDF</Button>
            </Box>
            
            <Card className="print-area">
                <CardContent sx={{ p: 5 }}>
                    <Box display="flex" justifyContent="space-between" mb={4}>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">INVOICE</Typography>
                            <Typography variant="body1"># {invoiceData.invoice_number}</Typography>
                            <Typography variant="body2" color="textSecondary">Date: {new Date(invoiceData.date).toLocaleDateString()}</Typography>
                        </Box>
                        <Box textAlign="right">
                            <Typography variant="h6" fontWeight="bold">DotTech Electronics Pvt. Ltd.</Typography>
                            <Typography variant="body2" color="textSecondary">sales@dottechelectronics.com</Typography>
                            <Typography variant="body2" color="textSecondary">GSTIN: 27ABCDE1234F1Z5</Typography>
                        </Box>
                    </Box>
                    
                    <Divider sx={{ mb: 4 }} />
                    
                    <Box mb={4}>
                        <Typography variant="subtitle2" color="textSecondary">BILLED TO:</Typography>
                        <Typography variant="h6">{invoiceData.customer}</Typography>
                        <Typography variant="body2">{invoiceData.customer_email}</Typography>
                        <Typography variant="body2" mt={1}>Sales Order: {invoiceData.so_code}</Typography>
                    </Box>
                    
                    <Table sx={{ mb: 4 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell><b>Item</b></TableCell>
                                <TableCell align="right"><b>Qty</b></TableCell>
                                <TableCell align="right"><b>Price</b></TableCell>
                                <TableCell align="right"><b>Total</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoiceData.items.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{item.product}</TableCell>
                                    <TableCell align="right">{item.qty}</TableCell>
                                    <TableCell align="right">₹{item.price}</TableCell>
                                    <TableCell align="right">₹{item.total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    <Box display="flex" justifyContent="flex-end">
                        <Box width="50%">
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography>Subtotal</Typography>
                                <Typography>₹{invoiceData.subtotal}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography>Tax (Included)</Typography>
                                <Typography>₹{invoiceData.tax_total}</Typography>
                            </Box>
                            <Divider sx={{ mb: 1 }} />
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" fontWeight="bold">Grand Total</Typography>
                                <Typography variant="h6" fontWeight="bold">₹{invoiceData.grand_total}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
            
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
                    .no-print { display: none !important; }
                }
            `}</style>
        </Box>
    );
};

export default Invoice;
