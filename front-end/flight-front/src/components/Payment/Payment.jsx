import React, { useState } from 'react';
import axios from 'axios';

function Payment() {

  const [amount,setAmount] = useState(0);

  const createOrder = async () => {
    console.log('Order created');
    console.log(amount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
  }
  const token = localStorage.getItem("token");

  const response = await axios.post('http://localhost:1007/create-order',{
    "amount":amount
  },
    {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  }
  )

  console.log(response.data.order_id)
  const  orderId  = response.data.order_id;
  const options = {
    key: "rzp_test_ILPSwqbfsbaNMA", // Replace with your Razorpay key ID
   amount: amount*100,
    currency: "INR",
    name: "Flight Booking IRCTC",
    description: "Test Transaction",
    order_id: orderId,
    handler: async function (response) {
      alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
      capturePayment(response.razorpay_payment_id, amount, orderId);
    },
    prefill: {
      name: "Pavan",
      email: "pavan@example.com",
      contact: "9999999999",
    },
    notes: {
      address: "Your address here",
    },
    theme: {
      color: "#3399cc",
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
  };

async function capturePayment(paymentId, amount,orderId)  {
try{
  const response = await axios.post("http://localhost:1007/capture-payment",{
       paymentId: paymentId, amount: amount, orderId: orderId 
          },
      {
      headers: { "Content-Type": "application/json" },

    })
    const data = response.data;

    if (typeof data === "string" && data.includes("already captured")) {
      alert("Payment was already captured. Database updated.");
    } else {
      alert(data.message || "Payment captured successfully.");
    }
  } catch (error) {
    console.error("Error capturing payment:", error);
    alert("Failed to capture payment.");
  }
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl border-2 border-gray-300 rounded-xl shadow-lg bg-white p-6">
        <h2 className="text-2xl font-bold text-center text-white bg-green-500 p-4 rounded-lg">
          Razorpay Payment Gateway
        </h2>

        <div className="flex flex-col items-center mt-6 space-y-6">
          <div className="flex items-center space-x-4 bg-gray-200 p-4 rounded-md w-full">
            <label htmlFor="amount" className="text-lg font-medium">
              Enter Amount (INR):
            </label>
            <input
              type="number"
              id="amount"
              value = {amount}
              onChange={ (e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              className="flex-grow p-2 rounded-md border border-gray-400"
              required
            />
          </div>

          <button
            onClick={createOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
