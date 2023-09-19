
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import isAuthenticated from './isAuthenticated';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);

  // use effect to fetch the token and update the state
  useEffect(() => {
    isAuthenticated().then((authStatus) => {
      if (!authStatus) {
        setRedirect(true);
      }
      setLoading(false);
    });

    // fetch("api/checkAuth")
    //   .then((res) => {
    //     if (res.status !== 200) {
    //       // set auth status to true
    //       // setIsAuthenticated(true);
    //       setRedirect(true);
    //     }
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }, []);

  if (loading) {
    return null; // You can show a loading spinner here if needed
  }

  if (redirect) {
    return <Navigate replace={true} to="/login" />;
  }

  return <>{children}</>;
}