import React, { useState } from "react";
import './Login.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope, faPhone, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import OnlineShopping from '../../assets/gifs/OnlineShopping.gif';
import ShoppingBag from '../../assets/gifs/ShoppingBag.gif';
import { setUserState } from "../../slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AlertBox from "../../components/AlertBox/AlertBox";

//input field method
const InputField = ({ icon, type, placeholder, name, pattern, value, onChange, readOnly }) => {

    let [isInputFocus, setInputFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
            <div className={isInputFocus ? "log-inputfield signiu-input-focus" : "log-inputfield"}>
                <FontAwesomeIcon icon={icon} className="signiu-input-icon" />
                <input
                    type={(type == 'password') ? (showPassword) ? 'text' : 'password' : { type }}
                    placeholder={placeholder}
                    name={name}
                    pattern={pattern}
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    required
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                />
                {(type == 'password') &&
                    ((showPassword) ?
                        <FontAwesomeIcon icon={faEyeSlash} className="signiu-input-icon" onClick={() => setShowPassword(false)} />
                        : <FontAwesomeIcon icon={faEye} className="signiu-input-icon" onClick={() => setShowPassword(true)} />)
                }
            </div>
        </>
    )

}


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const page = useSelector((state) => state.page.value);  // to navigate to the page after login

    //signin-signup switching
    let [signupMode, setSignupMode] = useState(false);

    // sign-up captcha
    const [showSignupButton, setShowSignupButton] = useState(false);
    const [captcha, setCaptcha] = useState(null);

    // log in form state
    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: '',
        isAdmin: false,
    });

    // sign up form state
    const [signupFormData, setSignupFormData] = useState({
        name: '',
        email: '',
        phoneno: '',
        password: '',
        confirmPassword: '',
        captcha: "",
    });

    // alert
    const [showAlert, setShowAlert] = useState(false)
    const [alertType, setAlertType] = useState()
    const [alertMessage, setAlertMessage] = useState('');

    // user login check
    const userCheck = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:4000/api/customers/login', { email, password })
            console.log('login response ', response);
            dispatch(setUserState(response.data._id))
            navigate(page);

        }
        catch (error) {
            console.log('Failed while authenticating user', error)
            if(error.response.status === 401) {
                setShowAlert(true)
                setAlertMessage('Incorrect Email or Password')
                setAlertType('error')
            }
        }
    }

    // admin login check
    const adminCheck = async (email, password) => {

        try {
            const response = await axios.post('http://localhost:4000/api/admin/login', { email, password })
            navigate('/Admin')

        }
        catch (error) {
            console.log('Failed while authenticating admin', error)
            if(error.response.status === 401) {
                setShowAlert(true)
                setAlertMessage('Incorrect Email or Password')
                setAlertType('error')
            }
        }
    }


    //login input field change handler
    const handleLoginInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setLoginFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    //admin checkbox handler
    const handleAdminCheckboxChange = (e) => {
        setLoginFormData((prevData) => ({
            ...prevData,
            isAdmin: !loginFormData.isAdmin,
        }))
    }

    //sign up input field change handler
    const handleSignupInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setSignupFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }


    // check for the password
    const isPasswordValid = (password) => {
        // Minimum 8 characters, maximum 16 characters
        const lengthRegex = /^[A-Za-z\d@$!%*#?&]{8,16}$/;

        // At least one capital letter, one special character, and one digit
        const characterRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])/;
        // const specialRegex = /[!@#$%^&*(),.?":{}|<>]/;


        return (
            lengthRegex.test(password) && characterRegex.test(password)
        );
    };

    //login form submission
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        userCheck(loginFormData.email, loginFormData.password);

        // if (!loginFormData.isAdmin) {
        //     // customer login
        //     userCheck(loginFormData.email, loginFormData.password);
        // }
        // else {
        //     // admin login
        //     adminCheck(loginFormData.email, loginFormData.password);
        // }
    }

    const handleSignupSignUp = async (e) => {
        e.preventDefault();
        console.log(signupFormData);
        if (signupFormData.captcha == captcha) {
            try {
                const response = await axios.post('http://localhost:4000/api/customers/createCustomer', signupFormData)
                console.log(response)
                if (response.status === 200) {
                    setShowAlert(true)
                    setAlertMessage('Account Created Successfully')
                    setAlertType('success')
    
                    setSignupFormData({
                        name: "",
                        email: "",
                        phoneno: "",
                        password: "",
                        confirmPassword: "",
                        captcha: "",
                    });
                    setShowSignupButton(false)
                    dispatch(setUserState(response.data._id))
                    navigate(page);
                    
                } else {
                    const error = await response.data;
                    console.log(error)
                    alert(`Error: ${error.error}`);
                }
            } catch (error) {
                console.error("Error:", error.message);
            }
        } else {
            setShowAlert(true)
            setAlertMessage('Incorrect Code')
            setAlertType('error')
        }
    };

    //signup form submission
    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        //all fields are filled
        if (!signupFormData.name || !signupFormData.email || !signupFormData.phoneno || !signupFormData.password || !signupFormData.confirmPassword) {
            setShowAlert(true)
            setAlertMessage('Please fill all the fields')
            setAlertType('error')
            return;
        }

        //phone number is in required format
        let phonePattern = /^\d{4}-\d{7}$/;
        if (!phonePattern.test(signupFormData.phoneno)) {
            setShowAlert(true)
            setAlertMessage('Please write the phone number in required format 0300-0000000')
            setAlertType('error')
            return;
        } 

        //valid password 
        if (!isPasswordValid(signupFormData.password) || !isPasswordValid(signupFormData.confirmPassword)) {
            setShowAlert(true)
            setAlertMessage('Password must be 8-16 characters long, with at least one capital letter, one special character, and one digit.')
            setAlertType('error')
            return;
        }

        //password == confirm
        if (signupFormData.password != signupFormData.confirmPassword) {
            setShowAlert(true)
            setAlertMessage('Passwords do not match. Please make sure both passwords are identical.')
            setAlertType('error')
            return;
        }

        // If everything is valid, generate captcha
        const randomDecimal = Math.random();
        const randomNumber = Math.floor(randomDecimal * (9999 - 1000 + 1)) + 1000;
        setCaptcha(randomNumber);
        const email = signupFormData.email;
        const tempData = { email: email, message: randomNumber };
        
        try {
            // Send form data to the server for email sending
            const response = await axios
                .post("http://localhost:4000/api/customers/captcha", tempData)
                .then((result) => {
                    if (result.data == 'Email sent') {
                        //show sign up button
                        setShowSignupButton(true)
                        setShowAlert(true)
                        setAlertMessage('A 4-digit code has been sent to your email')
                        setAlertType('info')
                    }
                    else if (result.data == "error"){
                        setShowAlert(true)
                        setAlertMessage('Failed To Send Captcha. Try A Different Email')
                        setAlertType('error')
                    }
                    else if (result.data == "exists"){
                        setShowAlert(true)
                        setAlertMessage('An Account With Provided Email Already Exists.\nUse A Different Email')
                        setAlertType('error')
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setShowAlert(true)
                    setAlertMessage('Failed To Send Captcha. Try A Different Email')
                    setAlertType('error')
                });
        } catch (error) {
            console.error("Error sending email:", error);
            setShowAlert(true)
            setAlertMessage('Failed To Send Captcha. Try A Different Email')
            setAlertType('error')
        }
    }





    return (
        <>
            {/* Alert */}
            {(showAlert) && <AlertBox message={alertMessage} type={alertType} onClose={() => { setShowAlert(false) }} />}


            <div className={signupMode ? "signiu-container sign-up-mode" : "signiu-container"}>

                <div className="signiu-sliding-circle">
                </div>

                <div className="signiu-forms-container">
                    {/* Sign in Form */}
                    <div className="signiu-form-wrapper sign-in-wrapper">
                        <h1 className="signiu-form-title">
                            Sign in
                        </h1>
                        <form onSubmit={handleLoginSubmit} className="log-form">
                            <InputField
                                icon={faEnvelope}
                                type="email"
                                placeholder="abc@gmail.com"
                                name="email"
                                value={loginFormData.email}
                                onChange={handleLoginInputChange}
                            />
                            <InputField
                                icon={faLock}
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={loginFormData.password}
                                onChange={handleLoginInputChange}
                            />
                            {/* <div className="signiu-admin-check">
                                <input
                                    type="checkbox"
                                    id="adminCheckbox"
                                    name="isAdmin"
                                    checked={loginFormData.isAdmin}
                                    onChange={handleAdminCheckboxChange}
                                />
                                <label htmlFor="adminCheckbox">
                                    Login as Admin
                                </label>
                            </div> */}
                            <button type="submit" className="signiu-submit-button"> LOGIN </button>
                        </form>
                    </div>

                    {/* Sign up form */}
                    <div className="signiu-form-wrapper sign-up-wrapper">
                        <h1 className="signiu-form-title">
                            Sign up
                        </h1>


                        <form onSubmit={handleSignupSignUp} className="log-form">
                            <InputField
                                icon={faUser}
                                type="text"
                                placeholder="Name"
                                name="name"
                                value={signupFormData.name}
                                readOnly={showSignupButton}
                                onChange={handleSignupInputChange}
                            />
                            <InputField
                                icon={faEnvelope}
                                type="email"
                                placeholder="abc@gmail.com"
                                name="email"
                                value={signupFormData.email}
                                readOnly={showSignupButton}
                                onChange={handleSignupInputChange}
                            />
                            <InputField
                                icon={faPhone}
                                type="tel"
                                placeholder="Phone No - 03xx-xxxxxxx"
                                name="phoneno"
                                pattern="[0-9]{4}-[0-9]{7}"
                                value={signupFormData.phoneno}
                                readOnly={showSignupButton}
                                onChange={handleSignupInputChange}
                            />
                            <InputField
                                icon={faLock}
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={signupFormData.password}
                                readOnly={showSignupButton}
                                onChange={handleSignupInputChange}
                            />

                            <InputField
                                icon={faLock}
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={signupFormData.confirmPassword}
                                readOnly={showSignupButton}
                                onChange={handleSignupInputChange}
                            />

                            {showSignupButton && (
                                <InputField
                                    icon={faLock}
                                    type="number"
                                    placeholder="Enter Captcha Code"
                                    name="captcha"
                                    value={signupFormData.captcha}
                                    onChange={handleSignupInputChange}
                                />
                            )}

                            {showSignupButton && (
                                <span className="captcha-mode-btn-containers"
                                >
                                    <button
                                        onClick={() => setShowSignupButton(!showSignupButton)}
                                        className="signiu-submit-button "
                                    >
                                        GO BACK
                                    </button>
                                    <button type="submit" className="signiu-submit-button signiu-panel-button">
                                        SIGNUP
                                    </button>

                                </span>
                            )}

                            {!showSignupButton && (
                                <button
                                    onClick={handleSignupSubmit}
                                    className="signiu-submit-button"
                                >
                                    {" "}
                                    SUBMIT{" "}
                                </button>
                            )}
                        </form>

                    </div>
                </div>


                <div className="signiu-panels-container">
                    {/* left panel */}
                    <div className="signiu-panel signiu-panel-left">
                        <div className="signiu-panel-header">
                            <h2 className="signiu-panel-title">
                                First Time Here?
                            </h2>
                            <p className="signiu-panel-description">
                                Let's Get You Started! <br />Begin your fashion adventure by creating an account with us.
                            </p>
                            <button className="signiu-submit-button signiu-panel-button" onClick={() => setSignupMode(true)}>
                                SIGN UP
                            </button>
                        </div>
                        <div className="signiu-panel-img-wrapper signiu-left-img">
                            <div className="signiu-panel-img ">
                                <img src={OnlineShopping} />
                            </div>
                        </div>
                    </div>

                    {/* right panel */}
                    <div className="signiu-panel signiu-panel-right">
                        <div className="signiu-panel-header">
                            <h2 className="signiu-panel-title">
                                Welcome Back!
                            </h2>
                            <p className="signiu-panel-description">
                                Unleash your style - Login for an exciting fashion experience!
                            </p>
                            <button className="signiu-submit-button signiu-panel-button" onClick={() => setSignupMode(false)}>
                                SIGN IN
                            </button>
                        </div>
                        <div className="signiu-panel-img-wrapper signiu-right-img">
                            <div className="signiu-panel-img ">
                                <img src={ShoppingBag} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;