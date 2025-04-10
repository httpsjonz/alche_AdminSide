import React, { useState, useEffect } from "react";
import "../style/AdminDashboard.css";

const EditProduct = ({ editProduct, setEditProduct, handleUpdate }) => { // Accept handleUpdate
  const [updatedProduct, setUpdatedProduct] = useState(editProduct);
  const [showPopup, setShowPopup] = useState(false);

  // Close form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".edit-product-form")) {
        setEditProduct(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setEditProduct]);

  // Image Upload Function
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedProduct({ ...updatedProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="edit-product-form">
      <h2>Edit Product</h2>

      <label>Pastry Name</label>
      <input 
        type="text" 
        value={updatedProduct.name} 
        onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })} 
      />

      <div className="form-group price-input-group">
        <label>Pastry Price</label>
        <div className="price-wrapper">
          <span className="peso-symbol">₱</span>
          <input
            type="text"
            value={updatedProduct.price}
            placeholder="0.00"
            onChange={(e) => {
              // Remove all non-numeric characters except decimal point
              let value = e.target.value.replace(/[^0-9.]/g, "");
              
              // Prevent multiple decimal points
              if ((value.match(/\./g) || []).length > 1) {
                return;
              }

              // Format the value
              if (value) {
                // Remove leading zeros
                value = value.replace(/^0+/, '');
                // Ensure proper decimal formatting
                const parts = value.split('.');
                if (parts.length > 1) {
                  value = parts[0] + '.' + parts[1].slice(0, 2);
                }
              }

              setUpdatedProduct({ ...updatedProduct, price: value });
            }}
            onBlur={(e) => {
              // Format to 2 decimal places when leaving the field
              if (e.target.value && !isNaN(e.target.value)) {
                const formattedValue = parseFloat(e.target.value).toFixed(2);
                setUpdatedProduct({ ...updatedProduct, price: formattedValue });
              }
            }}
          />
        </div>
      </div>

      <label>Pastry Description</label>
      <textarea 
        value={updatedProduct.description} 
        onChange={(e) => setUpdatedProduct({ ...updatedProduct, description: e.target.value })}>
      </textarea>

      <label>Pastry Category</label>
      <select 
        value={updatedProduct.category} 
        onChange={(e) => setUpdatedProduct({ ...updatedProduct, category: e.target.value })}>
        <option>Cake</option>
        <option>Cookie</option>
      </select>

      {/* Image Upload Section */}
      <label>Image</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Image Preview */}
      {updatedProduct.image && (
        <img src={updatedProduct.image} alt="Preview" className="image-preview" />
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setEditProduct(null)}>Back</button>
        <button onClick={() => setShowPopup(true)}>Update</button>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popup">
          <p>Update Pastry?</p>
          <button onClick={() => setShowPopup(false)}>Cancel</button>
          <button onClick={() => {
            // Format price to 2 decimal places before submitting
            const formattedProduct = {
              ...updatedProduct,
              price: parseFloat(updatedProduct.price || 0).toFixed(2)
            };
            handleUpdate(formattedProduct);
            setEditProduct(null);
          }}>Update</button>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
