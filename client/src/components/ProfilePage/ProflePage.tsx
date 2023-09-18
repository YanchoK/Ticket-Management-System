import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import 'regenerator-runtime/runtime'
import ImageKit from 'imagekit'
import { ChangeEvent, useEffect, useState } from "react";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";
import CloseIcon from "../icons/CloseIcon";
import { User } from "../../../../server/src/interfaces/user_interface";

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

    useEffect(() => {
        if (props.user) {
            setUser(props.user)
            setSelectedImage(props.user && props.user.profileImageName ? 'https://ik.imagekit.io/cphn9i2ad/' + props.user.profileImageName : null)
            // console.log(props.user)
        }
    }, [props.user])

    async function handleUpdateUser(user: User) {
        try {
            const { id, fullName, email, passwordHash, ...data } = user

            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            };

            const response = await fetch(`/api/users/${user.id}`, requestOptions)
            const responceData:any = await response.json()

            if (response.ok) {
                props.onProfileUpdate(responceData.data as User)
                console.log(`User with id ${responceData.data.id} updated successfully`);
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

    const handleUpload = async () => {
        if (file && props.user.id) {
            try {
                const res = await imagekit.upload({
                    file,
                    fileName: props.user.id + "_Profile_Picture",
                });
                const currUser = ({ ...user, profileImageName: res.name });
                await handleUpdateUser(currUser)
                setUser(currUser)
                console.log('Image uploaded successfully:', res);
            } catch (error) {
                console.error('Image upload failed:', error);
            }
        }
        else{
            console.log(user)
            await handleUpdateUser(user)
        }
    };

   async function onClose() {
        const currUser = ({ ...user, profileImageName:"default.jpg" });
        setUser(currUser);
        setSelectedImage(`https://ik.imagekit.io/cphn9i2ad/default.jpg`)
        setFile(null)
    }

    return (
        <main className="min-h-full flex items-center justify-center">


            {/* Update profile picture */}
            <div className="">
                <label htmlFor="photo" className="block text-sm font-medium leading-6 ml-3 text-gray-900">
                    Change profile picture
                </label>
                <div className="mt-2 flex items-center gap-x-3">

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

                <button type="button" onClick={handleUpload}>Upload Image</button>
            </div>



        </main>
    )
}