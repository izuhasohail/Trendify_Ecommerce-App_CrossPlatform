import React from 'react'
import './CategoryCard.css'
import { Link } from 'react-router-dom'
const Card = ({imgUrl,name}) => {
  return (
    <div className="cc-cards">
            <div className="cc-card_img">
                <img src={imgUrl} alt="pic" />
            </div>
            <div className="cc-text">
                <Link to={`/Products/${name}`}>{name}</Link>
            </div>
    </div>
  )
}

export default Card
