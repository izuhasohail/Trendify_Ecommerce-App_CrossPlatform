import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faRulerHorizontal, faXmark } from "@fortawesome/free-solid-svg-icons";
import Profile from './../../assets/pics/Profile.png';

const Reviews = ({ reviews }) => {
    return (
        <>
            <div className="pd-info-reviews">

                {(reviews.length > 0) ? (
                    reviews.map((review, index) => (
                    <div className="pd-review-container" key={index}>
                        <div className="pd-review-header">
                            <div className="pd-user-profile-conatiner">
                                <img src={Profile} alt="user" />
                            </div>
                            <div className="pd-review-header-right">
                                <h4>{review.customerName}</h4>
                                <div>
                                    {[...Array(5)].map((_, index) => (
                                        <FontAwesomeIcon icon={faStar}
                                            className={(index < review.rating) ? "pd-rating-pink" : "pd-rating-gray"}
                                            key={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="pd-review-content">{review.message}</p>
                    </div>
                ))
                )
                : 
                <div>There are no reviews of this product yet</div>} 
                



            </div>
        </>
    )
}

export default Reviews;