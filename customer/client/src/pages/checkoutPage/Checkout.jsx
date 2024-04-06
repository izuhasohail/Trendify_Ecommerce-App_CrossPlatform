import React, { useEffect } from "react";
import "./Checkout.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "../../components/Navbar/Navbar";
import pic from "../../assets/pics/slider2.png";
import axios from "axios";
import { getCartItems, clearCart } from "../../cartService";
import { useSelector } from "react-redux";
import AlertBox from "../../components/alert/AlertBox";
const CheckoutPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertMessage, setAlertMessage] = useState("");

  const user=useSelector((state)=>state.user.value);

  const navigate = useNavigate();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const cartItems = getCartItems();
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal;
  const [errorMessages, setErrorMessages] = useState([]);

  const validateFields = () => {
    let errors = [];

    // Validate email
    if (newAddressObj.email === "") {
      errors.push("Email is required");
    }

    // Validate name
    if (newAddressObj.name === "") {
      errors.push("Name is required");
    }

    if (newAddressObj.address === "") {
      errors.push("Address is required");
    }

    // Validate payment method
    if (!selectedPaymentMethod) {
      errors.push("Please select a payment method");
    }

    // Validate billing address
    if (!billingSameAsShipping && !showBillAddress) {
      errors.push("Please select a billing address option");
    }

    // Validate billing address fields if different billing address is selected
    if (showBillAddress) {
      if (
        billingAdressObj.firstName === "" ||
        billingAdressObj.lastName === "" ||
        billingAdressObj.address === "" ||
        billingAdressObj.phone === ""
      ) {
        errors.push("Please fill in all fields for billing address");
      }
    }

    setErrorMessages(errors);

    setShowAlert(errors.length > 0); // Show alert only if there are errors

    if (errors.length > 0) {
      // If there are errors, set the alert information
      setAlertType("error"); // You can customize the type based on your styling
      setAlertMessage("Please fill in all fields");

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    return errors.length === 0;
  };

  const [showApartmentInput, setShowApartmentInput] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(false);

  const [lastName, setLastName] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showBillAddress, setShowBillAddress] = useState(false);

  const userId = useSelector((state) => state.user.value);
  // const userId = "659fbfeb44ab4b4734019df1";

  const [customerDataObj, setCustomerDataObj] = useState({
    _id: "",
    email: "",
    name: "",
    deliveryAddress: "",
    phone: "",
    city: "",
    apartment: "",
    country: "Pakistan",
  });

  const [newAddressObj, setNewAddressObj] = useState({
    _id: "",
    email: "",
    name: "",
    address: "",
    phone: "",
    city: "",
    apartment: "",
    country: "Pakistan",
  });

  const [billingAdressObj, setBillingAddressObj] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    city: "",
    country: "Pakistan",
    apartment: "",
  });

  const fetchCustomer = async () => {
    try {
      console.log("in fetchCustomer function");
      const response = await axios.get(
        ` http://localhost:4000/api/customers/${userId}`
      );
      console.log("customer response data ", response.data);
      setCustomerDataObj(response.data);

      console.log(customerDataObj.deliveryAddress.split(";")[0]);
    } catch (error) {
      console.log("fail to fetch products", error);
    }
  };

  useEffect(() => {
    setNewAddressObj((prevObj) => ({
      ...prevObj,
      address: customerDataObj.deliveryAddress.split(";")[0],
      city: customerDataObj.deliveryAddress.split(";")[1],
      phone: customerDataObj.phone,
      email: customerDataObj.email,
      name: customerDataObj.name,
      _id: customerDataObj._id,
    }));
  }, [customerDataObj]);

  const handleInputChange = (field, value) => {
    setNewAddressObj((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleBillAddressInputChange = (field, value) => {
    setBillingAddressObj((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  useEffect(() => {
    fetchCustomer();
  }, [userId]);

  useEffect(() => {
    console.log(customerDataObj?.deliveryAddress.split(";")[0]);
    console.log(`id of customer `, customerDataObj._id);
  }, [customerDataObj]); // This ensures the effect runs whenever customerData changes

  const handlePaymentMethodChange = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  const toggleApartmentInput = () => {
    setShowApartmentInput(!showApartmentInput);
  };

  const toggleBillingInput = (boolval) => {
    setBillingSameAsShipping(!boolval);
    setShowBillAddress(boolval);
  };

  const [showSumm, setShowSumm] = useState(false);

  const handleShowSumm = () => {
    const orderSummaryElement = document.querySelector(".products-in-cart");
    const orderTotal = document.querySelector(".p-total");
    if (window.innerWidth <= 768) {
      // Adjust the threshold according to your needs
      setShowSumm(!showSumm);
      if (showSumm && orderSummaryElement) {
        orderSummaryElement.style.display === "none"
          ? (orderSummaryElement.style.display = "block")
          : (orderSummaryElement.style.display = "none");
      }

      if (showSumm && orderTotal) {
        orderTotal.style.display === "none"
          ? (orderTotal.style.display = "block")
          : (orderTotal.style.display = "none");
      }
    }
  };

  const resetForm = () => {
    setCustomerDataObj({
      _id: "",
      email: "",
      name: "",
      deliveryAddress: "",
      phone: "",
      city: "",
      apartment: "",
      country: "Pakistan",
    });

    setNewAddressObj({
      _id: "",
      email: "",
      name: "",
      address: "",
      phone: "",
      city: "",
      apartment: "",
      country: "Pakistan",
    });

    setBillingAddressObj({
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      city: "",
      country: "Pakistan",
      apartment: "",
    });

    setLastName("");
    setSelectedPaymentMethod("");
    setShowBillAddress(false);
    setBillingSameAsShipping(false);
    setShowApartmentInput(false);
  };

  const makePayment = async () => {



    if(!user){
      navigate('/Login')
    }

    else{

    const isValid = validateFields();

    if (isValid) {
      if (selectedPaymentMethod == "card") {
        const stripe = await loadStripe(
          "pk_test_51NXq0HHNlWpHqTBcICYrzce5lTwBxQFUTrakIMu6lRJiJddSjUXpYMjTaqrnYboRvqlU3l14kB0hOKsqEv89Xe9500t8KA4QiU"
        );

        const body = {
          products: cartItems,
        };

        try {
          const response = await axios.post(
            "http://localhost:4000/api/orders/create-payment",
            body
          );

          const session = response.data;

          await createOrder().then((response) => {
            resetForm();
            clearCart();
          });

          const result = await stripe.redirectToCheckout({
            sessionId: session.id,
          });

          console.log("After stripe.redirectToCheckout", result);

          if (result.erro) {
            console.log(result.error.message);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else if (selectedPaymentMethod == "cash") {
        await createOrder().then((response) => {
          resetForm();
          clearCart();
          setShowAlert(true); // Show alert only if there are errors

          setAlertType("success"); // You can customize the type based on your styling
          setAlertMessage("Order has been placed successfully!");

          // Hide the alert after 3 seconds
          setTimeout(() => {
            setShowAlert(false);
            navigate("/Products/all");
          }, 3000);
        });
      }
    } else {
      console.log("Validation failed. Please check the form for errors.");
    }

  }


  };

  const createOrder = async () => {
    cartItems.map((item) => {
      console.log('each item details ' ,item)
      console.log("all _ids of items");
      console.log(item?._id);
    });

    const customeraddress =
      newAddressObj.address +
      " " +
      newAddressObj.apartment +
      "  ;  " +
      newAddressObj.city +
      " ;  " +
      "Pakistan";
    const _billingAddress =
      billingAdressObj.address +
      " " +
      newAddressObj.apartment +
      " ; " +
      billingAdressObj.city +
      " ; " +
      "Pakistan";

    // Prepare order details
    const orderData = {
      customer: customerDataObj?._id,
      products: cartItems.map((item) => ({
        product: item?._id, // Assuming _id is the ObjectId of the product
        quantity: item.quantity,
      })),
      deliveryAddress: customeraddress,
      billingAddress: billingSameAsShipping ? customeraddress : _billingAddress,
      total: total,
      paymentMethod: selectedPaymentMethod,
    };

    console.log("order data from frontend", orderData);

    try {
      // Make a request to your backend to create the order
      const response = await axios.post(
        "http://localhost:4000/api/orders/placeorder",
        orderData
      );
      console.log(response.data); // Log the response from the backend
      console.log("order created: ", response.data);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <>
      <Navbar />
      {showAlert && (
        <AlertBox
          type={alertType}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="checkout-page">
        <div className="ck-left-div">
          <div className="ck-left-content">
            <div className="account">
              <div className="account-contact">
                <p>Contact</p>
                {userId ? (
                  <Link to="/Login">
                    <span>Have an account? </span>Login
                  </Link>
                ) : (
                  <Link to="">
                    <span>Logout </span>
                  </Link>
                )}
              </div>

              <div className="address-div">
                <input
                  type="email"
                  name="address"
                  id=""
                  placeholder="xyz@gmail.com"
                  value={newAddressObj?.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="email-content">
              <input type="checkbox" />
              <p>Email me with news and offers</p>
            </div>

            <hr />

            <div className="delivery-content">
              <h2>Delivery</h2>
              <div className="dl-country">
                <label htmlFor="country">Country/Region</label>
                <input
                  type="text"
                  name="last-name"
                  id=""
                  readOnly
                  value={newAddressObj?.country}
                />
              </div>

              <div className="names-div">
                <div className="first-name">
                  <label htmlFor="country">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={newAddressObj?.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="last-name">
                  <label htmlFor="country">Last Name</label>
                  <input
                    type="text"
                    name="last-name"
                    id=""
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="address-div">
                <input
                  type="text"
                  name="address"
                  id=""
                  placeholder="Address"
                  value={newAddressObj?.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="apartment-div">
                {!showApartmentInput && (
                  <p onClick={toggleApartmentInput}>
                    + Add apartment, suite, etc.
                  </p>
                )}
                {showApartmentInput && (
                  <input
                    type="text"
                    name="apartment"
                    id=""
                    placeholder="Apartment, suite, etc. (optional)"
                    value={newAddressObj.apartment}
                    onChange={(e) =>
                      handleInputChange("apartment", e.target.value)
                    }
                  />
                )}
              </div>

              <div className="dl-country _city">
                <label htmlFor="city">Select City</label>
                <select
                  name="cityCode"
                  id="city"
                  value={newAddressObj?.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                >
                  <option value="ISB">Islamabad</option>
                  <option value="RWP">Rawalpindi</option>
                  <option value="MTN">Multan</option>
                  <option value="LH">Lahore</option>
                  <option value="FS">Faisalabad</option>
                  <option value="BWP">Bahwalpur</option>
                  <option value="SH">Sahiwal</option>
                </select>
              </div>

              <div className="address-div">
                <input
                  type="tel"
                  pattern="[0-9]{4}-[0-9]{7}"
                  name="phone"
                  id=""
                  placeholder="Phone"
                  value={newAddressObj?.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              {/* <div className="shipping-method">
                <h3>Shipping Method</h3>
                <div className="shipping">
                  <p>Rest of the Country</p>
                  <p>$ {subtotal}</p>
                </div>
              </div> */}
            </div>

            <div className="payment-content">
              <h3>
                Payment Method{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>
              </h3>

              <div className="payment-options">
                <div className="pm-opt1">
                  <input
                    className="payment-option"
                    type="radio"
                    name="p-option"
                    checked={selectedPaymentMethod === "cash"}
                    onChange={() => handlePaymentMethodChange("cash")}
                  />
                  <label htmlFor="">COD</label>
                </div>

                {selectedPaymentMethod === "cash" && (
                  <div className="wrapper">
                    <div className="cash-notice">Aplicable in all cities</div>
                  </div>
                )}

                <div className="pm-opt2">
                  <input
                    type="radio"
                    className="payment-option"
                    checked={selectedPaymentMethod === "card"}
                    onChange={() => handlePaymentMethodChange("card")}
                    name="p-option"
                  />
                  <label htmlFor="">Credit Card/Debit Card</label>
                </div>
                {selectedPaymentMethod === "card" && (
                  <div className="wrapper">
                    <div className="wrapper">
                      <div className="cash-notice">
                        All transactions are encrypted and secured
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="billing-content">
              <h3>
                Billing address{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>{" "}
              </h3>
              <div className="bill-op-1">
                <input
                  className="payment-option"
                  type="radio"
                  name="bill-option"
                  onChange={() => toggleBillingInput(false)}
                />
                <label htmlFor="">Same as shipping address</label>
              </div>

              <div className="bill-op-2">
                <input
                  className="payment-option"
                  type="radio"
                  name="bill-option"
                  onChange={() => toggleBillingInput(true)}
                />
                <label htmlFor="">Use a different billing address</label>
              </div>

              {showBillAddress && (
                <div className="delivery-content diff-billing">
                  <div className="dl-country">
                    <label htmlFor="country">Country/Region</label>
                    <input
                      type="text"
                      name="last-name"
                      id=""
                      readonly
                      value={billingAdressObj.country}
                    />
                  </div>

                  <div className="names-div">
                    <div className="first-name">
                      <label htmlFor="country">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        onChange={(e) =>
                          handleBillAddressInputChange(
                            "firstName",
                            e.target.value
                          )
                        }
                        value={billingAdressObj.firstName}
                      />
                    </div>
                    <div className="last-name">
                      <label htmlFor="country">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        id=""
                        value={billingAdressObj.lastName}
                        onChange={(e) =>
                          handleBillAddressInputChange(
                            "lastName",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="address-div">
                    <input
                      type="text"
                      name="address"
                      id=""
                      placeholder="Address"
                      value={billingAdressObj.address}
                      onChange={(e) =>
                        handleBillAddressInputChange("address", e.target.value)
                      }
                    />
                  </div>

                  <div className="apartment-div">
                    {!showApartmentInput && (
                      <p onClick={toggleApartmentInput}>
                        + Add apartment, suite, etc.
                      </p>
                    )}
                    {showApartmentInput && (
                      <input
                        type="text"
                        name="apartment"
                        id=""
                        placeholder="Apartment, suite, etc. (optional)"
                        value={billingAdressObj.apartment}
                        onChange={(e) =>
                          handleBillAddressInputChange(
                            "apartment",
                            e.target.value
                          )
                        }
                      />
                    )}
                  </div>

                  <div className="i-div">
                    <div className="dl-country _city">
                      <label htmlFor="city">Select City</label>
                      <select name="cityCode" id="city">
                        <option value="ISB">Islamabad</option>
                        <option value="RWP">Rawalpindi</option>
                        <option value="MTN">Multan</option>
                        <option value="LH">Lahore</option>
                        <option value="FS">Faisalabad</option>
                        <option value="BWP">Bahwalpur</option>
                        <option value="SH">Sahiwal</option>
                      </select>
                    </div>
                  </div>

                  <div className="address-div">
                    <input
                      type="number"
                      name="phone"
                      id=""
                      value={billingAdressObj.phone}
                      placeholder="Phone"
                      onChange={(e) =>
                        handleBillAddressInputChange("phone", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="cnfrm-order-btn"
              onClick={makePayment}
            >
              Confirm Order
            </button>
          </div>
        </div>

        <div className="ck-right-div">
          <div className="ck-right-content">
            <div className="show-order-summ">
              <p className="p-1" onClick={handleShowSumm}>
                Show order summary
              </p>
              <p>$ {total}</p>
            </div>

            {true && (
              <div className="products-in-cart">
                {cartItems.map((item) => (
                  <div key={item._id} className="product-dt">
                    <div className="img-con">
                      <div className="p-img">
                        <span>{item.quantity}</span>
                        <img src={item.imgUrl} alt="" />
                      </div>
                      <div className="p-content">
                        <p>{item.name}</p>
                        <span>{item.fabric}</span>
                      </div>
                    </div>
                    <div className="p-price">
                      <p>$ {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-total">
              <div className="p-subtotal">
                <p>Subtotal</p>
                <p>$ {subtotal.toFixed(2)}</p>
              </div>
              <div className="pp-total">
                <h2>Total</h2>
                <h2>$ {total.toFixed(2)}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
