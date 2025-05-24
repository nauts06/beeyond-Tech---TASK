import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/products');
    if (response.data.success) {
      setProducts(response.data.products);
    }
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
};

  const placeOrder = async (productId) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(
      'http://localhost:5000/api/customer/orders',
      { productId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;
    if (data.success) {
      alert('Order placed successfully!');
    } else {
      alert(data.message || 'Failed to place order');
    }
  } catch (err) {
    console.error('Error placing order:', err);
    alert('Something went wrong while placing the order.');
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleViewOrders = () => {
    navigate('/customer/orders');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Product Catalog</h2>
          <button
            onClick={handleViewOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View My Orders
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onPlaceOrder={placeOrder} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
