import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import 'regenerator-runtime/runtime'
import ImageKit from 'imagekit'
import { ChangeEvent, useEffect, useState } from "react";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import CloseIcon from "../icons/CloseIcon";
import { User, UserRole } from "../../../../server/src/interfaces/user_interface";
import FormatStatus from "../utils/FormatStatus";
import axios from "axios";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SuccessMessage from "../SuccessMessage/SuccessMessage";

const publicKey = 'public_FM4rPUXRbrL+rmMEN7dch8Da28k=';
const urlEndpoint = 'https://ik.imagekit.io/cphn9i2ad/';
const authenticationEndpoint = '/api/imageAuth';

const imagekit = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/cphn9i2ad',
    publicKey: 'public_FM4rPUXRbrL+rmMEN7dch8Da28k=',
    privateKey: 'private_yq8HfqFxGkghrqa4Tzk63cJJCfY='
});

const defaultImage = `https://ik.imagekit.io/cphn9i2ad/default.jpg`

interface Props {
    user: User
    onProfileUpdate: (user: User) => void
}


export default function ProfilePage(props: Props) {
    const [file, setFile] = useState(null);
    const [user, setUser] = useState<User>();
    const [selectedImage, setSelectedImage] = useState<string>()
    const [passValues, setPassValues] = useState({ currPassword: '', newPassword: '', confirmPassword: '' })
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false)
    const [confirmPassErr, setConfirmPassErr] = useState<boolean>(false)

    const roleOptions = {
        DEVELOPER: 'DEVELOPER',
        QA: 'QA',
        MANAGER: 'MANAGER',
    }

    useEffect(() => {
        if (props.user) {
            setUser(props.user)
            setSelectedImage(props.user.profileImageName ? 'https://ik.imagekit.io/cphn9i2ad/' + props.user.profileImageName : defaultImage)
            // console.log(props.user)
        }
    }, [props.user])

    async function handleUpdateUser(user: User) {
        try {
            const { id, fullName, email, ...data } = user

            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            };

            const response = await fetch(`/api/users/${user.id}`, requestOptions)
            const responceData: any = await response.json()

            if (response.ok) {
                props.onProfileUpdate(responceData.data as User)
                console.log(`User with id ${responceData.data.id} updated successfully`);
                setShowSuccessMessage(true)
                setTimeout(() => setShowSuccessMessage(false), 3000)
            } else {
                console.log(`Failed to update user with id ${responceData.data.id}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setFormValues(prevValues => ({ ...prevValues, [name]: value }));
    // };

    const handleFileChange = (e) => {
        const currFile = e.target.files[0];

        if (currFile) {
            setFile(currFile);

            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target.result.toString())
            };
            reader.readAsDataURL(currFile);
        }
    };

    useEffect(() => {
        if (passValues.newPassword !== passValues.confirmPassword) {
            setConfirmPassErr(true)
        }
        else {
            setConfirmPassErr(false)
        }
    }, [passValues])

    const handlePassChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setUser(prevValues => ({ ...prevValues, ['role']: e.target.value as UserRole }));
    };


    const handleUpload = async () => {
        try {
            // eslint-disable-next-line prefer-const
            let currUser = user
            if (file && props.user.id) {
                try {
                    const res = await imagekit.upload({
                        file,
                        fileName: props.user.id + "_Profile_Picture",
                    });

                    console.log('Image uploaded successfully:', res);

                    currUser.profileImageName = res.name
                    // currUser = ({ ...user, profileImageName: res.name });
                    // await handleUpdateUser(currUser)
                    // setUser(currUser)
                } catch (error) {
                    console.error('Image upload failed:', error);
                }
            }
            if (passValues.newPassword) {
                const res = await axios.post("/api/login", { email: user.email, password: passValues.currPassword })
                if (res.status === 200 && !confirmPassErr) {
                    currUser.passwordHash = passValues.newPassword
                }
            }

            console.log(currUser)
            await handleUpdateUser(currUser)
            setUser(currUser)
            window.location.href = '/profile'

        } catch (error: any) {
            console.log(error)
            setShowErrorMessage(true)
            setTimeout(() => setShowErrorMessage(false), 3000)
        }
    };

    async function onClose() {
        const currUser = ({ ...user, profileImageName: "default.jpg" });
        setUser(currUser);
        setSelectedImage(`https://ik.imagekit.io/cphn9i2ad/default.jpg`)
        setFile(null)
    }

    return (
        <main className="min-h-full flex flex-col items-center justify-center px-4">

            {showErrorMessage ? (<div>
                <ErrorMessage message="Incorrect username or password." onClose={() => setShowErrorMessage(false)} />
            </div>) : ''}

            {/* {showSuccessMessage ? (<div>
                <SuccessMessage message="Profile updated successfully." onClose={() => setShowSuccessMessage(false)} />
            </div>) : ''} */}

            <div className="max-w-lg w-full text-gray-600 space-y-5 px-3 py-6">
                <h1 className="font-semibold text-xl text-center">Admin Admin</h1>

                {/* Update profile picture */}
                <div>
                    <label htmlFor="photo" className="block font-medium text-gray-900">
                        Change profile picture
                    </label>
                    <div className="mt-3 flex items-center gap-x-3 ">
                        <img
                            src={selectedImage ? selectedImage : 'loading'}
                            alt="Selected Profile"
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-400"
                        />
                        <label htmlFor="fileInput" className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300">
                            Choose picture</label>
                        <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        <button onClick={onClose}><CloseIcon /></button>
                    </div>
                </div>



                {/* Current Pass */}
                <div className="space-y-5">
                    <div>
                        <label className="font-medium ">Change Password</label>
                        <div className="space-y-3 mt-2">
                            <div className="relative">
                                <input
                                    name="currPassword"
                                    value={passValues.currPassword}
                                    onChange={handlePassChange}
                                    type={"password"}
                                    required
                                    autoComplete="new-password"
                                    minLength={6}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                                    placeholder="Enter Current Password"
                                // onBlur={handleInputUnfocus}
                                />
                                <span className="mt-1 hidden text-sm text-red-400">
                                    Password must be at least 6 characters.{' '}
                                </span>
                                {/* {<p>{error.password}</p>} */}
                            </div>
                            {/* New pass */}
                            <div className="relative ">
                                <input
                                    name="newPassword"
                                    value={passValues.newPassword}
                                    onChange={handlePassChange}
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    minLength={6}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                                    placeholder="Enter New password"
                                // onBlur={handleInputUnfocus}
                                />
                                <span className="mt-1 hidden text-sm text-red-400">
                                    Password must be at least 6 characters.{' '}
                                </span>
                                {/* {<p>{error.password}</p>} */}
                            </div>
                            {/* Confirm new pass */}
                            <div className="relative ">
                                <input
                                    name="confirmPassword"
                                    value={passValues.confirmPassword}
                                    onChange={handlePassChange}
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    minLength={6}
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg [&:not(:placeholder-shown):not(:focus):invalid~span]:block invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400"
                                    placeholder="Confirm New Password"
                                // onBlur={handleInputUnfocus}
                                />
                                {confirmPassErr ? <span className="mt-1 text-sm text-red-400">
                                    Passwords should match
                                </span> : ''}
                                {/* {<p>{error.password}</p>} */}
                            </div>
                        </div>
                    </div>

                    {/* Change user role */}
                    {user && user.role !== "ADMIN" ? 
                    <div>
                        <label className="font-medium">
                            Change Role
                        </label>
                        <select
                            placeholder={user ? user.role : ''} onChange={handleSelectChange}
                            className="w-full mt-3 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg hover:outline-none hover:">
                            {[...Object.values(roleOptions)].map((option: string) => (
                                user && user.role === option ?
                                    <option key={option} value={option} selected>
                                        {FormatStatus(option)}
                                    </option> :
                                    <option key={option} value={option} >
                                        {FormatStatus(option)}
                                    </option>
                            ))}
                        </select>
                    </div> : ''}
                </div>

                <button
                    type="button" onClick={handleUpload}
                    className=" px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                >
                    Update
                </button>
                {/* <button type="button" onClick={handleUpload}>Upload Image</button> */}
            </div>
        </main>
    )
}