import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'
import payment from '../../assets/pics/payment2.png'
import { Link as ScrollLink } from 'react-scroll'
import { Link as _Link } from 'react-router-dom'
import { NavHashLink } from 'react-router-hash-link'
const Footer = () => {
  return (
    <div className='ft-footer'>
      <div className="ft-box-container">
        <div className="ft-box">
            <h3>quick links</h3>
             <NavHashLink smooth to='/#home' >home</NavHashLink>
             <NavHashLink  smooth to='/#about' >about</NavHashLink>
             <NavHashLink smooth to='#products' >products</NavHashLink>
             <NavHashLink smooth to='#testimonials' >testimonials</NavHashLink>
             <NavHashLink smooth to='#contact' >contact</NavHashLink>
        </div>

        <div className="ft-box">
            <h3>extra links</h3>
             <NavHashLink to={'/'}>my account</NavHashLink>
             <NavHashLink to={'/'}>my favorite</NavHashLink>
             <NavHashLink to={'/'}>my order</NavHashLink>
        </div>

        <div className="ft-box">
            <h3>locations</h3>
             <NavHashLink to={'/'}>Pakistan</NavHashLink>
             <NavHashLink to={'/'}>United Kingdom</NavHashLink>
             <NavHashLink to={'/'}>United States</NavHashLink>
             <NavHashLink to={'/'}>UAE</NavHashLink>

        </div>

        <div className="ft-box">
            <h3>contact info</h3>
             <NavHashLink to={'/'}>(051) 111 116 878 </NavHashLink>
             <NavHashLink to={'/'} className='ft-email-footer'>trendify@gmail.com</NavHashLink>
             <NavHashLink to={'/'}>Rawalpindi, Pakistan</NavHashLink>
             <img src={payment} alt="" />

        </div>
      </div>

      <div className="ft-credit">
        created by <span>the softies27</span> | all rights reserved
      </div>


    </div>
  )
}

export default Footer
