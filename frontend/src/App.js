import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';

import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import PartnerDashboard from './pages/partners/PartnerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Unauthorized from './pages/Unauthorized';
import RegisterPage from './pages/RegisterPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import CustomerOrders from './pages/customer/CustomerOrders';
import TrackOrder from './pages/TrackOrder';
import PartnerOrders from './pages/partners/PartnerOrders';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/customer/dashboard"
          element={
            <PrivateRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/partner/dashboard"
          element={
            <PrivateRoute allowedRoles={['delivery']}>
              <PartnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/customer/orders" element={<CustomerOrders />} />
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          <Route path="/partner/orders" element={<PartnerOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
