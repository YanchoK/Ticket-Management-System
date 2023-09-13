import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from "./components/Dashboard/Dashboard";
import Homepage from "./components/Homepage/Homepage";
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/utils/PrivateRoute';
import Login from './components/Auth/Login';
import Footer from './components/Footer/Footer';
import Register from './components/Auth/Register';
import isAuthenticated from './components/utils/isAuthenticated';
import { useEffect, useState } from 'react';
import PageNotFound from './components/PageNotFound/PageNotFound';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [shouldOpenCreateTicketForm, setShouldOpenCreateTicketForm] = useState(false);

  function createTicket() {
    setShouldOpenCreateTicketForm(true)
  }
  function closeDetails() {
    setShouldOpenCreateTicketForm(false)
  }

  useEffect(() => {
    isAuthenticated().then((authStatus) => {
      if (authStatus) {
        // User is authenticated
        setAuthenticated(true);
      } else {
        // User is not authenticated
        setAuthenticated(false);
      }
    })
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col">

      <Router>
        <Navbar onCreateTicket={createTicket} isAuthenticated={authenticated} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard onCloseDetails={closeDetails} openCreateTicketForm={shouldOpenCreateTicketForm} /></PrivateRoute>} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
        <Footer />
      </Router>

      {/* <Dashboard /> */}
    </div>
  )
}