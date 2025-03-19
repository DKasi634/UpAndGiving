
import { Outlet, Route } from 'react-router-dom'
import './App.css'
import { Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignInPage from './pages/auth/signin.page'
import DonorDashboard from './pages/DashboardPage'
import AccountNavigation from './routes/account-navigation.route'
import Donate from './pages/donor/DonatePage'
import DonationRequests from './pages/donor/DonationRequestsPage'
import LandingNavigation from './routes/landing-navigation.route'
import RequestDonation from './pages/ngo/RequestDonationPage'
// import ProfilePage from './pages/ngo/ProfilePage'
import SignUpPage from './pages/auth/signup.page'
import useAuth from './hooks/use-auth.hook'
import Toast from './components/generic/toast/toast.component'
import AuthProtectedRoute from './routes/auth-protected.route'
import AuthRejectedRoute from './routes/auth-rejected.route'
import NotFoundPage from './pages/errors/not-found.page'
import ProfilePage from './pages/ngo/ProfilePage'
import SingleDonationRequest from './pages/donor/single-donation-request.page'
import AllDonationsPage from './pages/donor/all-donations.page'
import SingleDonationPage from './pages/donor/single-donation.page'
import AllDonationRequestsPage from './pages/donor/all-requests.page'

function App() {

  useAuth();

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingNavigation />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path='auth' element={<AuthRejectedRoute><Outlet/></AuthRejectedRoute> }>
          <Route index path='signin' element={<SignInPage />} />
          <Route path='signup' element={<SignUpPage />} />
        </Route>
        <Route path='me' element={<AuthProtectedRoute><AccountNavigation /></AuthProtectedRoute>}>
          <Route path='request-donation' element={<RequestDonation />} />
          <Route path='dashboard' element={<DonorDashboard />} />
          <Route path='donate' element={<Donate mode="CREATE" />} />
          <Route path='profile' element={<ProfilePage/>} />
          <Route path='edit-donation/:donationId' element={<Donate mode="EDIT" />} />
          <Route path='browse' element={<DonationRequests user_type="USER" />} />
          <Route path='my-requests' element={<DonationRequests user_type="NGO" />} />
          <Route path='single-request/:requestId' element={<SingleDonationRequest />} />
          <Route path='single-donation/:donationId' element={<SingleDonationPage />} />
          <Route path='all-donations' element={<AllDonationsPage />} />
          <Route path='all-requests' element={<AllDonationRequestsPage />} />
        </Route>
        <Route path='*' element={<NotFoundPage/>} />
      </Routes>
      <Toast/>
    </>
  )
}

export default App
