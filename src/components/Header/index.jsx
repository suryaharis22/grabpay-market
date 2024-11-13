import { logout } from "@/utils/logout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// components/Header.js
const Header = ({ role }) => {
    const router = useRouter();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [menuBarOpen, setMenuBarOpen] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const profileData = localStorage.getItem('profile');
        if (profileData) {
            setProfile(JSON.parse(profileData));
        }
    }, []);

    const handleLogout = () => {
        logout(router); // Pass router to the logout function
    };

    return (
        <nav className="bg-white border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <h1>Welcome, {role === 'admin' ? 'Admin' : profile?.name} </h1>
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        type="button"
                        className="flex justify-center items-center text-sm rounded-full md:me-0 "
                        id="user-menu-button"
                        aria-expanded="false"
                        data-dropdown-toggle="user-dropdown"
                        data-dropdown-placement="bottom"
                    >
                        <img
                            className="w-8 h-8 rounded-full"
                            src={profile?.avatar}
                            alt="user photo"
                        />
                        <div className="flex flex-col items-start ml-1">
                            <span className="text-black">Name</span>
                            <span className="text-black">{role === 'admin' ? 'Admin' : 'Customer'}</span>
                        </div>
                    </button>

                    {/* User Dropdown menu */}
                    {userMenuOpen && (
                        <div className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-30">
                            <div className="px-4 py-3">
                                <p className="text-sm font-medium text-gray-800">{profile?.name}</p>
                                <p className="text-sm text-gray-500">{profile?.email}</p>
                            </div>
                            <ul className="py-2 text-sm text-gray-700">
                                <li>
                                    <Link
                                        href={role === 'admin' ? '/admin' : '/customer'}
                                        className="block px-4 py-2 hover:bg-primary hover:text-white"
                                    >
                                        {role === 'admin' ? 'Admin Dashboard' : 'Customer Dashboard'}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 hover:bg-primary hover:text-white"
                                    >
                                        Settings
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-primary hover:text-white"
                                    >
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={() => setMenuBarOpen(!menuBarOpen)}
                        data-collapse-toggle="navbar-user"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-user"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>

                <div
                    className={`items-center justify-between ${menuBarOpen ? '' : 'hidden'} w-full md:flex md:w-auto md:order-1`}
                    id="navbar-user"
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                                aria-current="page"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                            >
                                Services
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                            >
                                Pricing
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
