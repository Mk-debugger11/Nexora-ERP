import { useState,useEffect, useRef } from "react";
import useApi from "../../hooks/APIHandler";
import { useNavigate } from "react-router-dom";
import { Box, Breadcrumbs, Button, Divider, Grid, IconButton, LinearProgress, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { isValidUrl } from "../../utils/Helper";
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ExpandLessRounded from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import ExpanableRow from "./ExpandableRow";
import RenderImage from "../../components/RenderImage";
import { Close, PanoramaRounded } from "@mui/icons-material";
import Image from "../../components/Image";
import { toast } from 'react-toastify';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Chip } from "@mui/material";

const ManageCategories = () => {
    const [data,setData]=useState([]);
    const [columns,setColumns]=useState([]);
    const [paginationModel,setPaginationModel]=useState({
        page:0,
        pageSize:5
    })
    const [totalItems,setTotalItems]=useState(0);
    const [searchQuery,setSearchQuery]=useState("");
    const [debounceSearch,setDebounceSearch]=useState("");
    const [ordering,setOrdering]=useState([{field:'id',sort:'desc'}]);
    const [showImages,setShowImages]=useState(false);
    const [selectedImages,setSelectedImages]=useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const {error,loading,callApi}=useApi();    
    const divImage=useRef();
    const navigate=useNavigate();

    useEffect(()=>{
        const timer=setTimeout(()=>{
            setDebounceSearch(searchQuery);
        },1000)

        return ()=>{
            clearTimeout(timer);
        }
    },[searchQuery])

    const getCategories=async()=>{
        let order='-id';
        if(ordering.length>0){
            order=ordering[0].sort==='asc'?ordering[0].field:'-'+ordering[0].field
        }
        const result=await callApi({url:'products/category/',method:'GET',params:{
            page:paginationModel.page+1,
            pageSize:paginationModel.pageSize,
            search:debounceSearch,
            ordering:order
        }})
        if(result){
            setData(result.data.data.data);
            setTotalItems(result.data.data.totalItems);
            generateColumns(result.data.data.data);
        }
    }

    const onDeleteClick=(params)=>{
        setCategoryToDelete(params.row);
        setDeleteDialogOpen(true);
    }
    
    const confirmDelete = async () => {
        if(!categoryToDelete) return;
        const result = await callApi({ url: `products/category/delete/${categoryToDelete.id}/`, method: 'DELETE' });
        if(result){
            toast.success("Category deleted successfully");
            getCategories();
        }
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
    }

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
    }

    const onToggleStatus = async (params) => {
        const result = await callApi({ url: `products/category/toggle-status/${params.row.id}/`, method: 'PUT' });
        if(result){
            toast.success("Status toggled successfully");
            getCategories();
        }
    }

    const onEditClick=(params)=>{
        navigate(`/form/category/${params.row.id}`)
    }
    const onAddClick=(params)=>{
        navigate('/form/category')
    }

    const generateColumns=(data)=>{
        if(data.length>0){
            const columns=[{field:'action',headerName:'Action',width:220,sortable:false,renderCell:(params)=>{
                return <>
                    <IconButton onClick={()=>onAddClick(params)}>
                        <Add color="light" />
                    </IconButton>
                    <IconButton onClick={()=>onEditClick(params)}>
                        <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={()=>onToggleStatus(params)}>
                        {params.row.status === 'ACTIVE' ? <ToggleOnIcon color="success" /> : <ToggleOffIcon color="action" />}
                    </IconButton>
                    <IconButton onClick={()=>onDeleteClick(params)}>
                        <Delete color="secondary" />
                    </IconButton>
                </>
            }},{field:'expand',headerName:'Expand',width:100,sortable:false,renderCell:(params)=>{
                return (<IconButton onClick={()=>{
                    const updatedRows=data.map((row)=>{
                            if(row.id===params.row.id){
                                if(row?.open){
                                    row.open=false;
                                }
                                else{
                                    row.open=true;
                                }
                            }
                            return row;
                    })
                    setData([...updatedRows]);

                }}>
                    {params.row?.open?<ExpandLessRounded/>:<ExpandMoreRounded/>}
                </IconButton>)
            }}];
            for(const key in data[0]){
                if(['domain_user_id', 'added_by_user_id'].includes(key)){
                    continue; // Skip raw internal fields
                }
                if(key==='children'){
                    columns.push({field:key,headerName:'Subcategories',width:150,sortable:false,renderCell:(params)=>{
                        return <Typography variant="body2" pt={3} pb={3}>{params.row.children?.length}</Typography>
                    }})
                }
                else if(key==='image'){
                    columns.push({field:key,headerName:key.charAt(0).toUpperCase()+key.slice(1).replaceAll("_"," "),width:150,sortable:false,renderCell:(params)=>{
                        return <Box display={"flex"}><RenderImage data={params.row.image} name={params.row.name}/><IconButton onClick={()=>{ setSelectedImages(params.row.image); setShowImages(true); }}><PanoramaRounded/></IconButton></Box>
                    }})
                }
                else if(key==='status'){
                    columns.push({field:key,headerName:'Status',width:130,renderCell:(params)=>{
                        return <Chip size="small" label={params.row.status} color={params.row.status === 'ACTIVE' ? 'success' : 'default'} />
                    }})
                }
                else if(key==='products_count'){
                    columns.push({field:key,headerName:'Products Count',width:130})
                }
                else{
                    columns.push({field:key,headerName:key.charAt(0).toUpperCase()+key.slice(1).replaceAll("_"," "),width:150})
                }
            }
            setColumns(columns);
        }
    }

    const handleSorting=(newModel)=>{
        setOrdering(newModel);
    }

    useEffect(()=>{
        if(showImages){
            divImage.current.scrollIntoView({behavior:'smooth'})
        }
    },[selectedImages])

    useEffect(()=>{
        getCategories();
    },[paginationModel,debounceSearch,ordering])

    return (
        <Box component={"div"} sx={{width:'100%'}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Breadcrumbs>
                    <Typography variant="body2" onClick={()=>navigate('/')} sx={{cursor:'pointer'}}>Home</Typography>
                    <Typography variant="body2" onClick={()=>navigate('/manage/category')} sx={{cursor:'pointer'}}>Manage Category</Typography>
                </Breadcrumbs>
                <Button variant="contained" onClick={()=>navigate('/form/category')} startIcon={<Add />}>Add Category</Button>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={showImages?8:12} lg={showImages?9:12}>
            <TextField label="Search" variant="outlined" fullWidth onChange={(e)=>setSearchQuery(e.target.value)} margin="normal"/>
            <DataGrid
                rows={data}
                columns={columns}
                rowHeight={75}
                autoHeight={true}
                sortingOrder={['asc','desc']}
                sortModel={ordering}
                onSortModelChange={handleSorting}
                paginationMode="server"
                initialState={{
                    ...data.initialState,
                    pagination:{paginationModel:paginationModel}
                }}
                pageSizeOptions={[5,10,20]}
                pagination
                rowCount={totalItems}
                loading={loading}
                rowSelection={false}
                onPaginationModelChange={(pagedetails)=>{
                    setPaginationModel({
                        page:pagedetails.page,
                        pageSize:pagedetails.pageSize
                    
                    })
                }}
                slots={
                    {

                        loadingOverlay:LinearProgress,
                        toolbar:GridToolbar,
                        row:(props)=>{
                            return <ExpanableRow row={props.row} props={props} onEditClick={onEditClick} onDeleteClick={onDeleteClick} onToggleStatus={onToggleStatus} setSelectedImages={setSelectedImages} setShowImages={setShowImages}/>
                        }
                    }
                }

                />
                </Grid>
                    {showImages && <Grid item xs={12} sm={4} lg={3} sx={{height:'600px',overflowY:'auto'}} ref={divImage}>
                        <Box m={2} display={"flex"} justifyContent={"space-between"}>
                            <Typography variant="h6">Category Images</Typography>
                            <IconButton onClick={()=>setShowImages(false)}><Close/></IconButton>
                        </Box>
                        <Divider/>
                         {
                            selectedImages.length>0 && selectedImages.map((image,index)=>(
                                <Box key={index} display="flex" justifyContent="center" alignItems="center" p={1}>
                                    <Image src={image} style={{width:'100%'}} />
                                </Box>
                            ))
                         }
                    </Grid>}
                </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the category "{categoryToDelete?.name}"? 
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">Cancel</Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ManageCategories;