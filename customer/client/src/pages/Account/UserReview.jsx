import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AlertBox from "../../components/AlertBox/AlertBox";

const UserReview = ({product, onReviewSubmitted}) => {
    let [reviewRating, setReviewRating] = useState(0);  //user reviews rating
    let [reviewText, setReviewText] = useState('');
    const rateDesc = ['Terrible', 'Poor', 'Good', 'Fair', 'Excellent'];

    // alert
    const [showAlert, setShowAlert] = useState(false)
    const [alertType, setAlertType] = useState()
    const [alertMessage, setAlertMessage] = useState('');

    //ADD a review
    const addReview = async () => {
        const reviewData = {
            customer: product.customerId, 
            product: product.productId, 
            rating: reviewRating, 
            reviewMessage: reviewText, 
            orderId: product.orderId
        }
        try{
            const response = await axios.post('http://localhost:4000/api/reviews', reviewData)
            setShowAlert(true)
            setAlertMessage('Thank you for youe valuable feedback')
            setAlertType('success')

            if(onReviewSubmitted){
                onReviewSubmitted();
                setReviewRating(0)
                setReviewText('');
            }
        }
        catch(error){
            console.log('Failed to add review', error)
        }
    }

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if(reviewRating == 0){
            setShowAlert(true)
            setAlertMessage('Please select the arting')
            setAlertType('error')
            return;
        }

        addReview();

    }

    return (
        <>
        {(showAlert) && <AlertBox message={alertMessage} type={alertType} onClose={() => { setShowAlert(false) }} />}
            
            <div className="acc-review-input-rating">
                <div className="acc-stars-wrapper">
                    <div className="acc-stars-heading">Select Product Rating: </div>
                    <div className="acc-prod-rating-container">

                        {[...Array(5)].map((_, index) => (
                            <div className="acc-rating-wrapper" key={index}>
                                <FontAwesomeIcon icon={faStar}
                                    className={(index < reviewRating) ? "acc-rating-star acc-star-pink" : "acc-rating-star"}
                                    onClick={() => { setReviewRating(index + 1) }}
                                />
                                <div className="acc-rating-desc"
                                    style={{ display: (index + 1 == reviewRating) ? '' : 'none' }}>
                                    {rateDesc[index]}
                                </div>
                            </div>

                        ))}

                    </div>
                </div>
                <div className="acc-review-textarea">
                    <form onSubmit={handleReviewSubmit} className="acc-reviewForm">
                        <textarea
                            name='review'
                            value={reviewText}
                            onChange={(e) => { setReviewText(e.target.value) }}
                            placeholder="Write your review..."
                            required
                        />
                        <button type="submit">Submit Review</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UserReview;