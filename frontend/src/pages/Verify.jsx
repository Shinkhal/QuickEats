import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  const verifyPayment = async () => {
    try {
      console.log("Verifying payment with data:", { success, orderId });
      setVerificationStatus('verifying');
      
      const response = await axios.post(`${url}/api/order/verified`, { order_id: orderId });
      console.log("Server response:", response.data);

      if (response.data.success) {
        setVerificationStatus('success');
        // Start countdown for redirect
        let timeLeft = 3;
        setCountdown(timeLeft);
        
        const countdownInterval = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            navigate("/myorders");
          }
        }, 1000);
      } else {
        setVerificationStatus('error');
        setErrorMessage(response.data.message || 'Payment verification failed');
        startErrorCountdown();
      }
    } catch (error) {
      setVerificationStatus('error');
      
      if (error.response) {
        console.error("API error:", error.response.data);
        setErrorMessage(error.response.data.message || 'Server error occurred');
      } else {
        console.error("Network or other error:", error.message);
        setErrorMessage('Network error. Please check your connection.');
      }
      
      startErrorCountdown();
    }
  };

  const startErrorCountdown = () => {
    let timeLeft = 5;
    setCountdown(timeLeft);
    
    const countdownInterval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        navigate("/");
      }
    }, 1000);
  };

  useEffect(() => {
    if (success === "true" && orderId) {
      verifyPayment();
    } else {
      setVerificationStatus('error');
      setErrorMessage('Invalid payment parameters');
      startErrorCountdown();
    }
  }, [success, orderId, url, navigate]);

  const handleRetry = () => {
    if (success === "true" && orderId) {
      verifyPayment();
    } else {
      navigate("/");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoToOrders = () => {
    navigate("/myorders");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8 lg:p-12 max-w-md w-full text-center">
        
        {/* Verifying State */}
        {verificationStatus === 'verifying' && (
          <>
            <div className="mb-6 sm:mb-8">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4 relative">
                {/* Outer spinning ring */}
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                {/* Inner pulsing dot */}
                <div className="absolute inset-4 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
              <div className="text-4xl sm:text-5xl mb-4">💳</div>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Verifying Payment
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
              Please wait while we confirm your payment with the payment gateway. This usually takes a few seconds.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm font-medium">Processing...</span>
            </div>
          </>
        )}

        {/* Success State */}
        {verificationStatus === 'success' && (
          <>
            <div className="mb-6 sm:mb-8">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-4xl sm:text-5xl mb-4">🎉</div>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-3 sm:mb-4">
              Payment Verified!
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
              Your payment has been successfully verified. You&apos;ll be redirected to your orders page in {countdown} seconds.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleGoToOrders}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                View My Orders
              </button>
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}

        {/* Error State */}
        {verificationStatus === 'error' && (
          <>
            <div className="mb-6 sm:mb-8">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="text-4xl sm:text-5xl mb-4">❌</div>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-3 sm:mb-4">
              Verification Failed
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-2 leading-relaxed">
              {errorMessage}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              You&apos;ll be redirected to the home page in {countdown} seconds.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Go to Home
              </button>
            </div>
          </>
        )}

        {/* Order ID Display */}
        {orderId && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500">
              Order ID: <span className="font-mono font-medium text-gray-700">{orderId}</span>
            </p>
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default Verify;