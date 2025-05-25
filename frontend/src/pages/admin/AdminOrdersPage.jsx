import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://13.235.184.207:5000/api/admin/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOrders(response.data);
  } catch (err) {
    console.error('Error fetching orders:', err);
  }
};
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.deliveryPartner?.name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus ? order.status === filterStatus : true;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      accepted: 'bg-blue-500',
      delivered: 'bg-green-600',
      'out for delivery': 'bg-purple-600',
      cancelled: 'bg-red-600',
    };
    return (
      <span
        className={`text-white text-xs font-semibold px-2 py-1 rounded ${colors[status] || 'bg-gray-500'}`}
      >
        {status}
      </span>
    );
  };

  return (
    // <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">All Orders</h1> */}

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by customer or partner"
            className="w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="w-full md:w-1/4 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="out for delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-200 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Partner</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition border-b"
                >
                  <td className="p-3 text-sm">{order._id}</td>
                  <td className="p-3 text-sm">{order.customer?.name || 'N/A'}</td>
                  <td className="p-3 text-sm">{order.deliveryPartner?.name || 'Unassigned'}</td>
                  <td className="p-3 text-sm">{getStatusBadge(order.status)}</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No matching orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    // </div>
  );
};

export default AdminOrdersPage;
