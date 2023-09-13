import { Ticket } from "../../../../../server/src/interfaces/ticket_interface";
import { useState, useEffect } from "react";
import CloseIcon from "../../icons/CloseIcon";
import { User } from "../../../../../server/src/interfaces/user_interface";
import FormatStatus from "../../utils/FormatStatus";

interface Props {
  ticket: Ticket;
  closeDetails: () => void;
  onEdit: (ticket: Ticket) => void;
  getUser: (id: number) => Promise<User>;
  detailsType: string;
}

export default function Details(props: Props) {
  const [formValues, setFormValues] = useState<Ticket | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // console.log("useEffect in ContentDetails");
    if (props.ticket) {
      setFormValues(props.ticket);
      loadUser(props.ticket.assignedToId);
    } else {
      setFormValues(null);
      setUser(null);
    }
  }, [props.ticket]);

  async function loadUser(userId: number) {
    try {
      const user = await props.getUser(userId);
      setUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }

  return (
    <div className="px-1 max-w-xl mx-auto">
      {formValues && (
        <>
          <div className="px-4 sm:px-0 flex flex-row justify-between">
            <h3 className="text-base font-semibold leading-7 text-gray-900">{`Ticket ${formValues.id}`}</h3>
            <button onClick={props.closeDetails} className="">
              <CloseIcon />
            </button>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Short description</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{formValues.shortDescription}</dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-2 sm:gap-0 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Description</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 max-h-60 overflow-y-scroll p-5">{formValues.description}</dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">State</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{FormatStatus(formValues.state)}</dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Priority</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{FormatStatus(formValues.priority)}</dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Assigned to</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {user&&(user.fullName ? user.fullName : "Not assigned")}
                </dd>
              </div>
            </dl>
          </div>
          {user && (
            // <div className="mt-14 flex flex-row justify-around">
            //   <button
            //     onClick={() => props.onEdit(formValues)}
            //     className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
            //   >
            //     Edit
            //   </button>
            //   <button
            //     className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
            //   >
            //     Close
            //   </button>
            // </div>
            <div className="mt-6 flex items-center justify-start gap-x-6">
              <button
                onClick={() => props.onEdit(formValues)}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Edit
              </button>
              <button type="button"
                onClick={props.closeDetails}
                className="text-sm font-semibold leading-6 text-gray-900">
                Cancel
              </button>
            </div>
          )}
        </>
      )}
      {!formValues && <p>Loading...</p>}
    </div>
  );
}
