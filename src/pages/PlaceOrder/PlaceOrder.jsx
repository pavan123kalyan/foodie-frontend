// src/pages/PlaceOrder/PlaceOrder.jsx

import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, getFinalOrderAmount,
          isPromoApplied, discountAmount, setIsPromoApplied, setDiscountAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onchangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data,[name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!token) {
      alert("Please login to proceed with payment.");
      navigate('/login');
      return;
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo.quantity = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getFinalOrderAmount(),
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

      if (response.data.success) {
        const { orderId, amount, currency, key, mongoOrderId } = response.data;

        const itemDescriptions = orderItems.map(item => `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`).join('\n');
        const fullDescription = `Order Items:\n${itemDescriptions}\nDelivery Charges: ₹70`;


        const options = {
          key: key,
          amount: amount,
          currency: currency,
          name: "Foodie Website",
          description: fullDescription,
          order_id: orderId,
          handler: async function (razorpayResponse) {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = razorpayResponse;

            const verifyResponse = await axios.post(url + "/api/order/verify", {
              orderId: orderId,
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              mongoOrderId: mongoOrderId
            }, { headers: { token } });

            if (verifyResponse.data.success) {
              alert("Payment Successful! Your order has been placed.");
              setCartItems({}); // Clear cart items state ONLY on successful payment
              setIsPromoApplied(false); // Reset promo applied status
              setDiscountAmount(0); // Reset discount amount
              navigate("/myorders");
            } else {
              alert("Payment verification failed. Please contact support.");
              // For verification failure after payment, reset promo states but keep cart
              setIsPromoApplied(false); // Reset promo applied status
              setDiscountAmount(0); // Reset discount amount
              navigate(`/verify?success=false&orderId=${orderId}`);
            }
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone
          },
          notes: {
            order_id: orderId,
            address: `${data.street}, ${data.city}, ${data.state}, ${data.zipcode}, ${data.country}`,
            order_summary: fullDescription
          },
          theme: {
            color: "#3399CC"
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

        rzp1.on('payment.failed', async function (response) {
          alert("Payment failed: " + response.error.description);

          // For direct payment failure/cancellation, reset promo states but keep cart
          // DO NOT CALL setCartItems({}) here
          setIsPromoApplied(false); // Reset promo applied status
          setDiscountAmount(0); // Reset discount amount

          try {
            await axios.post(url + "/api/order/verify", {
              orderId: orderId,
              success: false,
              mongoOrderId: mongoOrderId
            }, { headers: { token } });
            console.log("Backend notified of payment failure, order should be deleted.");
          } catch (error) {
            console.error("Error notifying backend of payment failure:", error);
          }

          navigate(`/verify?success=false&orderId=${orderId}`);
        });

      } else {
        alert("Failed to initiate payment: " + response.data.message);
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (getTotalCartAmount() === 0 && token) {
      navigate('/cart');
    }
  }, [getTotalCartAmount, token, navigate]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>
        <div className='multi-fields'>
          <input required name="firstName" onChange={onchangeHandler} value={data.firstName} type='text' placeholder='First Name' />
          <input required name="lastName" onChange={onchangeHandler} value={data.lastName} type='text' placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onchangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onchangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className='multi-fields'>
          <input required name='city' onChange={onchangeHandler} value={data.city} type='text' placeholder='City' />
          <input required name='state' onChange={onchangeHandler} value={data.state} type='text' placeholder='State' />
        </div>
        <div className='multi-fields'>
          <input required name='zipcode' onChange={onchangeHandler} value={data.zipcode} type='text' placeholder='Zip code' />
          <input required name='country' onChange={onchangeHandler} value={data.country} type='text' placeholder='Country' />
        </div>
        <input required name='phone' onChange={onchangeHandler} value={data.phone} type="text" placeholder='Phone number' />
      </div>
      <div className='place-order-right'>
        <div className='cart-total'>
          <h2>Cart Total</h2>
          <div>
            {/* Original Subtotal */}
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />

            {/* Discount Amount (only if applied and cart is not empty) */}
            {isPromoApplied && discountAmount > 0 && getTotalCartAmount() > 0 && ( // <--- CRITICAL: Only show discount if cart has items
              <>
                <div className='cart-total-details'>
                  <p>Discount</p>
                  <p>-₹{discountAmount.toFixed(2)}</p>
                </div>
                <hr/>
              </>
            )}

            {/* Delivery Fee (only if cart has items) */}
            {getTotalCartAmount() > 0 && ( // <--- CRITICAL: Only show delivery fee if cart has items
              <>
                <div className='cart-total-details'>
                  <p>Delivery Fee</p>
                  <p>₹{70}</p>
                </div>
                <hr />
              </>
            )}

            {/* Final Total (only if cart has items) */}
            <div className='cart-total-details'>
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getFinalOrderAmount().toFixed(2)}</b> {/* Show 0 if cart is empty */}
            </div>
          </div>
          {!token ? (
            <button type='button' onClick={() => navigate('/login')}>Login to Proceed</button>
          ) : (
            <button type='submit'>Proceed To Payment</button>
          )}
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
