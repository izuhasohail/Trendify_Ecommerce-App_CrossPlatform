import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AlertBox from '../../components/AlertBox/AlertBox'



const EditFormField = ({label, type, name, pattern, value, onChange, required}) => {
    const [isInputFocus, setIsInputFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    return(
        <>
            <div className='edit-form-field-wrapper'>
                <label>{label}
                {(type == 'tel') && <span className='ef-mobileno'>03xx-xxxxxxx</span>}</label>
                <div 
                className= {isInputFocus ? 'ef-input-container ef-input-container-focus' : 'ef-input-container'}
                onFocus={() => setIsInputFocus(true)}
                onBlur={() => setIsInputFocus(false)}>

                    <input
                        type={(type == 'password') ? (showPassword) ? 'text' : 'password' : {type}}
                        id={name}
                        name={name}
                        pattern={pattern}
                        value={value}
                        onChange={onChange}
                        {...(required && { required: true })}   
                    />
                    {(type == 'password') &&
                    ((showPassword) ?
                     <FontAwesomeIcon icon={faEyeSlash} className="signiu-input-icon" onClick={()=>setShowPassword(false)}/>
                     : <FontAwesomeIcon icon={faEye} className="signiu-input-icon" onClick={()=>setShowPassword(true)}/>)
                    }
                    
                </div>
            </div>
        </>
    )
}




const EditUserInfoForm = ({ userData, onUpdate }) => {

    // alert
    const [showAlert, setShowAlert] = useState(false)
    const [alertType, setAlertType] = useState()
    const [alertMessage, setAlertMessage] = useState('');

    const address = userData.deliveryAddress.split(';');//split address

    const [editFormData, setEditFormData] = useState({
        mobile: userData.phone,
        address: address[0],
        city: address[1],
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const isPasswordValid = (password) => {
        // Minimum 8 characters, maximum 16 characters
        const lengthRegex = /^[A-Za-z\d@$!%*#?&]{8,16}$/;

        // At least one capital letter, one special character, and one digit
        const characterRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])/;

        return (
            lengthRegex.test(password) && characterRegex.test(password)

        );
    };

    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    //update user data
    const updateUser = async (updatedData) => {
        try {
            const response = await axios.patch(`http://localhost:4000/api/customers/`, updatedData);

            console.log(response)
            if (response.status === 200) {
                if (onUpdate)
                    onUpdate();
                    setShowAlert(true)
                    setAlertMessage('User data updated successfully')
                    setAlertType('success')
                    handleEditInfoFormClose();

            }
        
            else {
                console.error('Error updating customer:', response.data.error);
            }
        } catch (error) {
            console.error('Error:', error.message);
            console.log(error)
            if(error.response.status === 401){
                setShowAlert(true)
                setAlertMessage('Incorrect current Password')
                setAlertType('error');
            }
        }
    }

    //form submit handler
    const handleEditFormSubmit = async (e) => {
        e.preventDefault();

        let userNewPassword = '';
        // if user enter new password
        if (editFormData.newPassword != '') {
            //check if user enter correct current password
            if (editFormData.currentPassword == '') {
                setShowAlert(true)
                setAlertMessage('Please enter current passowrd')
                setAlertType('error')
                return;
            }
            if (!isPasswordValid(editFormData.newPassword)) {
                setShowAlert(true)
                setAlertMessage('Invalid password. Password must be 8-16 characters, with at least one capital letter, one special character, and one digit.')
                setAlertType('error')
                return;
            }
            if (editFormData.confirmNewPassword == '') {
                setShowAlert(true)
                setAlertMessage('Please confirm your new password')
                setAlertType('error')
                return;
            }
            if (editFormData.newPassword != editFormData.confirmNewPassword) {
                setShowAlert(true)
                setAlertMessage('Passwords do not match. Please make sure both passwords are identical.')
                setAlertType('error')
                return;
            }

            userNewPassword = editFormData.newPassword;

        }
        let updatedData = {}
        if (userNewPassword == '') {
            updatedData = {
                id: userData._id,
                phone: editFormData.mobile,
                deliveryAddress: editFormData.address + '; ' + editFormData.city + '; Pakistan',
            }
        }
        else {
            updatedData = {
                id: userData._id,
                phone: editFormData.mobile,
                deliveryAddress: editFormData.address + '; ' + editFormData.city + '; Pakistan',
                currentPassword: editFormData.currentPassword,
                password: userNewPassword
            }
        }
        updateUser(updatedData);
        
        
    };

    const handleEditInfoFormClose = () => {
        setEditFormData(() => ({
            mobile: userData.phone,
            address: address[0],
            city: address[1],
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        }));

        document.getElementById('edit-profile').style.visibility = 'hidden';
        document.getElementById('user-account').classList.remove('editinfo-overflow-hidden');
    }

    return (
        <>
            {(showAlert) && <AlertBox message={alertMessage} type={alertType} onClose={() => { setShowAlert(false) }} />}
            <div id='edit-profile'>
                <div className='edit-user-popup-bg'></div>
                <div className="edit-user-info-form">
                    <div className="edit-user-info-header">
                        <span>Edit Your Information</span>
                        <button onClick={handleEditInfoFormClose}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <form onSubmit={handleEditFormSubmit} className='update-user-form'>

                        <EditFormField
                            label = 'Mobile Number: ' 
                            type = 'tel'
                            name = 'mobile' 
                            pattern = "[0-9]{4}-[0-9]{7}"
                            value = {editFormData.mobile} 
                            onChange = {handleInputChange} 
                            required = {true}
                        />

                        <EditFormField
                            label = 'Address: ' 
                            type = 'text'
                            name = 'address' 
                            value = {editFormData.address} 
                            onChange = {handleInputChange} 
                            required = {false}
                        />

                        <EditFormField
                            label = 'City: ' 
                            type = 'text'
                            name = 'city' 
                            value = {editFormData.city} 
                            onChange = {handleInputChange} 
                        />

                       <EditFormField
                            label = 'Current Password: ' 
                            type = 'password'
                            name = 'currentPassword' 
                            value = {editFormData.currentPassword} 
                            onChange = {handleInputChange} 
                        />

                        <EditFormField
                            label = 'New Password: ' 
                            type = 'password'
                            name = 'newPassword' 
                            value = {editFormData.newPassword} 
                            onChange = {handleInputChange} 
                        />

                        <EditFormField
                            label = 'Confirm New Password: ' 
                            type = 'password'
                            name = 'confirmNewPassword' 
                            value = {editFormData.confirmNewPassword} 
                            onChange = {handleInputChange} 
                        />
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditUserInfoForm;
