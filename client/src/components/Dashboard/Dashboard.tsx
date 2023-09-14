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

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1)

  const [filter,setFilter]=useState<string>(undefined)
  const [order,setOrder]=useState<"asc"|"desc">("asc")

  const emptyTicket: Ticket = {
    id: -1,
    shortDescription: '',
    description: '',
    state: TicketState.NEW,
    priority: TicketPriority.LOW,
    assignedToId: null
  };

  function getTickets() {
    fetch(`/api/tickets/?sortBy=${filter}&orderBy=${order}&page=${page}&limit=${5}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then(data => {
        setTickets([...tickets, ...data.tickets])
        let newPage = page;
        newPage++;
        setPage((newPage))
      }).catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (tickets.length === 0) {
      getTickets()
    }

    const div = document.querySelector(".table-container");
    if (div.scrollHeight === div.clientHeight && !loading) {
      getTickets()
    }

  }, [page])

  const infiniteScroll = (event) => {
    const div = event.target as HTMLDivElement
    // End of the document reached?
    if (div.scrollTop + div.clientHeight + 50 >= div.scrollHeight) {
      getTickets()
    }

    // console.log(div.scrollHeight)
    // console.log(div.clientHeight)
    // console.log(div.scrollTop)
  }

  useEffect(() => {
    if (props.openCreateTicketForm === true) {
      handleOpenFormToCreateTicket()
    }
  }, [props.openCreateTicketForm])

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

  function reloadTickets(sortBy?: string) {
    setTickets([])
    setPage(1)

    if (sortBy && sortBy===filter) {
      setOrder(order==="desc"?"asc":"desc")
    }
    else{
      setOrder("asc")
    }

    setFilter(sortBy)
    getTickets()
  }

  async function handleUpdateTicket(ticket: Ticket) {
    try {
      const { id, createdDate, updatedDate, assignedTo, ...data } = ticket

      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };

      const response = await fetch(`/api/tickets/${ticket.id}`, requestOptions)
      const responceData = await response.json()

      if (response.ok) {
        reloadTickets()
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
      const { id, createdDate, updatedDate, assignedTo, ...data } = ticket

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };

      const response = await fetch(`/api/tickets/`, requestOptions)
      const responceData = await response.json()

      if (response.ok) {
        handleCloseDetails()
        reloadTickets()
        console.log(`Ticket with id ${responceData["data"].id} created successfully`);
      } else {
        console.log(`Failed to created ticket with id ${responceData["data"].id}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

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
        <div className="flex-1 my-auto mx-auto max-w-full py-6 lg:px-4 overflow-hidden">
          <TicketsTable
            onScroll={infiniteScroll}
            getUser={getUser}
            onSort={reloadTickets}
            tickets={tickets}
            onEdit={handleOpenFormToUpdateTicket}
            handleTicketDelete={handleTicketDelete}
            onSelectedTicket={handleTicketSelection} />
        </div>
        <div className={classNames(displayDetails ? 'block' : 'hidden', 'mx-auto px-4 py-6 sm:px-6 lg:px-6 sm:border-l w-full md:max-w-md overflow-y-scroll')} >
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