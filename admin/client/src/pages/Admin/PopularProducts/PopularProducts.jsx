import React, { useEffect } from "react";
import "./PopularProducts.css";

const PopularProducts = ({ popularProducts }) => {

  return (
    <div className="product-table item10 subcontainer">
      {popularProducts.map((product) => (
        <div key={product.id} className="product-item">
          <img
            src={`../${product.images[0]}`}
            // src={`../card1.png`}
            alt={product.name}
            className="product-image trending-product-image"
          />
          <p className="product-info ds">
            <span className="product-name ds">{`${product.name}`}</span>
          </p>
          <p className="product-price">${product.price}</p>
          <p className="product-stock">{product.stock} in stock</p>
        </div>
      ))}
    </div>
  );
};

export default PopularProducts;
