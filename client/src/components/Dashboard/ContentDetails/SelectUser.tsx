import React, { useEffect, useRef, useState } from "react";
import { User } from "../../../../../server/src/interfaces/user_interface";

interface Props {
    handleSelectUser: (user: User) => void;
    users: User[];
    selectedUser: number;
}

export default function SelectUser(props: Props) {
    const [selectedItem, setSelectedItem] = useState<User | null>(null);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<User[]>(props.users);
    const [searchFieldVal, setSearchFieldVal] = useState("");

    const listboxRef = useRef<HTMLUListElement | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchVal = e.target.value.toLowerCase();
        const menuEls = document.querySelectorAll('.menu-el-js');
        setSearchFieldVal(e.target.value);

        const alertEl = document.getElementById("li-alert");
        const handleAlert = () => {
            if (listboxRef.current && listboxRef.current.offsetHeight < 5) {
                alertEl?.classList.remove("hidden");
            } else {
                alertEl?.classList.add("hidden");
            }
        };

        handleAlert();
        setTimeout(handleAlert, 100);

        menuEls.forEach((el, idx) => {
            el.classList.remove("hidden");
            if (!menuItems[idx].fullName.toLowerCase().includes(searchVal)) {
                el.classList.add("hidden");
            }
        });
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".label-button")) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        setMenuItems(props.users);
        if (props.selectedUser && menuItems) {
            const user = menuItems.find((u) => u.id === props.selectedUser);
            setSelectedItem(user || null);
            setSearchFieldVal(user ? user.fullName : "");
        }
        else {
            setSelectedItem(null);
            setSearchFieldVal("");
        }
    }, [props.users]);

    const handleSelectChange = (user: User) => {
        props.handleSelectUser(user);
    };

    return (
        <div className="relative max-w-xs text-base">
            <div className="label-button flex items-center gap-1 px-2 border rounded-lg shadow-sm">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Type to search for a person"
                    className="w-full px-2 py-2 text-gray-500 bg-transparent rounded-md outline-none"
                    value={searchFieldVal}
                    onChange={handleSearch}
                    onFocus={() => setMenuOpen(true)}
                />
                {searchFieldVal ? (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchFieldVal("");
                            setSelectedItem({ id: null } as User);
                            handleSelectChange({ id: null } as User);
                            setMenuOpen(false);
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-gray-400"
                        >
                            <path
                                d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                            />
                        </svg>
                    </button>
                ) : (
                    <button type="button"
                        onClick={() => setMenuOpen(!isMenuOpen)}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-gray-400"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {isMenuOpen && (
                <div className="relative w-full">
                    <ul
                        ref={listboxRef}
                        className="absolute w-full mt-3 overflow-y-auto bg-white border rounded-md shadow-sm max-h-64 z-10"
                        role="listbox"
                    >
                        <li id="li-alert" className="hidden px-3 py-2 text-center text-gray-600">
                            No results available
                        </li>
                        {menuItems.map((el, idx) => (
                            <li
                                key={idx}
                                onClick={() => {
                                    setSelectedItem(el);
                                    setSearchFieldVal(el.fullName);
                                    handleSelectChange(el);
                                    setMenuOpen(false);
                                }}
                                role="option"
                                aria-selected={selectedItem?.id === el.id}
                                className={`${selectedItem?.id === el.id ? "text-indigo-600 bg-indigo-50" : ""
                                    } menu-el-js flex items-center justify-between gap-2 px-3 py-2 cursor-default duration-150 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50`} >

                                <img
                                    src={`https://ik.imagekit.io/cphn9i2ad/${el.profileImageName ? el.profileImageName : ("default.jpg")}`}
                                    alt="Selected Profile"
                                    className="h-8 w-8 rounded-full object-cover border border-gray-400" />

                                <div className="flex-1 text-left flex items-center gap-x-1">
                                    {el.fullName} <span className="text-sm">{el.email}</span>
                                </div>
                                {selectedItem?.id === el.id && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-indigo-600"
                                        viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd" />
                                    </svg>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}





// const menuItems = [
//     {
//         name: "Danya",
//         label: "@danya",
//         avatar: "https://randomuser.me/api/portraits/women/79.jpg"
//     }, {
//         name: "Osama",
//         label: "@osama",
//         avatar: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg"
//     }, {
//         name: "Loyan",
//         label: "@loyan",
//         avatar: "https://randomuser.me/api/portraits/men/86.jpg"
//     }, {
//         name: "Carllose",
//         label: "@carllose",
//         avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f"
//     }, {
//         name: "Micheal",
//         label: "@micheal",
//         avatar: "https://randomuser.me/api/portraits/men/46.jpg"
//     },
// ]