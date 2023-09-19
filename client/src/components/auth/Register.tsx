import axios from "axios"
import React, { ChangeEvent, useState } from 'react';
import FormatStatus from "../utils/FormatStatus";
import ErrorMessage from "../ErrorMessage/ErrorMessage";


export default function Register() {
    const [formValues, setFormValues] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'DEVELOPER' });
    const [error, setError] = useState({ firstName: '', lastName: '', email: '', password: '' })
    const [errorBannerMessage, setErrorBannerMessage] = useState('')
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const roleOptions = {
        DEVELOPER: 'DEVELOPER',
        QA: 'QA',
        MANAGER: 'MANAGER',
    }

    const handleSubmit = async (event) => {
        try {
            event.preventDefault()
            const emptyField = Object.values(formValues).findIndex((el) => el === '')
            if (emptyField !== -1) {
                setErrorBannerMessage("All fields are required.")
                setShowErrorMessage(true)
                setTimeout(() => setShowErrorMessage(false), 3000)
            }
            else {
                const res = await axios.post("/api/register", formValues)
                if (res.status === 201) {
                    window.location.href = '/dashboard'
                }
            }
        } catch (error: any) {
            console.log(error)
            console.log(error.response.status)
            if (error.response.status === 409) {
                setErrorBannerMessage("User with this email already exists.")
            }
            else if (error.response.status === 400) {
                setErrorBannerMessage("Invalid data.")
            }

            setShowErrorMessage(true)
            setTimeout(() => setShowErrorMessage(false), 3000)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setFormValues(prevValues => ({ ...prevValues, ['role']: e.target.value }));
    };

    function handleInputUnfocus(event: ChangeEvent<HTMLInputElement>) {
        const { name } = event.target;
        if (formValues[name] === '') {
            setError(prevValues => ({ ...prevValues, [name]: `Enter ${name}` }))
        }

        // else if (formValues.email) {

        // }
    }

    function togglePasswordVisibility() {
        setIsPasswordVisible((prevState) => !prevState);
    }

    return (
        <main className="w-full pb-10 min-h-full flex flex-col items-center justify-center px-4">
            <div className="max-w-sm w-full text-gray-600 space-y-5">
                <div className="text-center">
                    {/* <img src="https://floatui.com/logo.svg" width={150} className="mx-auto" /> */}
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Create an account</h3>
                        <p className="">Already have an account? <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Log in</a></p>
                    </div>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 group"
                    noValidate
                >
                    {showErrorMessage ? (<div>
                        <ErrorMessage message={errorBannerMessage} onClose={() => setShowErrorMessage(false)} />
                    </div>) : ''}
                    <div>
                        <label className="font-medium">
                            First Name
                        </label>
                        <input
                            name="firstName"
                            value={formValues.firstName}
                            onChange={handleChange}
                            type="text"
                            required
                            placeholder='Enter first name'
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        // onBlur={handleInputUnfocus}
                        />
                        {/* {<p>{error.firstName}</p>} */}
                    </div>
                    <div>
                        <label className="font-medium">
                            Last Name
                        </label>
                        <input
                            name="lastName"
                            value={formValues.lastName}
                            onChange={handleChange}
                            type="text"
                            required
                            placeholder='Enter last name'
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                        // onBlur={handleInputUnfocus}
                        />
                        {/* {<p>{error.lastName}</p>} */}
                    </div>
                    <div>
                        <label className="font-medium">
                            Email
                        </label>
                        <input
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                            type="email"
                            required
                            autoComplete="username"
                            className="invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg peer"
                            // onBlur={handleInputUnfocus}
                            placeholder="Enter email"
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"

                        />
                        <span className="mt-1 hidden text-sm text-red-400 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                            Please enter a valid email address
                        </span>
                        {<p>{error.email}</p>}
                    </div>

                    <div className="relative ">
                        <label className="font-medium">
                            Password
                        </label>
                        {/* Eye */}
                        <button className="absolute inset-y-11 right-0 px-3" onClick={togglePasswordVisibility} type="button">
                            {isPasswordVisible ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            )}
                        </button>
                        <input
                            name="password"
                            value={formValues.password}
                            onChange={handleChange}
                            type={isPasswordVisible ? "text" : "password"}
                            required
                            autoComplete="new-password"
                            minLength={6}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                            placeholder="Enter password"
                        // onBlur={handleInputUnfocus}
                        />
                        <span className="mt-1 hidden text-sm text-red-400">
                            Password must be at least 6 characters.{' '}
                        </span>
                        {<p>{error.password}</p>}
                    </div>
                    <div>
                        <label className="font-medium">
                            Role
                        </label>
                        <select
                            value={formValues.role} onChange={handleSelectChange}
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg hover:outline-none hover:">
                            {[...Object.values(roleOptions)].map((option: string) => (
                                <option key={option} value={option}>{FormatStatus(option)}</option>
                            ))}
                        </select>
                    </div>


                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                    >
                        Register
                    </button>
                </form>
                <button className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100">
                    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_17_40)">
                            <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                            <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                            <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                            <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                        </g>
                        <defs>
                            <clipPath id="clip0_17_40">
                                <rect width="48" height="48" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    Continue with Google
                </button>
            </div>
        </main>
    )
}