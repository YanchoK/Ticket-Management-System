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
import { User } from '../../server/src/interfaces/user_interface';
import ProfilePage from './components/ProfilePage/ProflePage';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [shouldOpenCreateTicketForm, setShouldOpenCreateTicketForm] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<User>(null)

  function createTicket() {
    setShouldOpenCreateTicketForm(true)
  }
  function closeDetails() {
    setShouldOpenCreateTicketForm(false)
  }

  function getAuthenticatedUser() {
    fetch(`/api/me`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then(data => {
        setAuthenticatedUser(data)
      })
  }

  useEffect(() => {
    isAuthenticated().then((authStatus) => {
      if (authStatus) {
        // User is authenticated
        console.log("Authenticating the user...")
        setAuthenticated(true);
        getAuthenticatedUser()
      } else {
        // User is not authenticated
        setAuthenticated(false);
      }
    })
  }, []);

  return (

    <Router>
      <div className="h-screen w-screen overflow-x-hidden flex flex-col min-h-full">
        <Navbar user={authenticatedUser} onCreateTicket={createTicket} isAuthenticated={authenticated} />
        <div className='flex-grow'>
          <Routes>
            <Route path="/" element={<Homepage />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<PrivateRoute><Dashboard onCloseDetails={closeDetails} openCreateTicketForm={shouldOpenCreateTicketForm} /></PrivateRoute>} />

            <Route path="/profile" element={<PrivateRoute><ProfilePage onProfileUpdate={(updatedUser)=>setAuthenticatedUser(updatedUser)}  user={authenticatedUser}/></PrivateRoute>} />
            
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>

  )
}