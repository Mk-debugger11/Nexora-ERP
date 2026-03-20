import './App.css';
import Home from './pages/Home';
import Layout from './layout/layout';
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute';
import {ToastContainer} from 'react-toastify';
import Auth from './pages/Auth';
import store from './redux/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { fetchSidebar } from './redux/reducer/sidebardata';
import { useEffect,useState } from 'react';
import DynamicForm from './pages/DynamicForm';
import 'react-toastify/dist/ReactToastify.css';
import './style/style.css';
import ManageCategories from './pages/category/ManageCategories';
import ManageProducts from './pages/products/ManageProducts';
import ProductDetails from './pages/products/ProductDetails';
import Error404Page from './pages/Error404Page';
import ManageWarhouse from './pages/warehouse/ManageWarehouse';
import ManageUsers from './pages/users/ManageUsers';
import ManageModuleUrls from './pages/module/ManageModuleUrls';
import ManageInventory from './pages/inventory/ManageInventory';
import PurchaseOrderDetails from './pages/purchaseorder/PurchaseOrderDetails';
import CreatePurchaseOrder from './pages/purchaseorder/CreatePurchaseOrder';
import ManagePurchaseOrder from './pages/purchaseorder/ManagePurchaseOrder';
import CreateSalesOrder from './pages/salesorder/CreateSalesOrder';
import ManageSalesOrder from './pages/salesorder/ManageSalesOrder';
import SalesOrderDetails from './pages/salesorder/SalesOrderDetails';
import Invoice from './pages/salesorder/Invoice';
import GlobalManageReviews from './pages/products/GlobalManageReview';
import GlobalManageQuestions from './pages/products/GlobalManageQuestions';
import Profile from './pages/users/Profile';
import ManageReports from './pages/reports/ManageReports';
import ManageSettings from './pages/settings/ManageSettings';
function App() {
  const {status,error,items}=useSelector(state=>state.sidebardata);
  const {isLoggedIn}=useSelector(state=>state.isLoggedInReducer);
  const dispatch=useDispatch();
  
  useEffect(()=>{
    if(status=='idle'){
      dispatch(fetchSidebar());
    }
  },[status,dispatch])
  
  useEffect(()=>{
    if(isLoggedIn){
      dispatch(fetchSidebar());
    }
  },[isLoggedIn])
  const router=createBrowserRouter(
    [
      {path:"/auth",element:<Auth/>},
      {
        path:"/",
        element:<Layout sidebarList={items}/>,
        errorElement:<Layout sidebarList={items} childPage={<Error404Page/>}/>,
        children:[
          {path:"/",element:<ProtectedRoute element={<Home/>}/>},
          {path:"/home",element:<ProtectedRoute element={<Home/>}/>},
          {path:"/form/:formName/:id?",element:<ProtectedRoute element={<DynamicForm/>}/>},
          {path:"/manage/category",element:<ProtectedRoute element={<ManageCategories/>}/>},
          {path:"/manage/product",element:<ProtectedRoute element={<ManageProducts/>}/>},
          {path:"/product/details/:id",element:<ProtectedRoute element={<ProductDetails/>}/>},
          {path:"/manage/warehouse",element:<ProtectedRoute element={<ManageWarhouse/>}/>},
          {path:"/manage/users",element:<ProtectedRoute element={<ManageUsers/>}/>},
          {path:"/manage/moduleurls",element:<ProtectedRoute element={<ManageModuleUrls/>}/>},
          {path:"/create/po",element:<ProtectedRoute element={<CreatePurchaseOrder/>}/>},
          {path:"/create/po/:id?",element:<ProtectedRoute element={<CreatePurchaseOrder/>}/>},
          {path:"/po/details/:id",element:<ProtectedRoute element={<PurchaseOrderDetails/>}/>},
          {path:"/manage/purchaseorder",element:<ProtectedRoute element={<ManagePurchaseOrder/>}/>},
          {path:"/manage/inventory",element:<ProtectedRoute element={<ManageInventory/>}/>},
          {path:"/create/so",element:<ProtectedRoute element={<CreateSalesOrder/>}/>},
          {path:"/create/so/:id?",element:<ProtectedRoute element={<CreateSalesOrder/>}/>},
          {path:"/so/details/:id",element:<ProtectedRoute element={<SalesOrderDetails/>}/>},
          {path:"/manage/salesorder",element:<ProtectedRoute element={<ManageSalesOrder/>}/>},
          {path:"/invoice/:id",element:<ProtectedRoute element={<Invoice/>}/>},
          {path:"/manage/productreviews",element:<ProtectedRoute element={<GlobalManageReviews/>}/>},
          {path:"/manage/productquestions",element:<ProtectedRoute element={<GlobalManageQuestions/>}/>},
          {path:"/profile",element:<ProtectedRoute element={<Profile/>}/>},
          {path:"/manage/reports",element:<ProtectedRoute element={<ManageReports/>}/>},
          {path:"/manage/settings",element:<ProtectedRoute element={<ManageSettings/>}/>}
        ]},
    ]
  )

  return (
    <>
        <RouterProvider router={router}/>
        <ToastContainer position="bottom-right" theme='colored' autoclose={3000} hideProgressBar={false} style={{marginBottom:'30px'}}/>

    </>
  );
}

export default App;
