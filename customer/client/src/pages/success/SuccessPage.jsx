import React from "react";
import { Link } from "react-router-dom";
import "./SuccessPage.css"; // Create a CSS file for styling
import Navbar from "../../components/Navbar/Navbar";
import { NavHashLink } from "react-router-hash-link";
const SuccessPage = () => {
    // const category='Men';
  return (
    <>
    <Navbar/>
      <div className="success-page">
        <div className="success-content">
          <h2>Payment Successful!</h2>
          <p>Your order has been confirmed. Thank you for shopping with us!</p>
          <NavHashLink smooth to ='/Products/all'>
            <button className="continue-shopping-btn">Continue Shopping</button>
          </NavHashLink>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
