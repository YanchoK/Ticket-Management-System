// import forms from "@tailwindcss/forms"
import { ChangeEvent, useEffect, useState } from "react"
import SelectUser from "./SelectUser"
import Select from "./Select"
import CloseIcon from "../icons/CloseIcon"
import { Ticket } from "../../../../server/src/interfaces/ticket_interface"
import { User } from "../../../../server/src/interfaces/user_interface"

interface Props {
    // ticket: Ticket,
    // detailsType: string
    closeDetails: () => void,
    onSave: (formValues) => void,
    onUpdate: (formValues) => void,
    ticket: Ticket,
    getUsers: () => Promise<User[]>;
}

export default function TicketForm(props: Props) {

    const priorityOptions = {
        CRITICAL: 'CRITICAL',
        HIGH: 'HIGH',
        MODERATE: 'MODERATE',
        LOW: 'LOW',
    }

    const stateOptions = {
        NEW: 'NEW',
        IN_PROGRESS: 'IN_PROGRESS',
        REVIEW: 'REVIEW',
        DONE: 'DONE',
    }

    const emptyTicket: Ticket = {
        id: -1,
        shortDescription: '',
        description: '',
        state: null,
        priority: null,
        assignedToId: null
    };

    const [formValues, setFormValues] = useState<Ticket>(emptyTicket);
    const [users, setUsers] = useState<User[] | null>(null);

    useEffect(() => {
        console.log("useEffect in ContentDetails");
        if (props.ticket) {
            setFormValues(props.ticket || emptyTicket);
            loadUsers();
        } else {
            setFormValues(null);
            setUsers(null);
        }
    }, [props.ticket]);

    async function loadUsers() {
        try {
            const users = await props.getUsers();
            setUsers(users);
        } catch (error) {
            console.error("Error loading user:", error);
        }
    }

    // useEffect(() => {
    //     console.log("useEffect in ContentDetails")
    //     setFormValues(props.ticket || emptyTicket);
    // }, [props.ticket]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormValues(prevValues => ({ ...prevValues, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (formValues.id !== -1) {
            await props.onUpdate(formValues);
        } else {
            await props.onSave(formValues);
        }
    }

    function handleSelectUser(user: User) {
        setFormValues(prevValues => ({ ...prevValues, ["assignedToId"]: user.id }));
        console.log(formValues)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <div className="flex flex-row justify-between">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Ticket</h2>
                        <button
                            type="button"
                            onClick={props.closeDetails} className="">
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Short descriptuion
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="text"
                                        name="shortDescription"
                                        id="shortDescription"
                                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        value={formValues.shortDescription}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={formValues.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Assigned to
                            </label>
                            <div className="mt-2">
                                <SelectUser selectedUser={formValues.assignedToId} handleSelectUser={handleSelectUser} users={users} />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                State
                            </label>
                            <div className="mt-2">
                                <Select selectType="state" options={stateOptions} value={formValues.state} handleChange={handleSelectChange} />
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Priority
                            </label>
                            <div className="mt-2">
                                <Select selectType="priority" options={priorityOptions} value={formValues.priority} handleChange={handleSelectChange} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-start gap-x-6">
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    {formValues.id < 0 ? "Submit" : "Update"}
                </button>
                <button type="button"
                onClick={props.closeDetails}
                 className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
            </div>
        </form>
    )
}