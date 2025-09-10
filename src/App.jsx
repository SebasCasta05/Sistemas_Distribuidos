import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HeaderComponents from './components/HeaderComponents'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import UserProfile from './components/UserProfile'
import FooterComponents from './components/FooterComponents'
import Muro from './components/Muro'

function App() {
  return (
    <Router>
      <HeaderComponents />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<UserProfile />} />
         <Route path="/muro" element={<Muro />} />   {/* 👈 Nueva ruta */}
      </Routes>
      <FooterComponents />
    </Router>
  )
}

export default App
