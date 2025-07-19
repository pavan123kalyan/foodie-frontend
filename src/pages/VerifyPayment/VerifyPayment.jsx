// src/pages/VerifyPayment.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './VerifyPayment.css'; // Ensure you have this CSS file

const VerifyPayment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId'); // Keep orderId if you want to display it or use it

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false); // No backend call here, so loading is quick
        if (success === 'true') {
            setMessage("Payment successful! Your order has been placed and is being processed.");
        } else {
            setMessage("Payment failed or was cancelled. Please try again.");
        }
    }, [success, orderId]); // Dependencies

    return (
        <div className='verify-payment'>
            <div className="spinner">
                {isLoading ? <p>Loading...</p> : null}
            </div>
            <p>{message}</p>
            <div className="buttons">
                <button onClick={() => navigate('/')}>Go to Home</button>
                {/* Add a button to go to My Orders page, assuming you have one */}
                {success === 'true' && (
                    <button onClick={() => navigate('/myorders')}>View My Orders</button>
                )}
            </div>
        </div>
    );
};

export default VerifyPayment;
