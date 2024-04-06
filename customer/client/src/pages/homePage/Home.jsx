import React, { useEffect } from "react";

import Slider from "./carousel/Slider";
import Category from "./category/Category";
import Products from "./products/Products";
import AboutUs from "./about/AboutUs";
import Testimonials from "./testimonials/Testimonials";
import Contact from "./contact/Contact";
import Footer from "../../components/Footer/Footer";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import { getCartItems, getCartLength } from "../../cartService";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setPageState } from "../../slices/PageSlice";

const HomePage = () => {
  const [cartLength, setCartLength] = useState(getCartLength());
  const dispatch = useDispatch();
  dispatch(setPageState("/"));
  const updateCartLength = () => {
    setCartLength(getCartLength());
  };

  return (
    <>
      <div className="home_page_div">
        <Navbar />
        <Slider id="home" />
        <Category />
        <AboutUs id="about" />
        <Products id="products" updateCartLength={updateCartLength} />
        <Testimonials id="testimonials" />
        <Contact id="contact" />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
