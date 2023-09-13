

// const tickets = [
//     {
//         name: 'Arthur Melo',
//         username: '@authurmelo',
//         img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
//         status: 'Active',
//         role: 'Design Director',
//         email: 'authurmelo@example.com',
//     },
// ]

/*
import React, { useState, useEffect } from "react";

function Posts() {
  // Define the state variables for data, loading and error
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Use the fetch() function to send a GET request to the API endpoint
    fetch("https://jsonplaceholder.typicode.com/posts")
      // Convert the response to JSON format
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      // Update the data state with the fetched data
      .then((data) => {
        setData(data);
      })
      // Handle any error that may occur
      .catch((error) => {
        setError(error);
      })
      // Set the loading state to false when the promise is resolved
      .finally(() => {
        setLoading(false);
      });
  }, []); // Provide an empty dependencies array to run only once

  // Return a JSX element to render the component
  return (
    <div className="posts">
      {loading && <p>Loading...</p>}
      {error && <p>Error!</p>}
      {data && (
        <ul>
          {data.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Posts;


*/

import { useState, useEffect } from "react";
import SortIcon from "../../icons/SortIcon"
import DeleteIcon from "../../icons/DeleteIcon"
import EditIcon from "../../icons/EditIcon"
import Status from "./Status"
import { Ticket } from "../../../../../server/src/interfaces/ticket_interface"
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
// import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
    tickets: Ticket[]
    handleTicketDelete: (id: number) => any
    onSelectedTicket: (ticket: Ticket) => void
    onEdit: (ticket: Ticket) => void,
}



export default function TicketsTable(props: Props) {
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)
    // const [data, setData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // const [page, setPage] = useState(1);
    // const [items, setItems] = useState([]);
    // const [hasMore, setHasMore] = useState(true);
    // Use the useEffect hook to fetch data when the component mounts and when the page changes

    // useEffect(() => {
    //     // Use the fetch() function to send a GET request to the API endpoint
    //     fetch(`/api/tickets/`)
    //         // Convert the response to JSON format
    //         .then((response) => {
    //             if (response.ok) {
    //                 return response.json();
    //             } else {
    //                 throw response;
    //             }
    //         })
    //         // Update the data state with the fetched data
    //         .then((newData) => {
    //             setData(newData)
    //             // setData((prevData) => {

    //             //     if (prevData) {
    //             //         console.log("if "+page)
    //             //         return {
    //             //             count: newData.count,
    //             //             tickets: [...prevData.tickets, ...newData.tickets],
    //             //         };
    //             //     } 
    //             //     else {
    //             //         console.log("else "+page)
    //             //         return newData;
    //             //     }
    //             // });
    //         })
    //         // Handle any error that may occur
    //         .catch((error) => {
    //             setError(error);
    //         })
    //         // Set the loading state to false when the promise is resolved
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // }, [])//, [page]); // Provide the page state as a dependency


    // Add a scroll event listener to the table to detect when the user scrolls to the bottom
    // useEffect(() => {
    //     const table = document.querySelector(".table-container");
    //     console.log("useEffScrl "+page)

    //     const handleScroll = () => {
    //         if (table.scrollTop + table.clientHeight >= table.scrollHeight) {
    //             console.log("iff useEffScrl "+page)
    //             setPage((prevPage) => prevPage + 1);
    //         }
    //     };
    //     table.addEventListener("scroll", handleScroll);
    //     return () => {
    //         table.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);

    // async function handleDelete(ticketId) {
    //     try {
    //         const response = await fetch(`/api/tickets/${ticketId}`, {
    //             method: 'DELETE',
    //         });
    //         if (response.ok) {
    //             console.log(`Ticket with id ${ticketId} deleted successfully`);
    //         } else {
    //             console.log(`Failed to delete ticket with id ${ticketId}`);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // useEffect(()=>{
    //     console.log('useEffect props.tickets')
    // },[props.tickets])

   async function onDelete(ticketId:number){
           const res= await props.handleTicketDelete(ticketId)
         if (res==="error") {
            setShowErrorMessage(true)
            setTimeout(()=>setShowErrorMessage(false), 3000)
        }
    }

    return (
        <section className="container px-4 mx-auto">
            <div className="flex items-center gap-x-3">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">Tickets</h2>

                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{`${props.tickets && props.tickets.length} tickets`}</span>

                {showErrorMessage ? (
                <div className="ml-auto">
                        <ErrorMessage message="Only admin can delete tickets" onClose={() => setShowErrorMessage(false)} />
                    </div>) : ''}
            </div>

            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">

                        <div className="overflow-hidden h-5elementsT overflow-y-scroll border border-gray-200 dark:border-gray-700 md:rounded-lg table-container">

                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-center  text-gray-500 dark:text-gray-400">ID</th>

                                        <th scope="col" className="px-5 py-3.5 text-sm font-normal text-left  text-gray-500 dark:text-gray-400">
                                            <button className="flex items-center gap-x-2">
                                                <span>Tickets</span>

                                                <SortIcon />
                                            </button>
                                        </th>

                                        <th scope="col" className="px-2 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400">Priority</th>

                                        <th scope="col" className="px-2 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400">Status</th>

                                        {/* <th scope="col" className="px-2 py-3.5 text-sm font-normal text-center text-gray-500 dark:text-gray-400">Assigned to</th> */}

                                        <th scope="col" className="relative py-3.5 px-4">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {props.tickets && props.tickets.map((ticket: Ticket) => (
                                        <tr key={ticket.id} >
                                            {/* Id */}
                                            <td onClick={() => props.onSelectedTicket(ticket)} className="px-4 py-4 text-lg font-bold text-center text-black-200 dark:text-gray-300 whitespace-nowrap">{ticket.id}</td>
                                            {/* Description */}
                                            <td onClick={() => props.onSelectedTicket(ticket)} className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap max-w-lg truncate">{ticket.shortDescription}</td>
                                            {/* Priority */}
                                            <td onClick={() => props.onSelectedTicket(ticket)} className="px-2 py-4 text-sm font-medium text-center  text-gray-700 whitespace-nowrap">
                                                <Status statusType='priority' statusValue={ticket.priority} />
                                            </td>
                                            {/* State */}
                                            <td onClick={() => props.onSelectedTicket(ticket)} className="px-2 py-4 text-sm font-medium text-center  text-gray-700 whitespace-nowrap">
                                                <Status statusType='state' statusValue={ticket.state} />
                                            </td>

                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                {/* Delete btn */}
                                                <div className="flex items-center gap-x-6">
                                                    <button onClick={() => onDelete(ticket.id)} className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                                                        <DeleteIcon />
                                                    </button>
                                                    {/* Edit btn */}
                                                    <button onClick={()=>props.onEdit(ticket)} className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                                                        <EditIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
