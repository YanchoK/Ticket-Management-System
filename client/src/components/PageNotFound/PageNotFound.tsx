export default function PageNotFound() {
    const handleBackBtn = () => {
        window.history.back();
    }

    return (
        <main className="min-h-full flex items-center justify-center">
            <div className="w-screen mx-auto px-4 min-h-full md:px-8">
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
            </div>
        </main>
    )
}