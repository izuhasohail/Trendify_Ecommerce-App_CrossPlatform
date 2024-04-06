import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Arrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "none", background: "black", borderRadius: "50%" }}
      onClick={onClick}
    />
  );
}

const ProductImgSlider = ({ imgSrc }) => {
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const slider1 = useRef(null);
    const slider2 = useRef(null);
  
    useEffect(() => {
      setNav1(slider1.current);
      setNav2(slider2.current);
    }, []);

    
  
    return (
      <>
     
        
        {/* main slider */}
        <Slider
          asNavFor={nav2}
          ref={slider1}
          fade={true}
        //   nextArrow = <Arrow/>
        //   prevArrow = <Arrow/>
          className='pd-slider-mainImgWrapper'
        >
          {imgSrc.map((src, index) => (
            <div key={index} className="pd-slider-mainImgContainer">
              <img src={`../${src}`} alt={`Main Image ${index}`} />
            </div>
          ))}
        </Slider>
  
        {/* Thumbnail slider */}
        <Slider
          asNavFor={nav1}
          ref={slider2}
          slidesToShow={imgSrc.length>3 ? 3: imgSrc.length}
          swipeToSlide={true}
          focusOnSelect={true}
        //   nextArrow = <Arrow/>
        //   prevArrow = <Arrow/>
          className='pd-slider-thumbnail'
        >
        
          {imgSrc.map((src, index) => (
            <div key={index} className='pd-slider-thumbImgContainer'>
              <img src={`../${src}`} alt={`Thumbnail ${index}`} />
            </div>
          ))}
        </Slider>
      </>
    );
  };



export default ProductImgSlider;