import { useState, useEffect } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {

  // const [data, setData] = useState<{ message: string } | null>(null);

  // useEffect(() => {
  //   fetch(`/api`)
  //     .then((response) => response.json())
  //     .then((responseData) => setData(responseData))
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // return (
  //   <div>
  //     <h1>Data from Server</h1>
  //     {data ? <p>{data.message}</p> : <p>Loading...</p>}
  //   </div>
  // );

  //////////////////// Automatically update the info /////////////////////////////////////////////

  const [data, setData] = useState<{ message: string } | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api');
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch initial data
    // const interval = setInterval(fetchData, 2000); // Fetch every 2 seconds

    // return () => {
    //   clearInterval(interval); // Clean up the interval on unmount
    // };
  }, []);

  return (
    <div>
      <h1>Data from Server</h1>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}
    </div>
  );
}



export default App
