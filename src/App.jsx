import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import interfaces from './interfaces/inicio'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/inicio" element={<inicio />} />
      </Routes>
    </Router>
  )
}

export default App
