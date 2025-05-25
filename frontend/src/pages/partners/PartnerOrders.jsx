import axios from 'axios';
import React, { useEffect, useState } from 'react';

const PartnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [token, setToken] = useState('');

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get('http://13.235.184.207:5000/api/partner/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOrders(response.data);
    setFilteredOrders(response.data);
  } catch (err) {
    console.error('Error fetching partner orders:', err);
  }
};

  useEffect(() => {
    fetchOrders();
    setToken(localStorage.getItem('token'));
  }, []);

  const handleAccept = async (orderId) => {
  try {
    const token = localStorage.getItem('token');

    await axios.put(
      `http://13.235.184.207:5000/api/partner/orders/${orderId}/accept`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchOrders();
  } catch (err) {
    console.error('Error accepting order:', err);
  }
};

  const handleStatusUpdate = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem('token');

    await axios.put(
      `http://13.235.184.207:5000/api/partner/orders/${orderId}/status`,
      { status: newStatus },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchOrders();
  } catch (err) {
    console.error('Error updating order status:', err);
  }
};

  const filterByStatus = (status) => {
    setStatusFilter(status);
    if (status === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  const statusOptions = ['all', 'pending', 'accepted', 'out for delivery', 'delivered'];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Delivery Partner Orders</h2>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {statusOptions.map(status => (
          <button
            key={status}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
            onClick={() => filterByStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded-xl mb-4 shadow-md bg-white hover:shadow-lg transition"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
              <p><span className="font-semibold">Order ID:</span> {order._id}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                order.status === 'out for delivery' ? 'bg-purple-100 text-purple-800' :
                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-200'
              }`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {order.products.map((p, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-sm px-3 py-1 rounded-lg"
                >
                  {p.name} × {p.quantity}
                </span>
              ))}
            </div>

            {/* Actions */}
            {order.status === 'pending' && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleAccept(order._id)}
              >
                Accept Order
              </button>
            )}

            {order.status === 'accepted' && (
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  onClick={() => handleStatusUpdate(order._id, 'out for delivery')}
                >
                  Out for Delivery
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() => handleStatusUpdate(order._id, 'delivered')}
                >
                  Mark as Delivered
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PartnerOrders;
