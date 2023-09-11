import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from "./components/Dashboard/Dashboard";
import Homepage from "./components/Homepage/Homepage";
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/utils/PrivateRoute';
import Login from './components/auth/Login';
import Footer from './components/Footer/Footer';
import Register from './components/auth/Register';

export default function App() {

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />

      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </Router>

      {/* <Dashboard /> */}
      <Footer />
    </div>
  )
}


{/* <PrivateRoute path="/dashboard" element={<Dashboard />} /> */ }
{/* <Route path='/' element={isAuthenticated ? <Navigate to='/dashboard' replace={true} />
:
<Homepage />} />

<Route path='/dashboard' element={isAuthenticated ? <Dashboard />
:
<Navigate to='/' replace={true} />} /> */}