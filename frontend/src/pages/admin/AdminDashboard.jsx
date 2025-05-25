import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminOrdersPage from './AdminOrdersPage.jsx';
import axios from 'axios';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchPartners();

    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      window.location.href = '/unauthorized';
    }
  }, []);

 const fetchOrders = async () => {
  try {
    const res = await axios.get('http://13.235.184.207:5000/api/admin/orders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    setOrders(res.data);
  } catch (err) {
    console.error('Error fetching orders:', err);
  }
};

  const fetchPartners = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://13.235.184.207:5000/api/admin/all/partners', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("data", response.data);
    setPartners(response.data);
  } catch (err) {
    console.error('Error fetching partners:', err);
  }
};

  const handleAddProducts = () => {
    navigate('/admin/products');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleAddProducts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow"
          >
            Add Products →
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📦 Recent Orders</h2>
         <AdminOrdersPage/>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">🚚 Delivery Partners</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left border border-gray-200 rounded">
              <thead className="bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="py-2 px-4 border-b">Partner ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner._id} className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">{partner._id}</td>
                    <td className="py-2 px-4 border-b">{partner.name}</td>
                    <td className="py-2 px-4 border-b">{partner.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500';
    case 'accepted':
      return 'bg-blue-500';
    case 'out for delivery':
      return 'bg-purple-600';
    case 'delivered':
      return 'bg-green-600';
    case 'cancelled':
      return 'bg-red-600';
    default:
      return 'bg-gray-500';
  }
};

export default AdminDashboard;
