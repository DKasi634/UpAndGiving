
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import { Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import DonorDashboard from './pages/Dashboard'
import AccountNavigation from './routes/account-navigation.route'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='me' element={<AccountNavigation />}>
          <Route path='dashboard' element={<DonorDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
