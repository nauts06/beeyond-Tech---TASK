import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const socket = io('http://13.235.184.207:5000'); // adjust if deployed

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [token] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();

    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => socket.disconnect();
  }, []);

 const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get('http://13.235.184.207:5000/api/customer/get/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOrders(response.data.orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Orders</h2>
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
          >
            ← Back to Dashboard
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/track-order/${order._id}`)}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-xl hover:border-blue-500 transition cursor-pointer group"
              >
                <div>
                  <p className="text-gray-800 text-lg font-medium">
                    Order ID: <span className="font-normal">{order._id}</span>
                  </p>
                  <p className="text-blue-600 mt-1 text-sm font-medium">
                    Status: {order.status}
                  </p>
                  <p className="text-gray-600 mt-1 text-sm">
                    Placed: {new Date(order.createdAt).toLocaleString()}
                  </p>

                  <p className="text-gray-700 font-medium mt-2 text-sm">Products:</p>
                  <ul className="list-disc list-inside text-gray-700 ml-2 text-sm">
                    {order.products.map((item) => (
                      <li key={item._id}>{item.name}</li>
                    ))}
                  </ul>
                </div>

                {/* Right Arrow Icon */}
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
