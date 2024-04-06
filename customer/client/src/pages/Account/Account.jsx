import React, { useState, useEffect } from "react";
import './Account.css';
import Profile from '../../assets/pics/Profile.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPhone, faLocationDot, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import UserReview from "./UserReview";
import EditUserInfoForm from "./EditUserInfo";
import Navbar from './../../components/Navbar/Navbar';
import Footer from "./../../components/Footer/Footer";
import axios from 'axios';
import { useSelector } from "react-redux";

const Account = () => {

    const customerId = useSelector((state)=>state.user.value);

    const [customerData, setCustomerData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [toReviewProd, setToReviewProd] = useState([])
    const [historyReview, setHistoryReview] = useState([]);


    const [isLoading, setIsLoading] = useState(true);

    //get customer data 
    const fetchCustomer = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/customers/${customerId}`)
            setCustomerData(response.data)
        }
        catch (error) {
            console.log('fail to fetch products', error);
        }
        finally {
            setIsLoading(false);
        }
    }

    //customer orders data
    const fetchCustomerOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/orders/customer/${customerId}`)
            setOrderData(response.data);
        }
        catch (error) {
            console.log('Fail to fetch customer orders', error);
        }
    }

    //products that customer has not yet revieweed
    const fetchProductsWithoutReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/orders/productsWithoutReviews/${customerId}`)
            setToReviewProd(response.data);
        }
        catch (error) {
            console.log('Fail to fetch products without reviews ', error)
        }
    }

    //Reviews of teh customer
    const fetchCustomerReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/reviews/custReviews?customer=${customerId}`)
            setHistoryReview(response.data)
        }
        catch (error) {
            console.log('Fail to fetch products without reviews ', error)
        }
    }

    useEffect(() => {
        fetchCustomer();
        fetchCustomerOrders();
        fetchProductsWithoutReviews();
        fetchCustomerReviews();
    }, [])



    let [reviewDisplay, setReviewDisplay] = useState('ToReview'); //for review divs toggle

    //info edit form
    const handleEditInfoFormOpen = () => {
        document.getElementById('edit-profile').style.visibility = 'visible';
        document.getElementById('user-account').classList.add('editinfo-overflow-hidden');
    }

    // format date
    const formatDate = (date) => {
        const trimmedDate = new Date(date).toISOString().split('T')[0];
        const options = {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };
        const formattedDate = new Date(trimmedDate).toLocaleDateString('en-US', options)
        return formattedDate;
    }

    const handleReviewSubmitted = () => {
        fetchProductsWithoutReviews();
        fetchCustomerReviews();
    }

    const handleEditInfoUpdate = () => {
        fetchCustomer();
    }

    if (isLoading) {
        return <p>Loading,........</p>
    }



    return (
        <>
           
            <div id="user-account">
                <Navbar />

                <div className="acc-main-wrapper">
                    <div className="account-container">
                        {/*---------- User profile ----------*/}
                        <div className="acc-profile-container">
                            <div className="acc-profile-img-wrapper">
                                <img src={Profile} alt="user" />
                            </div>
                            <div className="acc-profile-desc">
                                <div className="acc-profile-info">
                                    <div className="acc-user-name">{customerData.name}</div>
                                    <div className="acc-user-info">
                                        <p>
                                            <FontAwesomeIcon icon={faEnvelope} />
                                            {customerData.email}
                                        </p>
                                        <p>
                                            <FontAwesomeIcon icon={faPhone} />
                                            {customerData.phone}</p>
                                        <p>
                                            <FontAwesomeIcon icon={faLocationDot} />
                                            {customerData.deliveryAddress.split(';').map((address, index) => (
                                                <span key={index}>{address} </span>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                                <button className="acc-prof-edit-btn" onClick={handleEditInfoFormOpen}>
                                    Edit Info
                                </button>
                            </div>
                        </div>


                        {/*---------- User Orders -------------*/}
                        <div className="acc-orders-wrapper">
                            <h2 className="acc-order-heading">
                                Orders<span>History</span>
                            </h2>

                            <div className="acc-order-scroll-div-wrapper">
                                <div className="acc-order-scroll">
                                    {(orderData.length > 0) ? (
                                        <>
                                            {orderData.map((order, index) => (

                                                <div className="acc-order-container" key={index}>
                                                    {/* Order title */}
                                                    <div className="acc-order-title-wrapper">
                                                        <div className="acc-order-title-left">
                                                            <div className="acc-order-id">Order ID: {order._id}</div>
                                                            <div className="acc-order-date">Date: {formatDate(order.orderDate)}</div>
                                                        </div>
                                                        <div className="acc-order-status">
                                                            {order.status}
                                                        </div>
                                                    </div>

                                                    {/* Order Information */}
                                                    <div className="acc-order-info-wrapper">
                                                        <div className="acc-order-info acc-order-border-right">
                                                            <div>Contact</div>
                                                            <p>{customerData.name}</p>
                                                            <p><FontAwesomeIcon icon={faPhone} /> {customerData.phone}</p>
                                                            <p><FontAwesomeIcon icon={faEnvelope} /> {customerData.email}</p>
                                                        </div>
                                                        <div className="acc-order-info">
                                                            <div>Shipping Address</div>
                                                            <p>{order.deliveryAddress}</p>
                                                        </div>
                                                        <div className="acc-order-info acc-order-border-left">
                                                            <div>Payment</div>
                                                            <p>Method: {order.paymentMethod}</p>
                                                            <p>Total paid: $ {(order.total).toFixed(2)}</p>
                                                        </div>
                                                    </div>

                                                    {/* Order product information */}
                                                    <div className="acc-order-details-wrapper">
                                                        {order.products.map((prod, index) => (
                                                            <div className="acc-order-product" key={index}>
                                                                <div className="acc-order-prod-img">
                                                                    <img src={`../${prod.product.images[0]}`} />
                                                                </div>
                                                                <div className="acc-order-prod-info">
                                                                    <div className="acc-prod-title">
                                                                        {prod.product.productName}
                                                                    </div>
                                                                    <p>Quantity: {prod.quantity}</p>
                                                                    <p>Total Price: $ {(prod.quantity * prod.product.price).toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                            ))}
                                        </>
                                    ) : (
                                        <div className="acc-empty-container">
                                            <p>You have not placed any orders yet.</p>
                                            <p> Start exploring our products and find something you love!</p>
                                        </div>
                                    )}
                                </div>
                            </div>




                        </div>

                        {/*---------- Reviews*-------------*/}
                        <div className="acc-reviews-wrapper">
                            <h2 className="acc-order-heading">Reviews</h2>
                            <div className="acc-review-header">
                                <div className={(reviewDisplay == 'ToReview') ? "acc-review-opened" : ""}
                                    onClick={() => { setReviewDisplay('ToReview') }}>
                                    To Review
                                </div>
                                <div className={(reviewDisplay == 'History') ? "acc-review-opened" : ""}
                                    onClick={() => { setReviewDisplay('History') }}>
                                    History
                                </div>
                            </div>

                            {/* To Reviews */}
                            <div className="acc-order-scroll-div-wrapper review-scroll">
                                <div className="acc-order-scroll">
                                    {(reviewDisplay == 'ToReview') && (

                                        (toReviewProd.length > 0) ?

                                            <div className="acc-main-reviews-content">
                                                {toReviewProd.map((product, index) => (
                                                    <div className="acc-review-container" key={index}>
                                                        <div className="acc-review-product">
                                                            <div className="acc-review-img-wrapper">
                                                                <img src={`../${product.productImages[0]}`} alt={product.productName} />
                                                            </div>
                                                            <div className="acc-review-prod-info">
                                                                <div className="acc-review-prod-title">{product.productName}</div>
                                                                <div>Date Purchased: {formatDate(product.orderDate)}</div>
                                                            </div>
                                                        </div>
                                                        {/* review form */}
                                                        <UserReview product={product} onReviewSubmitted={handleReviewSubmitted} />
                                                    </div>
                                                ))}
                                            </div>
                                            :
                                            <div className="acc-empty-container">
                                                <p>There is no product for you to review</p>
                                                <p>Browse our collection and find the perfect product to buy and share your thoughts</p>
                                            </div>
                                    )}
                                </div>
                            </div>


                            {/* Reviews History */}
                            <div className="acc-order-scroll-div-wrapper toreview-scroll review-scroll">
                                <div className="acc-order-scroll">
                                    {(reviewDisplay == 'History') && (

                                        (historyReview.length > 0) ?
                                            <div className="acc-main-reviews-content">

                                                {historyReview.map((review, index) => (
                                                    <div className="acc-review-container" key={index}>
                                                        <div className="acc-review-product">
                                                            <div className="acc-review-img-wrapper">
                                                                <img src={`../${review.productImages[0]}`} alt={review.productName} />
                                                            </div>
                                                            <div className="acc-review-prod-info">
                                                                <div className="acc-review-prod-title">{review.productName}</div>
                                                                <div>Date Purchased: {formatDate(review.orderDate)}</div>
                                                            </div>
                                                        </div>

                                                        <div className="acc-history-review-container">
                                                            <div className="acc-history-review">
                                                                {review.reviewMessage}
                                                            </div>
                                                            <div className="acc-history-rating-wraapper">
                                                                {[...Array(5)].map((_, index) => (
                                                                    <FontAwesomeIcon icon={faStar}
                                                                        className={(index < review.rating) ? "acc-review-rating-star acc-star-pink" : "acc-review-rating-star"}
                                                                        key={index}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>


                                                    </div>
                                                ))}
                                            </div>
                                            :
                                            <div className="acc-empty-container">
                                                <p>You haven't submitted any reviews yet. </p>
                                                <p>Your feedback is valuable to us! </p>
                                                <p>Start sharing your thoughts on the products you've purchased.</p>
                                            </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <EditUserInfoForm userData={customerData} onUpdate={handleEditInfoUpdate}/>

                <Footer />
            </div>
        </>
    )
}

export default Account;