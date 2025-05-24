import React from 'react';

const ProductCard = ({ product, onPlaceOrder }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-1 text-sm">{product.description}</p>
        <p className="text-green-600 font-bold mt-2">₹ {product.price}</p>
      </div>
      <button
        onClick={() => onPlaceOrder(product._id)}
        className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Place Order
      </button>
    </div>
  );
};

export default ProductCard;
