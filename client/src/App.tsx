// import Details from './components/Details'
import Details from './components/Details';
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import TicketsTable from './components/TicketsTable'

function classNames<T extends string | boolean>(...classes: T[]) {
  return classes.filter(Boolean).join(' ')
}

const displayDetails = true;

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      {/* <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header> */}
      <main className='flex-1 flex'>
        <div className="flex-1 mx-auto max-w-7xl py-6 lg:px-2 overflow-hidden">
          <TicketsTable />
        </div>
        <div className={classNames(displayDetails ? 'block' : 'hidden', 'mx-auto px-4 py-6 sm:px-6 lg:px-8 sm:border-l w-full md:max-w-md')} >
          <Details />
        </div>
      </main>
      <Footer />
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