import React from 'react';
import { useNavigate } from 'react-router-dom';

 const FlightCard = ({ flight }) => {

  const navigate = useNavigate();

  const {
    flightNumber,
    airline,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    status,
    seats
  } = flight;

  const getAirlineColor = (airline) => {
    switch (airline.toLowerCase()) {
      case 'indigo':
        return 'text-indigo-600';
      case 'air india':
        return 'text-red-600';
      case 'vistara':
        return 'text-purple-600';
      case 'spicejet':
        return 'text-orange-500';
      case 'go first':
        return 'text-blue-500';
      default:
        return 'text-gray-700';
    }
  };

  const getAirlineBgClass = (airline) => {
    switch (airline.toLowerCase()) {
      case 'indigo':
        return 'bg-indigo-200';
      case 'air india':
        return 'bg-red-200';
      case 'vistara':
        return 'bg-purple-200';
      case 'spicejet':
        return 'bg-orange-200';
      case 'go first':
        return 'bg-blue-200';
      default:
        return 'bg-gray-200';
    }
  };
  
  const getAirlineLogo = (airline) => {
    const formatted = airline.toLowerCase().replace(/\s+/g, '');
    return `/logos/${formatted}.png`; // assuming logos are stored in public/logos/
  };
  
  
  return (
    <div className={`${getAirlineBgClass(airline)}  shadow-lg rounded-2xl p-6 mb-6 hover:scale-[1.02] transition duration-300 border border-gray-200`}>
      <div className="flex flex-col md:flex-row justify-between">
        {/* Left - Airline and Status */}
        <div className="mb-4 md:mb-0">
        <img
    src={getAirlineLogo(airline)}
    alt={`${airline} logo`}
    className="w-15 h-15 object-contain"
  />
          <h2 className={`text-xl font-bold ${getAirlineColor(airline)}`}>{airline}</h2>
          <p className="text-sm text-gray-600">Flight No: {flightNumber}</p>
          <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
            status === 'Scheduled' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {status}
          </span>
        </div>

        {/* Center - Route & Timing */}
        <div className="text-center">
          <div className="mb-2">
            <p className="text-sm text-gray-500">Departure</p>
            <p className="font-semibold">{departureAirport}</p>
            <p className="text-sm text-gray-600">{new Date(departureTime).toLocaleString()}</p>
          </div>
          <div className="text-2xl text-indigo-600 my-2">✈</div>
          <div>
            <p className="text-sm text-gray-500">Arrival</p>
            <p className="font-semibold">{arrivalAirport}</p>
            <p className="text-sm text-gray-600">{new Date(arrivalTime).toLocaleString()}</p>
          </div>
        </div>

        {/* Right - Seats Info */}
        <div className="mt-4 md:mt-0">
          <h3 className="text-sm text-gray-500 mb-1 font-semibold">Available Seats</h3>
          <ul className="text-sm text-gray-700 space-y-2">
  {seats?.map((seat) => (
    <li key={seat.seatId} className="flex items-center justify-between">
      <div>
        <span className="font-medium">{seat.seatClass}:</span> {seat.availableSeats} seats
      </div>
      <button onClick={() => navigate('/book', {
        state:{
          flightNumber,
          seatClass: seat.seatClass
        }
      })}
        className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
      >
        Book Now
      </button>
    </li>
  ))}
</ul>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
