// File: src/routes/AppRouter.jsx
import { Route, Routes } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import ChiTietDonThue from '../pages/ChiTietDonThue.jsx';
import ChiTietXe from '../pages/ChiTietXe.jsx';
import DangNhap from '../pages/DangNhap';
import DanhSachXe from '../pages/DanhSachXe.jsx';
import DonThue from '../pages/DonThue.jsx';
import GioiThieu from '../pages/GioiThieu';
import LienHe from '../pages/LienHe';
import QuenMatKhau from "../pages/QuenMatKhau";
import ThanhToan from '../pages/ThanhToan';
import TrangChu from '../pages/TrangChu';
import ThanhToanQR from '../pages/ThanhToanQR';
// Admin Pages
// import AdminLayout from '../admin/components/Layout.jsx';
// import AdminDashboard from '../admin/pages/Dashboard.jsx';
// import AdminUsers from '../admin/pages/Users.jsx';
// import AdminCategories from '../admin/pages/Categories.jsx';
// import AdminProducts from '../admin/pages/Products.jsx';
// import AdminProductDetail from '../admin/pages/ProductDetail.jsx';
// import AdminOrders from '../admin/pages/Orders.jsx';
// import AdminOrderDetail from '../admin/pages/OrderDetail.jsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<TrangChu />} />
        <Route path="/" element={<TrangChu />} />
        <Route path="/vehicle" element={<DanhSachXe />} />
        <Route path="/quen-mat-khau" element={<QuenMatKhau />} />
        <Route path="/vehicle/:id" element={<ChiTietXe />} />
        <Route path="/gioi-thieu" element={<GioiThieu />} />
        <Route path="/lien-he" element={<LienHe />} />
        <Route path="/dang-nhap" element={<DangNhap />} />
        <Route path="/thanh-toan" element={<ThanhToan />} />
        <Route path="/don-thue" element={<DonThue />} />
        <Route path="/don-thue/:id" element={<ChiTietDonThue />} />
        <Route path="*" element={<TrangChu />} />
        <Route path="/thanh-toan-qr" element={<ThanhToanQR />} />
      </Route>
      {/* <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/:id" element={<AdminProductDetail />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
      </Route> */}
    </Routes>
  );
};

export default AppRouter;