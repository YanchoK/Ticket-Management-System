
import React, { useEffect, useState } from 'react';
import { Navigate} from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);

  // use effect to fetch the token and update the state
  useEffect(() => {
    fetch("api/checkAuth")
      .then((res) => {
        if (res.status === 200) {
          // set auth status to true
          // setIsAuthenticated(true);
          setLoading(false);
        } else {
          // set auth status to false
          // setIsAuthenticated(false);
          setRedirect(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (loading) {
    return null; // You can show a loading spinner here if needed
  }

  if (redirect) {
    return <Navigate replace={true} to="/login" />;
  }

  return <>{children}</>;
}