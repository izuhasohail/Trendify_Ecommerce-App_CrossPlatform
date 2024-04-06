import React from "react";
import { Carousel } from "react-carousel3";
import "./Slider.css";
import img1 from "../../../assets/pics/img1.png";
import img2 from "../../../assets/pics/img2.png";
import img5 from "../../../assets/pics/img5.png";
import img7 from "../../../assets/pics/img7.png";
import img11 from "../../../assets/pics/img11.png";
import { Link as ScrollLink } from "react-scroll";
import { NavHashLink } from "react-router-hash-link";
const Slider = () => {
  return (
    <div className="sd-carousel_container" id="home">
    <h1 className="sd-heading_text">LATEST</h1>
      <div className="sd-buttons_div">
        <NavHashLink smooth to="/Products/all"  className="sd-button1">
          SHOP NOW
        </NavHashLink>
        <ScrollLink to='contact' className="sd-button2" smooth={true} duration={1000}>
          Contact us
        </ScrollLink>
      </div>

      
      <div className="sd-carousel">
      <Carousel
      height={300} width={200} yOrigin={42} yRadius={48} autoPlay={true}
      >
        
          <div key={1} className="sd-pic">
            <img src={img5} alt="" />
          </div>
          <div key={2} className="sd-pic">
            <img src={img7} alt="" />
          </div>
          <div key={3} className="sd-pic">
            <img src={img1} alt="" />
          </div>
          <div key={4} className="sd-pic">
            <img src={img2} alt="" />
          </div>
          <div key={5} className="sd-pic">
            <img src={img11} alt="" />
          </div>
          </Carousel>
      </div>
    </div>
  );
};

export default Slider;
