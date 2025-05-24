import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000'); // Update if deployed

const TrackOrder = () => {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    socket.emit('joinOrderRoom', orderId);

    const fetchOrder = async () => {
      const res = await fetch(`http://localhost:5000/api/customer/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
    };

    fetchOrder();

    socket.on('orderStatusUpdated', (updatedOrder) => {
      if (updatedOrder._id === orderId) {
        setOrder(updatedOrder);
      }
    });

    return () => {
      socket.off('orderStatusUpdated');
    };
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Track Your Order</h2>

        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Order ID:</span> {order._id}</p>
          <p className="text-blue-600">
            <span className="font-semibold">Status:</span> {order.status}
          </p>
          <p>
            <span className="font-semibold">Last Updated:</span>{' '}
            {new Date(order.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-lg font-semibold mb-1">Products:</p>
          <ul className="list-disc list-inside text-gray-600">
            {order.products.map((p) => (
              <li key={p._id}>{p.name}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => navigate('/customer/orders')}
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          ← Back to Orders
        </button>
      </div>
    </div>
  );
};

export default TrackOrder;
