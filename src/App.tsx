import {Routes, Route} from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import ProductListPage from "@/pages/products/ProductListPage";
import ProductFormPage from "@/pages/products/ProductFormPage";
import RequireAuth from "@/components/RequireAuth.tsx";
import SidebarLayout from "@/layouts/SidebarLayout";
import DashboardPage from "@/pages/DashboardPage.tsx";
import BrandListPage from "@/pages/brands/BrandListPage.tsx";
import CategoryListPage from "@/pages/categories/CategoryListPage.tsx";
import OrderListPage from "@/pages/orders/OrderListPage.tsx";
import UserListPage from "@/pages/users/UserListPage.tsx";
import {ToastContainer} from "react-toastify";


import "react-toastify/dist/ReactToastify.css";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>

                <Route element={<RequireAuth><SidebarLayout/></RequireAuth>}>
                    <Route path="/" element={<DashboardPage/>}/>
                    <Route path="/products" element={<ProductListPage/>}/>
                    <Route path="/products/new" element={<ProductFormPage/>}/>
                    <Route path="/products/:id/edit" element={<ProductFormPage/>}/>
                    <Route path="/brands" element={<BrandListPage/>}/>
                    <Route path="/categories" element={<CategoryListPage/>}/>
                    <Route path="/orders" element={<OrderListPage/>}/>
                    <Route path="/users" element={<UserListPage/>}/>
                </Route>

                <Route path="*" element={<UserListPage/>}/>
            </Routes>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="mt-[70px]"
            />
        </>
    );
}