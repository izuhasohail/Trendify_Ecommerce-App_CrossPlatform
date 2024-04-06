import React, { useState } from 'react';
import { updateQuantity, removeFromCart ,removeEntireItem} from '../../cartService';

const Item = ({ item, onRemoveItem, onUpdateQuantity }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
    if (onUpdateQuantity) {
      onUpdateQuantity(item._id, quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {

    if (quantity > 1) {
      setQuantity(quantity - 1);
      if (onUpdateQuantity) {
        onUpdateQuantity(item._id, quantity - 1);
      }
    }
    else{
      handleRemoveItem()
    }
  };

  const handleRemoveItem = () => {
    removeEntireItem(item._id);
    if (onRemoveItem) {
      onRemoveItem(item._id);
    }
  };

  return (
    <div className="cart-item">
      <img src={item.imgUrl} alt={item.name} className="item-image" />
      <div className="item-details-container">
      <div className="item-info">
        <div className="item-name">{item.name}</div>
      </div>
      
      <div className="item-price">${item.price.toFixed(2)}</div>
      <div className="quantity-container">
        <button className="counterbtn minus-btn" onClick={handleDecreaseQuantity}>
          —
        </button>
        <span className="quantity">{quantity}</span>
        <button className="counterbtn" onClick={handleIncreaseQuantity}>
          +
        </button>
      </div>
      <div className="total-price hide-item-content">${(item.price * quantity).toFixed(2)}</div>
      <button className="remove-button" onClick={handleRemoveItem}>
        &#x2715;
      </button>
      </div>
    </div>
  );
};

export default Item;
