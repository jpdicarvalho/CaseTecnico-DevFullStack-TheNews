import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login/Login';
import Home from './Home/Home';
import Dashboard from './Dashboard/Dashboard';

import './App.css'

function App() {

  return (
    <Router>
      <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
