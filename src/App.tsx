import { useState } from 'react';
import { Outlet, Route } from 'react-router-dom';
import './App.css';
import { Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/auth/signin.page';
import DonorDashboard from './pages/DashboardPage';
import AccountNavigation from './routes/account-navigation.route';
import Donate from './pages/donor/post-donation.page';
import DonationRequests from './pages/donor/DonationRequestsPage';
import LandingNavigation from './routes/landing-navigation.route';
import RequestDonation from './pages/ngo/RequestDonationPage';
import SignUpPage from './pages/auth/signup.page';
import useAuth from './hooks/use-auth.hook';
import Toast from './components/generic/toast/toast.component';
import AuthProtectedRoute from './routes/auth-protected.route';
import AuthRejectedRoute from './routes/auth-rejected.route';
import NotFoundPage from './pages/errors/not-found.page';
import ProfilePage from './pages/ngo/ProfilePage';
import SingleDonationRequest from './pages/donor/single-donation-request.page';
import AllDonationsPage from './pages/donor/all-donations.page';
import SingleDonationPage from './pages/donor/single-donation.page';
import AllDonationRequestsPage from './pages/donor/all-requests.page';
import AuthCallbackPage from './pages/auth/auth-callback.page';
import PostDirectDonationPage from './pages/donor/post-direct-donation.page';
import SingleDirectDonationPage from './pages/donor/single-direct-donation.page';
import ChatbotComponent from './pages/chat-bot.page';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from './store/auth/auth.selector';
import { setErrorToast } from './store/toast/toast.actions';

function App() {
  useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser)

  const toggleChat = () => {
    if(!isChatOpen && !currentUser.user){
      dispatch(setErrorToast("You need to login to proceed ")); return
    }
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingNavigation />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="auth" element={<AuthRejectedRoute><Outlet /></AuthRejectedRoute>}>
          <Route index path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="callback" element={<AuthCallbackPage />} />
        </Route>
        <Route path="me" element={<AuthProtectedRoute><AccountNavigation /></AuthProtectedRoute>}>
          <Route index element={<DonorDashboard />} />
          <Route path="request-donation" element={<RequestDonation mode="CREATE" />} />
          <Route path="edit-request-donation/:requestId" element={<RequestDonation mode="EDIT" />} />
          <Route path="dashboard" element={<DonorDashboard />} />
          <Route path="donate" element={<Donate mode="CREATE" />} />
          <Route path="direct-donation" element={<PostDirectDonationPage />} />
          <Route path="direct-donations/:directDonationId" element={<SingleDirectDonationPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="edit-donation/:donationId" element={<Donate mode="EDIT" />} />
          <Route path="browse" element={<DonationRequests user_type="USER" />} />
          <Route path="my-requests" element={<DonationRequests user_type="NGO" />} />
          <Route path="single-request/:requestId" element={<SingleDonationRequest />} />
          <Route path="single-donation/:donationId" element={<SingleDonationPage />} />
          <Route path="all-donations" element={<AllDonationsPage />} />
          <Route path="all-requests" element={<AllDonationRequestsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-500 focus:outline-none cursor-pointer"
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        {isChatOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
      {isChatOpen && <ChatbotComponent />}
      <Toast />
    </>
  );
}

export default App;