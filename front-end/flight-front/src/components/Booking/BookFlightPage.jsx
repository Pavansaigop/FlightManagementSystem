import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingModal from '../Booking/BookingModal'; // Adjust the import path

const BookFlightPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Access the flightNumber and seatClass from the state
  const { flightNumber, seatClass } = location.state || {};
    console.log(flightNumber, seatClass);
  // Function to handle closing the modal and navigating back
  const handleCloseModal = () => {
    navigate(-1); // Go back to the previous page (search results)
  };

  // Render the BookingModal only if flightNumber and seatClass are available
  return (
    <div>
      {flightNumber && seatClass ? (
        <BookingModal
          flightNumber={flightNumber}
          seatClass={seatClass}
          onClose={handleCloseModal}
        />
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-2">No Flight Selected</h2>
            <p className="text-gray-600 mb-4">Please select a flight to book.</p>
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-500 text-white rounded">
              Go Back to Search Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFlightPage;