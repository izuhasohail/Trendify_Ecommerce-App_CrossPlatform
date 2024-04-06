import React from "react";
import "./Testimonials.css";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import user from "../../../assets/pics/img11.png";
import user2 from '../../../assets/pics/user2.jpg'
import user3 from '../../../assets/pics/user3.jpg'
import user4 from '../../../assets/pics/user4.jpg'
const Testimonials = () => {
  return (
    <div className="rv-review" id="testimonials">
      <h1 className="rv-heading">
        <span>testimonials</span>
      </h1>

      <div className="rv-box-container">
        

        

        <div className="rv-box">
          <div className="rv-stars">
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
          </div>
          <p>
            Trendify is my fashion escape! Wallet-friendly, trendy finds, and a
            shopping experience that's as easy as it is stylish.
          </p>

          <div className="rv-user">
            <img src={user} alt="" />
            <div className="rv-user-info">
              <h3> Sarah K.</h3>
              <span>Happy customer</span>
            </div>
          </div>

          <span className="rv-quote-right">
            <FontAwesomeIcon icon={faQuoteRight} />
          </span>
        </div>

        <div className="rv-box">
          <div className="rv-stars">
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
          </div>
          <p>
            Trendify, Smooth navigation, speedy
            deliveries, & a fashion haven for trendsetters like me.
          </p>

          <div className="rv-user">
            <img src={user2} alt="" />
            <div className="rv-user-info">
              <h3> James M.</h3>
              <span>Happy customer</span>
            </div>
          </div>

          <span className="rv-quote-right">
            <FontAwesomeIcon icon={faQuoteRight} />
          </span>
        </div>
        <div className="rv-box">
          <div className="rv-stars">
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
          </div>
          <p>
            Trendify is where style meets savings! Always in vogue, my ultimate go-to for a chic wardrobe without the hefty price
            tag.
          </p>

          <div className="rv-user">
            <img src={user3} alt="" />
            <div className="rv-user-info">
              <h3>Emma R.</h3>
              <span>Happy customer</span>
            </div>
          </div>

          <span className="rv-quote-right">
            <FontAwesomeIcon icon={faQuoteRight} />
          </span>
        </div>

        <div className="rv-box">
          <div className="rv-stars">
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
            <FontAwesomeIcon icon={faStar} className="rv-star" />
          </div>
          <p>
            Trendify,you'ce got it all, you've won my style heart! Diverse choices. It's
            my fashion destination!.
          </p>

          <div className="rv-user">
            <img src={user4} alt="" />
            <div className="rv-user-info">
              <h3>Louisa C.</h3>
              <span>Happy customer</span>
            </div>
          </div>

          <span className="rv-quote-right">
            <FontAwesomeIcon icon={faQuoteRight} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
