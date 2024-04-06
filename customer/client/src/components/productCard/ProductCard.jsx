import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { addToCart, getCartItems } from "../../cartService";
import { setProductState } from "../../slices/ProductSlice";
import { useDispatch } from "react-redux";
const ProductCard = ({
  _id,
  imgUrl,
  name,
  price,
  fabric,
  piece,
  updateCartLength,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    addToCart({
      _id,
      imgUrl,
      name,
      price,
      fabric,
      piece,
    });
    getCartItems();

    if (updateCartLength) {
      updateCartLength();
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    dispatch(setProductState(_id));
    navigate("/ProductDetails");
  };

  return (
    <div className="pc-box">
      <span className="pc-discount">{fabric} </span>
      <div className="pc-image">
        <img src={imgUrl} alt="pic" />
        <div className="pc-icons">
          <Link onClick={handleQuickView}>quick view</Link>
          <Link className="pc-cart-btn" onClick={handleAddToCart}>
            add to cart
          </Link>
        </div>
      </div>

      <div className="pc-content">
        <h3>
          {name} ({piece} piece)
        </h3>
        {/* <div className="pc-price">$15.99 <span>$15.99</span></div> */}
        <div className="pc-price">${price}</div>
      </div>
    </div>
  );
};

export default ProductCard;
