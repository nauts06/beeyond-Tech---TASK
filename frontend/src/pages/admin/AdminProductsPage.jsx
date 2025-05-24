import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [products, setProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

 const fetchProducts = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/products");
    setProducts(response.data?.products || []);
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/admin/add/products",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setFormData({ name: "", description: "", price: "" });
    setIsDialogOpen(false); 
    fetchProducts(); 
  } catch (err) {
    console.error("Error adding product:", err);
  }
};

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium rounded-md"
        >
          ← Back
        </button>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium rounded-md"
        >
          ➕ Add Product
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📦 Product List
        </h2>
        {products.length === 0 ? (
          <p className="text-gray-500 text-sm">No products available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-2 px-4 border">#</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Price (₹)</th>
                  <th className="py-2 px-4 border">Description</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={product._id} className="border-t">
                    <td className="py-2 px-4 border">{idx + 1}</td>
                    <td className="py-2 px-4 border">{product.name}</td>
                    <td className="py-2 px-4 border">{product.price}</td>
                    <td className="py-2 px-4 border">{product.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              ➕ Add New Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="E.g., iPhone 15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="E.g., 79999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Brief description"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-medium rounded-md"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductForm;
