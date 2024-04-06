import React from "react";
import "./AboutUs.css";
import { Link as ScrollLink } from "react-scroll";
import video1 from "../../../assets/videos/video1.mp4";
const AboutUs = () => {
  return (
    <div id="about" className="abt-about">
      <h1 className="abt-heading">
        <span>about</span>us
      </h1>

      <div className="abt-row">
        <div className="abt-video_container">
          <video src={video1} loop autoPlay muted></video>
          <h3>best clothing brand</h3>
        </div>

        <div className="abt-content">
          <h3>why choose us</h3>
          <p>
            At <em style={{
              color:'black',
              fontSize:"xx-large"
            }}>Trendify</em><em style={{
              fontSize:'xxx-large',
              color:'palevioletred'
            }}>.</em>, we redefine online shopping. Our curated
            collection blends the latest trends with timeless classics. With a
            commitment to top-notch quality and seamless service, we offer an
            unparalleled shopping experience. Choose Trendify for exceptional
            style and convenience – where your fashion journey becomes
            extraordinary.
          </p>
          <ScrollLink
            to="contact"
            className="abt-about-btn"
            smooth={true}
            duration={1000}
          >
            contact us
          </ScrollLink>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
