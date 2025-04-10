import React, { useState, useEffect } from "react";
import "../style/AdminDashboard.css";

const AddProduct = ({ setShowAddForm, handleAdd }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "Cake",
    image: null,
  });
  const [showPopup, setShowPopup] = useState(false);

  // Close form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".add-product-form")) {
        setShowAddForm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowAddForm]);

  // Image Upload Function
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="add-product-form" onClick={(e) => e.stopPropagation()}>
      <h2>Add Product</h2>
  
      {/* Image Upload */}
      <div className="form-group">
        <label>Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {newProduct.image && (
          <img src={newProduct.image} alt="Preview" className="image-preview" />
        )}
      </div>
  
      {/* Pastry Name & Category (Same Row) */}
      <div className="form-group">
        <label>Pastry Name</label>
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
      </div>
  
      <div className="form-group">
        <label>Pastry Category</label>
        <select
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        >
          <option>Cake</option>
          <option>Cookie</option>
        </select>
      </div>
  
      {/* Pastry Description & Price (Same Row) */}
      <div className="form-group">
        <label>Pastry Description</label>
        <textarea
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
      </div>
  <div className="form-group price-input-group">
    <label>Pastry Price</label>
    <div className="price-wrapper">
      <span className="peso-symbol">₱</span>
      <input
        type="text"
        value={newProduct.price}
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

          setNewProduct({ ...newProduct, price: value });
        }}
        onBlur={(e) => {
          // Format to 2 decimal places when leaving the field
          if (e.target.value && !isNaN(e.target.value)) {
            const formattedValue = parseFloat(e.target.value).toFixed(2);
            setNewProduct({ ...newProduct, price: formattedValue });
          }
        }}
      />
    </div>
  </div>



      {/* Buttons (Aligned to the Right) */}
      <div className="add-button-group">
        <button className="back-button" onClick={() => setShowAddForm(false)}>Back</button>
        <button className="add-button" onClick={() => setShowPopup(true)}>Add</button>
      </div>

      {/* Popup Confirmation (INSIDE the return statement) */}
      {showPopup && (
        <div className="popup">
          <p>Add this pastry?</p>
          <button onClick={() => setShowPopup(false)}>Cancel</button>
          <button onClick={() => {
            // Format price to number (without ₱ symbol) before submitting
            const priceValue = newProduct.price.replace(/[^0-9.]/g, '');
            const formattedProduct = {
              ...newProduct,
              price: priceValue
            };
            handleAdd(formattedProduct);
          }}>Confirm</button>
        </div>
      )}
    </div> 
  );
};

export default AddProduct;
