// CancelPage.jsx

import React from "react";
import { Link } from "react-router-dom";
import "./CancelPage.css"; // Create a CSS file for styling
import Navbar from "../../components/Navbar/Navbar";
import { NavHashLink } from "react-router-hash-link";

const CancelPage = () => {
  return (
    <>
      <Navbar />
      <div className="cancel-page">
        <div className="cancel-content">
          <h2>Order Cancellation</h2>
          <p>Your order has been canceled. If you have any questions, please contact customer support.</p>
          <NavHashLink smooth to="/Products/all">
            <button className="continue-shopping-btn">Continue Shopping</button>
          </NavHashLink>
        </div>
      </div>
    </>
  );
};

export default CancelPage;
