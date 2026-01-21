// src/utils/razorpay.js

export const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

export const openRazorpayCheckout = ({
  amount,
  orderId,
  name,
  description,
  onSuccess,
}) => {
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID, 
    amount,
    currency: "INR",
    name,
    description,
    order_id: orderId,
    handler: onSuccess,
    theme: {
      color: "#fdd835",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
