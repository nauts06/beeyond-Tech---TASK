import React from 'react';
import { useNavigate } from 'react-router-dom';

const PartnerDashboard = () => {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate('/partner/orders');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Delivery Partner Dashboard
        </h2>
        <p className="text-gray-600 mb-6">
          Welcome, partner! Here you can view and accept orders and update their delivery status in real-time.
        </p>

        <button
          onClick={handleViewOrders}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition duration-200"
        >
          🚚 View Orders
        </button>
      </div>
    </div>
  );
};

export default PartnerDashboard;
