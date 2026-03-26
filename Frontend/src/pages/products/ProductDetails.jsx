import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../../hooks/APIHandler';
import { Box, Card, CardContent, Grid, Typography, Divider, Breadcrumbs, Button, CircularProgress, Chip, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { ArrowBack, Inventory, Receipt, ShoppingCart, ViewCompact } from '@mui/icons-material';
import RenderImage from '../../components/RenderImage';
import Image from '../../components/Image';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { callApi, loading, error } = useApi();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            const response = await callApi({ url: `products/details/${id}/`, method: 'GET' });
            if (response && response.data) {
                setProduct(response.data.data);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading || !product) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Breadcrumbs>
                    <Typography variant="body2" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>Home</Typography>
                    <Typography variant="body2" onClick={() => navigate('/manage/product')} sx={{ cursor: 'pointer' }}>Products</Typography>
                    <Typography variant="body2" color="text.primary">{product.name}</Typography>
                </Breadcrumbs>
                <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} variant="outlined">Back</Button>
            </Box>

            <Grid container spacing={3}>
                {/* Core Info & Images */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="center" mb={2}>
                                {Array.isArray(product.image) && product.image.length > 0 ? (
                                    <Image src={product.image[0]} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No Image</Typography>
                                )}
                            </Box>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>{product.name}</Typography>
                            <Box display="flex" gap={1} mb={2}>
                                <Chip label={product.status} color={product.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                                <Chip label={`Stock: ${product.current_stock}`} color={product.current_stock > product.stock_alert_quantity ? 'primary' : 'error'} size="small" />
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2"><strong>SKU:</strong> {product.sku}</Typography>
                            <Typography variant="body2"><strong>Barcode:</strong> {product.barcode || 'N/A'}</Typography>
                            <Typography variant="body2"><strong>Brand:</strong> {product.brand}</Typography>
                            <Typography variant="body2"><strong>Category:</strong> {product.category_id}</Typography>
                            <Typography variant="body2"><strong>Supplier:</strong> {product.supplier_id || 'N/A'}</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2"><strong>Purchase Price:</strong> ${product.initial_buying_price}</Typography>
                            <Typography variant="body2"><strong>Selling Price:</strong> ${product.initial_selling_price}</Typography>
                            <Typography variant="body2"><strong>Tax:</strong> {product.tax_percentage}%</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Additional Details */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Description & Specifications</Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {product.description}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2"><strong>Weight:</strong> {product.weight} {product.uom}</Typography>
                                            <Typography variant="body2"><strong>Dimensions:</strong> {product.dimensions}</Typography>
                                            <Typography variant="body2"><strong>Color:</strong> {product.color}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2"><strong>Questions:</strong> {product.questions_count}</Typography>
                                            <Typography variant="body2"><strong>Reviews:</strong> {product.reviews_count}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Inventory Summary */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <Inventory color="primary" />
                                        <Typography variant="h6">Inventory Summary</Typography>
                                    </Box>
                                    {product.inventory_summary?.length > 0 ? (
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Warehouse</TableCell>
                                                    <TableCell>Location</TableCell>
                                                    <TableCell>Quantity</TableCell>
                                                    <TableCell>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {product.inventory_summary.map((inv, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>{inv.warehouse_id__name}</TableCell>
                                                        <TableCell>{inv.rack_shelf_floor_id__name}</TableCell>
                                                        <TableCell>{inv.quantity}</TableCell>
                                                        <TableCell><Chip size="small" label={inv.stock_status} color={inv.stock_status==='IN_STOCK'?'success':'default'} /></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">No inventory data available.</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* History */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <ShoppingCart color="primary" />
                                        <Typography variant="h6">Recent Purchases</Typography>
                                    </Box>
                                    {product.purchase_history?.length > 0 ? (
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>PO #</TableCell>
                                                    <TableCell>Qty</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {product.purchase_history.map((ph, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>{ph.purchase_order_id__id}</TableCell>
                                                        <TableCell>{ph.quantity}</TableCell>
                                                        <TableCell>${ph.buy_price}</TableCell>
                                                        <TableCell>{new Date(ph.created_at).toLocaleDateString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">No purchase history.</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <Receipt color="primary" />
                                        <Typography variant="h6">Recent Sales</Typography>
                                    </Box>
                                    {product.sales_history?.length > 0 ? (
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>SO #</TableCell>
                                                    <TableCell>Qty</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {product.sales_history.map((sh, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>{sh.sales_order_id__id}</TableCell>
                                                        <TableCell>{sh.quantity}</TableCell>
                                                        <TableCell>${sh.sell_price}</TableCell>
                                                        <TableCell>{new Date(sh.created_at).toLocaleDateString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">No sales history.</Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductDetails;
