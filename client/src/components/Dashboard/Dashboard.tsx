// import Details from './components/Details'
import Details from './ContentDetails/TicketDetails';
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import TicketsTable from './MainContent/TicketsTable'
import TicketForm from './ContentDetails/TicketForm'
import { Ticket, TicketPriority, TicketState } from "../../../../server/src/interfaces/ticket_interface"
import { useState, useEffect } from "react";
import { User } from '../../../../server/src/interfaces/user_interface';

function classNames<T extends string | boolean>(...classes: T[]) {
  return classes.filter(Boolean).join(' ')
}

interface Props {
  openCreateTicketForm: boolean
  onCloseDetails: () => void
}

export default function Dashboard(props: Props) {
  const [selectedTicket, setTicket] = useState<Ticket>();
  const [displayDetails, setDisplayDetails] = useState(false)
  const [viewOnly, setViewOnly] = useState(true)

  const [tickets, setTickets] = useState<Ticket[]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const emptyTicket: Ticket = {
    id: -1,
    shortDescription: '',
    description: '',
    state: TicketState.NEW,
    priority: TicketPriority.LOW,
    assignedToId: null
  };

  function getTickets() {
    fetch(`/api/tickets/`)
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
        setTickets(data.tickets)
      })
      // Handle any error that may occur
      .catch((error) => {
        setError(error);
      })
      // Set the loading state to false when the promise is resolved
      .finally(() => {
        setLoading(false);
      });
  }

  // const [page, setPage] = useState(1);
  // const [items, setItems] = useState([]);
  // const [hasMore, setHasMore] = useState(true);
  // Use the useEffect hook to fetch data when the component mounts and when the page changes
  useEffect(() => {
    // Use the fetch() function to send a GET request to the API endpoint
    fetch(`/api/tickets/`)
      // Convert the response to JSON format
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      // Update the data state with the fetched data
      .then((newData) => {
        setTickets(newData.tickets)
        // setData((prevData) => {

        //     if (prevData) {
        //         console.log("if "+page)
        //         return {
        //             count: newData.count,
        //             tickets: [...prevData.tickets, ...newData.tickets],
        //         };
        //     } 
        //     else {
        //         console.log("else "+page)
        //         return newData;
        //     }
        // });
      })
      // Handle any error that may occur
      .catch((error) => {
        setError(error);
      })
      // Set the loading state to false when the promise is resolved
      .finally(() => {
        setLoading(false);
      });
  }, [])//, [page]); // Provide the page state as a dependency

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

  useEffect(() => {
    if (props.openCreateTicketForm===true) {
      handleOpenFormToCreateTicket()
    }
  }, [props.openCreateTicketForm])

  async function handleTicketDelete(ticketId: number) {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);
        setTickets(updatedTickets)
        console.log(`Ticket with id ${ticketId} deleted successfully`);
        return "success"
      } else {
        console.log(`Failed to delete ticket with id ${ticketId}`);
        return "error"
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleTicketSelection(ticket: Ticket) {
    setTicket(ticket)
    setViewOnly(true)
    setDisplayDetails(true)
  }

  function handleOpenFormToCreateTicket() {
    setTicket(emptyTicket)
    setViewOnly(false)
    setDisplayDetails(true)
  }

  function handleOpenFormToUpdateTicket(ticket: Ticket) {
    setTicket(ticket)
    setViewOnly(false)
    setDisplayDetails(true)
  }

  function handleCloseDetails() {
    props.onCloseDetails()
    setDisplayDetails(false)
  }

  async function handleUpdateTicket(ticket: Ticket) {
    try {
      const { id, createdDate, updatedDate, ...data } = ticket

      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };

      const response = await fetch(`/api/tickets/${ticket.id}`, requestOptions)
      const responceData = await response.json()

      if (response.ok) {
        getTickets()
        handleCloseDetails()
        console.log(`Ticket with id ${responceData["data"].id} updated successfully`);
      } else {
        console.log(`Failed to update ticket with id ${responceData["data"].id}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateTicket(ticket: Ticket) {
    try {
      const { id, createdDate, updatedDate, ...data } = ticket

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };

      const response = await fetch(`/api/tickets/`, requestOptions)
      const responceData = await response.json()

      if (response.ok) {
        handleCloseDetails()
        getTickets()
        console.log(`Ticket with id ${responceData["data"].id} created successfully`);
      } else {
        console.log(`Failed to created ticket with id ${responceData["data"].id}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getUser(id: number) {
    try {
      const response = await fetch(`/api/users/${id}`);
      const user = (await response.json()) as User;
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async function getAllUsers() {
    try {
      const response = await fetch(`/api/users/`);
      const users = (await response.json()).users as User[];
      return users;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      {loading && <div>A moment please...</div>}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}

      {/* <Navbar onCreateTicket={handleOpenFormToCreateTicket} /> */}

      {/* min-h-screen */}
      <main className='flex-1 flex overflow-hidden'>
        <div className="flex-1 mx-auto max-w-7xl py-6 lg:px-2 overflow-hidden">
          <TicketsTable
            tickets={tickets}
            onEdit={handleOpenFormToUpdateTicket}
            handleTicketDelete={handleTicketDelete}
            onSelectedTicket={handleTicketSelection} />
        </div>
        <div className={classNames(displayDetails ? 'block' : 'hidden', 'mx-auto px-4 py-6 sm:px-6 lg:px-6 sm:border-l w-full md:max-w-lg overflow-y-scroll')} >
          {viewOnly ?
            <Details detailsType='list'
              ticket={selectedTicket}
              onEdit={handleOpenFormToUpdateTicket}
              closeDetails={handleCloseDetails}
              getUser={getUser} />
            :
            <TicketForm
              ticket={selectedTicket}
              onSave={handleCreateTicket}
              onUpdate={handleUpdateTicket}
              closeDetails={handleCloseDetails}
              getUsers={getAllUsers} />
          }
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}
/*mx-auto px-4 py-6 sm:px-6 lg:px-8 sm:border-l w-full lg:w-4/12

 <div className="flex-1 w-screen flex">
        <div className="bg-white flex-1">
          <div className=''>
            <TicketsTable />
          </div>
        </div>
        <div className="bg-blue-500 w-1/3">
          </div>
          </div>



*/