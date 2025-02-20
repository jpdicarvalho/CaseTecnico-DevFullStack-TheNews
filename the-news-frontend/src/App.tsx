import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login/Login';
import Home from './Home/Home';

import './App.css'

function App() {

  return (
    <Router>
      <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />

      </Routes>
    </Router>
  )
}

export default App
