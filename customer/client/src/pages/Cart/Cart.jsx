import React, { useState, useEffect } from "react";
import "./Cart.css";
import Item from "./Item";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  getCartItems,
  removeFromCart,
  updateQuantity,
  removeEntireItem,
} from "../../cartService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setPageState } from "../../slices/PageSlice";

const Cart = () => {
  const user = useSelector((state) => state.user.value);

  const dispatch = useDispatch();
  dispatch(setPageState("/Cart"));

  const [selectedCity, setSelectedCity] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
    setSubtotal(calculateSubtotal(items));
  }, []);

  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    // Add logic to set shipping cost based on the selected city
    // You can fetch shipping rates or calculate them based on your business logic
  };

  const calculateTotal = () => {
    return subtotal + shippingCost;
  };

  const handleProceedToCheckout = () => {
    // Add logic to navigate to the checkout page

    if (user) {
      navigate("/Checkout");
    } else {
      navigate("/Login");
    }
  };

  const handleContinueShopping = () => {
    // Add logic to navigate to the shopping page
    navigate("/Products/all");
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    const updatedCartItems = getCartItems();
    setCartItems(updatedCartItems);
    setSubtotal(calculateSubtotal(updatedCartItems));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
    const updatedCartItems = getCartItems();
    setCartItems(updatedCartItems);
    setSubtotal(calculateSubtotal(updatedCartItems));
  };

  return (
    <div className="cart_bg">
      <Navbar />
      <h2 className="cart-header">YOUR CART</h2>
      <div className="cart-container">
        <div className="cart-items">
          <div className="item-header hide-item-header">
            <p>PRODUCT</p>
            <p className="hide-item-content">PRICE</p>
            <p>QUANTITY</p>
            <p className="hide-item-content">TOTAL</p>
          </div>
          {cartItems.map((item) => (
            <Item
              key={item._id}
              item={item}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div>
            <div className="subtotal">
              <strong>Total:</strong>
              <p>${calculateTotal().toFixed(2)}</p>
            </div>
          </div>
          <button onClick={handleProceedToCheckout}>Proceed to Checkout</button>
          <button onClick={handleContinueShopping}>Continue Shopping</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
