import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import 'regenerator-runtime/runtime'
import ImageKit from 'imagekit'
import { useState } from "react";

const publicKey = 'public_FM4rPUXRbrL+rmMEN7dch8Da28k=';
const urlEndpoint = 'https://ik.imagekit.io/cphn9i2ad';
const authenticationEndpoint = '/api/imageAuth';

const imagekit = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/cphn9i2ad',
    publicKey: 'public_FM4rPUXRbrL+rmMEN7dch8Da28k=',
    privateKey: 'private_yq8HfqFxGkghrqa4Tzk63cJJCfY='
});

export default function PageNotFound() {
    const handleBackBtn = () => {
        window.history.back();
    }


    const uploadCallback = (response) => {
        console.log('Image uploaded successfully:', response);
    };

    const errorCallback = (error) => {
        console.error('Image upload failed:', error);
    };

    // <IKContext
    //     publicKey="public_FM4rPUXRbrL+rmMEN7dch8Da28k="
    //     urlEndpoint="https://ik.imagekit.io/cphn9i2ad"
    //    authenticator={}
    //     transformationPosition="path">

    //     {/* <IKImage path="/default-image.jpg" /> */}

    //     <IKUpload fileName="my-upload" />
    //     <button type="submit">Submit</button>
    // </IKContext>

    async function onAuthenticate() {
        try {
            const response = await fetch(authenticationEndpoint);

            if (response.ok) {
                const data = await response.json();

                // Ensure that the authentication response contains a valid 'signature' property
                if (data.signature) {
                    return data // Return the 'signature' property for authentication
                } else {
                    throw new Error("Authentication response is missing 'signature' property.");
                }
            } else {
                throw new Error('Authentication request failed.');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            throw error; // Rethrow the error to handle it in the IKUpload component
        }
    }



    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (file) {
            try {
                const response = await imagekit.upload({
                    file,
                    fileName: 'example.jpg', // Set your desired file name
                });
                setImageUrl(`${urlEndpoint}/tr:w-100,h-100/${response.name}`)
                console.log('Image uploaded successfully:', response);
            } catch (error) {
                console.error('Image upload failed:', error);
            }
        }
    };

    return (
        <main className="min-h-full flex items-center justify-center">


            {/* <IKUpload
                publicKey={publicKey}
                urlEndpoint={urlEndpoint}
                authenticator={onAuthenticate}
                onError={errorCallback}
                onSuccess={uploadCallback}
            /> */}

            <img src={imageUrl} alt="Uploaded Image" />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Image</button>



            {/* <div className="w-screen mx-auto px-4 min-h-full md:px-8">
                <div className="max-w-lg mx-auto space-y-3 text-center">
                    <h3 className="text-indigo-600 font-semibold">
                        404 Error
                    </h3>
                    <p className="text-gray-800 text-4xl font-semibold sm:text-5xl">
                        Page not found
                    </p>
                    <p className="text-gray-600">
                        Sorry, the page you are looking for could not be found or has been removed.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <a type="button" onClick={handleBackBtn} className="block py-2 px-4 text-white font-medium bg-indigo-600 duration-150 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg">
                            Go back
                        </a>
                        <a href="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 font-medium duration-150 active:bg-gray-100 border rounded-lg">
                            Take me home
                        </a>
                    </div>
                </div>
            </div> */}
        </main>
    )
}