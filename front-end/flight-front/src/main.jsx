import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route } from 'react-router-dom'
import { createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import SignupForm from './components/Login/Regsiter.jsx'
import Search from './components/Search/Search.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import Logout from './components/Logout/Logout.jsx'
import BookingModal from './components/Booking/BookingModal.jsx'
import BookFlightPage from './components/Booking/BookFlightPage.jsx'
import Payment from './components/Payment/Payment.jsx'

// const router = createBrowserRouter([
//       {
//         path: '/',
//         element: <App />
//       },
//       {
//         path : '/register',
//         element: <SignupForm />
//       }
//   ])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<SignupForm />} />
      <Route path="/logout" element={
        <ProtectedRoute >
        {<Logout />}
        </ProtectedRoute>
        } />

      <Route path="/search" element ={
      <ProtectedRoute>
       {<Search />}
       </ProtectedRoute>
      }
        />

<Route path="/book" element={
        <ProtectedRoute >
        {<BookFlightPage />}
        </ProtectedRoute>
        } />

        
<Route path="/payment" element={
        <ProtectedRoute >
        {<Payment />}
        </ProtectedRoute>
        } />
</>


    )
  )
  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    </StrictMode>,
)
