
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

function App() {

  useAuth();

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingNavigation />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path='auth' element={<Outlet/>}>
          <Route index path='signin' element={<SignInPage />} />
          <Route path='signup' element={<SignUpPage />} />
        </Route>
        <Route path='me' element={<AccountNavigation />}>
          <Route path='request-donation' element={<RequestDonation />} />
          <Route path='dashboard' element={<DonorDashboard />} />
          <Route path='donate' element={<Donate />} />
          <Route path='browse' element={<DonationRequests />} />
          {/* <Route path='profile' element={<ProfilePage />} /> */}
        </Route>
      </Routes>
      <Toast/>
    </>
  )
}

export default App
