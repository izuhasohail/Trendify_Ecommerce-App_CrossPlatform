import React, { useEffect } from "react";
import "./Navbar.css";
import {
  faHeart,
  faShoppingCart,
  faUser,
  faSignOut,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { NavHashLink } from "react-router-hash-link";
import { useDispatch, useSelector } from "react-redux";
import { getCartItems } from "../../cartService";
import AlertBox from "../alert/AlertBox";
import { deleteUserState } from "../../slices/UserSlice";
import { clearCart } from "../../cartService";
import { useNavigate } from "react-router-dom";
import { getCartLength } from "../../cartService";
const Navbar = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertMessage, setAlertMessage] = useState("");

  const cartItems = getCartItems();
  const cartLength = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  console.log("cart items in cart", cartItems);
  console.log("cart length in cart", cartLength);

  const onClickCart = (e) => {
    e.preventDefault();

    console.log("onClickCart called");
    if (getCartLength() > 0) {
      console.log("length of cart ", getCartLength());
      navigate("/Cart");
    } else {
      setShowAlert(true); // Show alert only if there are errors

      // If there are errors, set the alert information
      setAlertType("error"); // You can customize the type based on your styling
      setAlertMessage("Cart is Empty");
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const navRef = useRef();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const showNavBar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  const closeNavBar = () => {
    setIsNavOpen(false);
  };

  const handleNavLinkClick = () => {
    closeNavBar();
  };

  const handleLogout = (e) => {
    e.preventDefault();

    dispatch(deleteUserState());
    navigate("/");

    // setUserId(null);

    setShowAlert(true); // Show alert only if there are errors

    // If there are errors, set the alert information
    setAlertType("success"); // You can customize the type based on your styling
    setAlertMessage("Logged out successfuly");
    clearCart();
    console.log(
      "state of user ",
      useSelector((state) => state.user.value)
    );

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate("/Account");
    } else {
      navigate("/Login");
    }
  };

  return (
    <header className="_header">
      {showAlert && (
        <AlertBox
          type={alertType}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}

      <input type="checkbox" name="" id="toggler" />
      <p htmlFor="toggler" className="bars">
        <FontAwesomeIcon icon={faBars} onClick={showNavBar} />
      </p>

      <NavHashLink to="/" className="logo">
        Trendify<span>.</span>
      </NavHashLink>

      <nav className="navbar" ref={navRef}>
        <NavHashLink smooth to="/#home" onClick={showNavBar}>
          home
        </NavHashLink>
        <NavHashLink smooth to="/#about" onClick={showNavBar}>
          about
        </NavHashLink>
        <NavHashLink smooth to="/Products/all" onClick={showNavBar}>
          products
        </NavHashLink>
        <NavHashLink smooth to="/#testimonials" onClick={showNavBar}>
          testimonials
        </NavHashLink>
        <NavHashLink smooth to="/#contact" onClick={showNavBar}>
          contact
        </NavHashLink>
        <FontAwesomeIcon
          className="nav-btn nav-close-btn"
          icon={faTimes}
          onClick={showNavBar}
        />
      </nav>
      <div className="icons">
        {user && (
          <NavHashLink onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOut} />
          </NavHashLink>
        )}

        <NavHashLink onClick={onClickCart} className="cart">
          <span className="count">{cartLength}</span>
          <FontAwesomeIcon icon={faShoppingCart} className="icon-cart" />
        </NavHashLink>

        <NavHashLink onClick={handleLoginClick}>
          <FontAwesomeIcon icon={faUser} />
        </NavHashLink>
      </div>
    </header>
  );
};

export default Navbar;
