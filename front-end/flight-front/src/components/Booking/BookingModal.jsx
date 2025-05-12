import React, { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {  useNavigate } from 'react-router-dom';

const BookingModal = ({ flightNumber, seatClass, onClose }) => {
  const [email, setEmail] = useState('');
  const [passengerBookingId, setPassengerBookingId] = useState('');
  const [amount,setAmount] = useState(0);
  const navigate = useNavigate();

  const [passengers, setPassengers] = useState([
    { passengerName: '', gender: '', age: '' },
  ]);
  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };
  const now = new Date();
  const bookingDate = format(now, 'yyyy-MM-dd HH:mm:ss');

  const addPassenger = () => {
    setPassengers([...passengers, { passengerName: '', gender: '', age: '' }]);
  };

  
  const handleSubmit = async () => {
    const noOfSeats = passengers.length;
    const token = localStorage.getItem('token');
  
    try {
      // 1. Get amount for selected class and number of seats
      const res = await axios.get(`http://localhost:1004/BMS/getPrice/${noOfSeats}/${seatClass}/${flightNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const price = res.data;
      setAmount(price); // optional state update
  
      // 2. Create Razorpay order
      const response = await axios.post('http://localhost:1007/create-order', {
        amount: price,
        bookingId: passengerBookingId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const orderId = response.data.order_id;
  
      // 3. Define Razorpay options with booking inside handler
      const options = {
        key: "rzp_test_ILPSwqbfsbaNMA",
        amount: price * 100,
        currency: "INR",
        name: "Flight Booking IRCTC",
        description: "Test Transaction",
        order_id: orderId,
        handler: async function (response) {
          try {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
  
            // 4. Capture payment
            const captureRes = await axios.post("http://localhost:1007/capture-payment", {
              paymentId: response.razorpay_payment_id,
              amount: price,
              orderId: orderId
            }, {
              headers: { "Content-Type": "application/json" },
            });
  
            if (typeof captureRes.data === "string" && captureRes.data.includes("already captured")) {
              alert("Payment was already captured. Database updated.");
            } else {
              alert(captureRes.data.message || "Payment captured successfully.");
            }
  
            // 5. Book tickets ONLY after payment success
            const bookingDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            const booking = {
              bookingDate: bookingDate,
              email,
              passengerBookingId,
              passengers
            };
  
            const bookingResponse = await axios.post(
              `http://localhost:1004/BMS/bookTickets/${flightNumber}/${seatClass}/${noOfSeats}`,
              booking,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
  
            alert(bookingResponse.data);
            onClose();
            navigate("/search");
  
          } catch (err) {
            console.error("Error in payment/booking:", err.response?.data || err.message);
            alert("Something went wrong during payment or booking.");
          }
        },
        prefill: {
          name: "Pavan Sai Gopal",
          email: "pavansainaidu154@gmail.com",
          contact: "9133631455",
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
  
    } catch (error) {
      console.error("Error in booking flow:", error.response?.data || error.message);
      alert(error.response?.data || "Error in booking process.");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg  max-h-[90vh] overflow-y-auto ">
        <h2 className="text-lg font-semibold mb-4">Book Seats for {seatClass}</h2>

        <label className="block mb-3">
          <span className="text-sm text-gray-700">Email</span>
          <input
            type="email"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block mb-3">
          <span className="text-sm text-gray-700">Passenger Booking Id</span>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            value={passengerBookingId}
            onChange={(e) => setPassengerBookingId(e.target.value)}
          />
        </label>

        {passengers.map((passenger, index) => (
          <div key={index} className="border border-gray-200 rounded p-3 mb-3">
            <h4 className="text-sm font-medium mb-2">Passenger {index + 1}</h4>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-2 border p-2 rounded"
              value={passenger.passengerName}
              onChange={(e) => handlePassengerChange(index, 'passengerName', e.target.value)}
            />
            <select
              className="w-full mb-2 border p-2 rounded"
              value={passenger.gender}
              onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
            >
                <option value="">Select Gender</option> 
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              type="number"
              placeholder="Age"
              className="w-full border p-2 rounded"
              value={passenger.age}
              onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
            />
          </div>
        ))}

        <button onClick={addPassenger} className="text-blue-600 underline mb-4">
          + Add Another Passenger
        </button>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
