import React,{useContext, useState} from 'react'
import './Cart.css'
import {StoreContext} from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  // Destructure new promo code states and getFinalOrderAmount from context
  const {cartItems,food_list,removeFromCart,getTotalCartAmount,url,
         isPromoApplied, setIsPromoApplied, discountAmount, setDiscountAmount, promoCodeValue, getFinalOrderAmount}=useContext(StoreContext); // <--- UPDATED CONTEXT DESTRUCTURING
  const navigate=useNavigate();

  // promoCodeInput remains local as it's just for the input field
  const [promoCodeInput, setPromoCodeInput] = useState('');

  const handleApplyPromo = () => {
    if (promoCodeInput === promoCodeValue) { // Use promoCodeValue from context
      const subtotal = getTotalCartAmount();
      const calculatedDiscount = subtotal * 0.10; // 10% discount
      setDiscountAmount(calculatedDiscount); // Update context state
      setIsPromoApplied(true); // Update context state
      alert("Promo code applied successfully!");
    } else {
      setDiscountAmount(0); // Clear discount in context
      setIsPromoApplied(false); // Clear promo applied status in context
      alert("Invalid promo code.");
    }
  };

  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className='cart-items-title'>
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item,index)=>{
          if(cartItems[item._id]>0)
          {
            return(
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url+"/images/"+item.image} alt=''/>
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price*cartItems[item._id]}</p>
                  <p onClick={()=>removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr/>
              </div>
            )
          }
          return null;
        })}
      </div>
      <div className='cart-bottom'>
        <div className='cart-total'>
          <h2>Cart Total</h2>
          <div>
            {/* Original Subtotal */}
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr/>

            {/* Discount Amount (only if applied) */}
            {isPromoApplied && discountAmount > 0 && (
              <>
                <div className='cart-total-details'>
                  <p>Discount</p>
                  <p>-₹{discountAmount.toFixed(2)}</p>
                </div>
                <hr/>
              </>
            )}

            {/* Delivery Fee */}
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount()===0?0:70}</p>
            </div>
            <hr/>

            {/* Final Total */}
            <div className='cart-total-details'>
              <b>Total</b>
              <b>₹{getFinalOrderAmount().toFixed(2)}</b> {/* Use getFinalOrderAmount from context */}
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>Proceed To Checkout</button>
        </div>
        <div className='cart-promocode'>
          <div>
            <p>If You have a Promo Code, enter here</p>
            <div className='cart-promocode-input'>
              <input
                type='text'
                placeholder='Promo Code'
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                disabled={isPromoApplied}
              />
              <button onClick={handleApplyPromo} disabled={isPromoApplied}>Submit</button>
            </div>
            {isPromoApplied && (
              <p className="promo-applied-message">Promo code "{promoCodeValue}" applied!</p> /* Use promoCodeValue */
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Cart;
