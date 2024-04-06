import React, { useEffect, useState } from "react";
import './ProductDetail.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Details from "./Details";
import Description from "./Description";
import Reviews from "./Reviews";
import ProductImgSlider from "./ProductImgSlider";
import ProductCard from "./../../components/productCard/ProductCard";
import Navbar from './../../components/Navbar/Navbar';
import Footer from "./../../components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { setPageState } from "../../slices/PageSlice";
import axios from 'axios';
import AlertBox from "../../components/AlertBox/AlertBox";
import { addToCart, getCartItems, getCartLength } from "../../cartService";


const ProductDetail = () => {

    //set page state to ProductDetails
    const dispatch = useDispatch();
    dispatch(setPageState('/ProductDetails'));

    const productId = useSelector((state) => state.product.value);
    const [prodData, setProdData] = useState([]);
    const [reviewsData, setReviewsData] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    //get product data 
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/products/${productId}`)
            console.log(response.data)
            setProdData(response.data);
        }
        catch (error) {
            console.log('fail to fetch products', error);
        }
        finally {
            setIsLoading(false);
        }
    }

    //get product reviews
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/reviews/prodReviewsWithCustomer?product=${productId}`);
            setReviewsData(response.data);
        }
        catch (err) {
            console.log('Fail to fetch Review Data', err);
        }
    }

    const fetchRelatedProducts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:4000/api/products/getRelatedProducts/${productId}?category=${prodData.category}&limit=3`
            
            );
            setRelatedProducts(response.data);
            console.log('related products ', response.data);
        }
        catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    //   useEffect
    useEffect(() => {
        fetchProduct();
        fetchReviews();
        fetchRelatedProducts();
    }, [productId])

    // alert
    const [showAlert, setShowAlert] = useState(false)
    const [alertType, setAlertType] = useState()
    const [alertMessage, setAlertMessage] = useState('');

    let [infoDisplay, setInfoDisplay] = useState('Details');    //details tab toggle
    let [quantity, setQuantity] = useState(1);

    const [cartLength, setCartLength] = useState(getCartLength());

    // quatity and total price handler
    const changeQuantity = (button) => {
        if (button == 'decrease') {
            if (quantity > 1) {
                setQuantity(--quantity);
            }
            else {
                setShowAlert(true)
                setAlertMessage('The quantity can not be 0')
                setAlertType('info')
                return
            }

        }
        else {
            if (quantity < prodData.stock)
                setQuantity(++quantity);
            else {
                setShowAlert(true)
                setAlertMessage('Maximum available quantity reached')
                setAlertType('info')
                return
            }
        }
    }

    if (isLoading) {
        return <p>Loading,........</p>
    }

    //add to cart 
    
    const updateCartLength = () => {
        setCartLength(getCartLength());
    };

    const handleAddToCart = () => {
        addToCart({
            _id: prodData._id,
            imgUrl: prodData.images[0],
            name: prodData.name,
            price: prodData.price,
            fabric: prodData.fabric,
            piece: prodData.piece,
            quantity: quantity,
        })
        getCartItems();

        if (updateCartLength) {
            updateCartLength()
        }

    }


    return (
        <>
            {/* alert */}
            {(showAlert) && <AlertBox message={alertMessage} type={alertType} onClose={() => { setShowAlert(false) }} />}
            <div id="product-container">
                <Navbar />

                <div className="pd-main-container" id="product-container" >

                    <div className="prod-detail-container">

                        {/* Product Images */}
                        <div className="pd-left-wrapper">
                            <ProductImgSlider imgSrc={prodData.images} className='pd-img-slider' />
                        </div>

                        {/* Product Description */}
                        <div className="pd-right-wrapper">
                            <div className="pd-prod-title">
                                <h2>{prodData.productName}</h2>
                                <p>SKU: {prodData._id}</p>
                            </div>

                            <div className="pd-prod-price">
                                <h2>$ {prodData.price} </h2>
                                <div className="pd-prod-rating">
                                    {[...Array(5)].map((_, index) => (
                                        <FontAwesomeIcon icon={faStar}
                                            className={
                                                (index < ((reviewsData.length == 0) ? '5' : Math.floor(
                                                    (reviewsData.reduce((sum, review) => sum + review.rating, 0)) / reviewsData.length
                                                ))) ? "pd-rating-pink" : "pd-rating-gray"}
                                            key={index}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Product Information divs */}
                            <div className="pd-info-wrapper">
                                <div className="pd-info-header">
                                    <div className={(infoDisplay == 'Details') ? "pd-info-selected" : ""}
                                        onClick={() => { setInfoDisplay('Details') }}>
                                        Details</div>
                                    <div className={(infoDisplay == 'Description') ? "pd-info-selected" : ""}
                                        onClick={() => { setInfoDisplay('Description') }}>
                                        Description</div>
                                    <div className={(infoDisplay == 'Reviews') ? "pd-info-selected" : ""}
                                        onClick={() => { setInfoDisplay('Reviews') }}>
                                        Reviews</div>
                                </div>

                                <div className="pd-info-content">
                                    {(infoDisplay == 'Details') &&
                                        <Details isStitched={prodData.isStitched} fabric={prodData.fabric} piece={prodData.piece} />}

                                    {(infoDisplay == 'Description') &&
                                        <Description desc={prodData.description} />}

                                    {(infoDisplay == 'Reviews') &&
                                        <Reviews
                                            reviews={reviewsData}
                                        />}


                                </div>
                            </div>

                            {/* quantity and total price */}
                            <div className="pd-quantity-wrapper">
                                <div className="pd-quantity-container">
                                    <div className="pd-tag-heading">
                                        Quantity
                                    </div>
                                    <div className="pd-tag-value">
                                        <div className="pd-quantity-counter">
                                            <button onClick={() => { changeQuantity('decrease') }}>-</button>
                                            <span>{quantity}</span>
                                            <button onClick={() => { changeQuantity('increase') }}>+</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="pd-totalprice-conatiner">
                                    <div className="pd-tag-heading">
                                        Total Price
                                    </div>
                                    <div className="pd-tag-value">
                                        <div>$ {(quantity * prodData.price).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* CART button */}
                            <div className="pd-button-wrapper">
                                <button className="pd-cart-button" onClick={handleAddToCart}>
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="pd-related-products-wrapper">
                        <div className="rel-prod-heading">
                            <h1>Related<span>Products</span></h1>
                        </div>
                        <div className="rel-prod-container">
                            {relatedProducts.map((relProduct, index) => (
                                <div className='rel-prod-card' key={index}>
                                    <ProductCard
                                        _id = {relProduct._id}
                                        name={relProduct.productName}
                                        price={relProduct.price}
                                        imgUrl={`../${relProduct.images[0]}`}
                                        fabric={relProduct.fabric}
                                        piece={relProduct.piece}
                                        
                                        
                                    />

                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <Footer />
            </div>

        </>
    )
}

export default ProductDetail;