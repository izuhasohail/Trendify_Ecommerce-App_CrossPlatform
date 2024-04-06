import React from 'react'
import './Contact.css'
import gif1 from '../../../assets/gifs/gif1.gif'
import { useState } from 'react'
import axios from 'axios'
const Contact = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setNumber('');
    setMessage('');
  };

  const sendDataToAPI = async (formData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/admin/contactus', formData);
      console.log('Response from API:', response.data);

      // Check if the message was sent successfully
      if (response.data) {
        // Show success alert message
        alert('Message sent successfully!');
        // Reset form after successful submission
        resetForm();
      } else {
        // Show error alert message
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending data to API:', error);
      // Show error alert message
      alert('Failed to send message. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = {
      name,
      email,
      number,
      message,
    };

    // Call function to send data to API
    sendDataToAPI(formData);
  };




  return (
    <div className='c-contact' id='contact'>
      <h1 className="c-heading"><span>contact</span>us</h1>

      <div className="c-row">

      <div className="c-image">
        <img src={gif1} alt="" />
        </div>


        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='name' className='c-box'
            value={name}
            onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder='email' className='c-box'
             value={email}
            onChange={(e) => setEmail(e.target.value)} />
            {/* <input type="number" placeholder='number' className='c-box' /> */}
            <input type="tel" placeholder='number' className='c-box' 
              value={number}
            onChange={(e) => setNumber(e.target.value)}
            />
            <textarea name="" id="" cols="30" rows="10" placeholder='message' className='c-box'
             value={message}
            onChange={(e) => setMessage(e.target.value)}></textarea>
            <input type="submit" value="send message" className='c-send-btn' />
        </form>

        
      </div>


    </div>
  )
}

export default Contact
