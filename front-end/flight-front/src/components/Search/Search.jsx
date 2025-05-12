import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FlightCard from '../Flight/FlightCard'; 
import Logout from '../Logout/Logout';
import { FaExchangeAlt } from 'react-icons/fa'; // Fa = FontAwesome

const Search = () => {
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });

  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    const { source, destination, date } = searchParams;

    if (!source || !destination || !date) {
      alert('Please fill all fields!');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`http://localhost:1001/FMS/flights/${source}/${destination}/${date}`,{
      headers: {
        Authorization: `Bearer ${token}` // Pass the token in the Authorization header
      }
    });
      setFlights(response.data);
      setError('');
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);  // <--- more detailed      setFlights([]);
      setError('No flights found or an error occurred.');
    }
  };

  const handleSwap = () => {
    // setSearchParams(prevParams => ({
    //   ...prevParams,
    //   source: prevParams.destination,
    //   destination: prevParams.source
    // }));

    setSearchParams({source:searchParams.destination,destination: searchParams.source ,date: searchParams.date});
  };

    const [time,setTime] = useState(new Date());
  

  useEffect(() => {

     const timer = setInterval(() => {
        setTime(new Date())
      },1000);

      return () => clearInterval(timer);
  }, [])

  const formatTime = (date) => {
    const localDate = date.toLocaleDateString();
    const localTime = date.toLocaleTimeString('en-GB')
    return  `${localDate} [${localTime}]`;
  };

  const [recentSearches, setRecentSearches] = useState([]);

useEffect(() => {

  const token = localStorage.getItem('token');

  const fetchRecentSearches = async () => {
    try {
      const response = await axios.get('http://localhost:1001/FMS/getRecentSearchs', {
        headers: {
          Authorization: `Bearer ${token}` // Pass the token in the Authorization header
        }
      });
      setRecentSearches(response.data);
     
    } catch (err) {
      console.error('Error fetching recent searches:', err);
    }
  };

  fetchRecentSearches();
}, []);


const handleRecentClick = async (recent) => {
  setSearchParams({
    source: recent.recentFlights.source,
    destination: recent.recentFlights.destination,
    date: recent.recentFlights.date
  });

  

};


  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-indigo-200">
      <div className="w-full max-w-5xl p-6 bg-white  rounded-2xl shadow-xl">
        <div className='bg-blue-400 border-2'>
        <div className='bg-orange-400 p-4'> 
        <h2 className="text-2xl font-bold text-center text-gray-800">Flight Search</h2>
        <p className="text-sm  text-center">{formatTime(time)}</p>
        </div>
        {/* Search Form */}
        <div className="flex  justify-center py-4">
          <div >
            <label className="block text-black-600 mb-1">Source</label>
            <input
              type="text"
              name="source"
              value={searchParams.source}
              onChange={handleChange}
              placeholder="Enter source"
              className="w-full px-4 py-2 border border-black-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className=" ">
                        <button
                            type="button"
                            className="  rounded-md  text-black mt-8 py-2 px-7 cursor-pointer "
                          onClick={handleSwap}
                        >
                          <FaExchangeAlt /> 

                        </button>
                    </div>
          <div>
            <label className="block text-black-600 mb-1">Destination</label>
            <input
              type="text"
              name="destination"
              value={searchParams.destination}
              onChange={handleChange}
              placeholder="Enter destination"
              className="w-full px-4 py-2 border border-black-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          </div>
          <div className='flex justify-center '>
           <div className='w-65'>
            <label className="block text-black-600 mb-1 ">Date</label>
            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-black-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
            </div>
            </div>
            <div className='flex justify-center p-4 ' >

            <button
              onClick={handleSearch}
              className="w-130 m-2 border-black-300 bg-indigo-500 hover:bg-indigo-900 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Search Flights
            </button>
       </div>
        </div>

{/* Recent Searches Section */}
{recentSearches.length > 0 && (
  <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Searches</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {recentSearches.map((recent) => (
        <div
          key={recent.id}
          onClick={() => handleRecentClick(recent)}
          className="cursor-pointer p-4 bg-white border border-gray-300 rounded-xl hover:shadow-lg transition duration-200"
        >
          <p><strong>From:</strong> {recent.recentFlights.source}</p>
          <p><strong>To:</strong> {recent.recentFlights.destination}</p>
          <p><strong>Date:</strong> {recent.recentFlights.date}</p>
        </div>
      ))}
    </div>
  </div>
)}



        {/* Results Section */}
        <div className="mt-8  p-4">
          {error && <p className="text-red-500 font-medium">{error}</p>}

          {flights.length > 0 && (
            <div className="space-y-6">
              {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    <Logout />
    </>
  );
};

export default Search;
