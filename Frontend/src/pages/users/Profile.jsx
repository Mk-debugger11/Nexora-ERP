import React, { useState, useEffect } from "react";
import { Box, Typography, Breadcrumbs, Grid, Card, CardContent, Divider, Avatar, CircularProgress, LinearProgress } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useApi from "../../hooks/APIHandler";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [activityData, setActivityData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const { loading, callApi } = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await callApi({ url: 'auth/myprofile/', method: 'GET' });
            if (res) {
                setProfileData(res.data.data);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profileData?.id) {
            fetchActivityLogs();
        }
    }, [profileData?.id, paginationModel]);

    const fetchActivityLogs = async () => {
        const res = await callApi({ 
            url: `auth/activitylog/${profileData.id}/`, 
            method: 'GET',
            params: {
                page: paginationModel.page + 1,
                pageSize: paginationModel.pageSize
            }
        });
        if (res) {
            setActivityData(res.data.data.data);
            setTotalItems(res.data.data.totalItems);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'activity_type', headerName: 'Type', width: 150 },
        { field: 'activity', headerName: 'Activity Description', width: 400 },
        { field: 'activity_ip', headerName: 'IP Address', width: 130 },
        { field: 'activity_device', headerName: 'Device', width: 150 },
        { field: 'activity_date', headerName: 'Date', width: 200 }
    ];

    if (!profileData) {
        return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5" mb={2}>My Profile</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Breadcrumbs>
                    <Typography variant="body2" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>Home</Typography>
                    <Typography variant="body2" color="text.primary">Profile</Typography>
                </Breadcrumbs>
            </Box>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar 
                                src={profileData.profile_pic || ""} 
                                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} 
                            />
                            <Typography variant="h6">{profileData.first_name} {profileData.last_name}</Typography>
                            <Typography color="textSecondary" gutterBottom>{profileData.email}</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box textAlign="left">
                                <Typography variant="body2"><strong>Username:</strong> {profileData.username}</Typography>
                                <Typography variant="body2" mt={1}><strong>Phone:</strong> {profileData.phone || "N/A"}</Typography>
                                <Typography variant="body2" mt={1}><strong>Role:</strong> {profileData.role || "N/A"}</Typography>
                                <Typography variant="body2" mt={1}><strong>Joined:</strong> {profileData.date_joined}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" mb={2}>Activity Logs</Typography>
                            <DataGrid
                                rows={activityData}
                                columns={columns}
                                autoHeight
                                paginationMode="server"
                                rowCount={totalItems}
                                pageSizeOptions={[5, 10, 20]}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                loading={loading}
                                disableRowSelectionOnClick
                                slots={{
                                    loadingOverlay: LinearProgress,
                                    toolbar: GridToolbar,
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;
