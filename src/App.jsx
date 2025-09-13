import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Inicio from './interfaces/inicio'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />    
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </Router>
  )
}

export default App
