import React, { useState } from 'react';
import axios from 'axios';
const AdminProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

 

const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');

  try {
    const res = await axios.post(
      'http://13.235.184.207:5000/api/admin/products',
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("token", res);

    if (res.data.success) {
      onProductAdded();
      setFormData({ name: '', description: '', price: '' });
    } else {
      alert('Failed to add product');
    }
  } catch (error) {
    console.error('Error adding product:', error);
    alert('Failed to add product');
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required />
      <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
      <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" required />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AdminProductForm;
