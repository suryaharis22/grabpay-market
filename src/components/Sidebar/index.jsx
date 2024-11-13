import { FaHome, FaUsers, FaCog, FaRegAddressCard } from 'react-icons/fa';
import { MdOutlineDashboard } from 'react-icons/md';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import { LiaFileContractSolid } from "react-icons/lia";
import { RiShoppingBag4Line } from "react-icons/ri";
import { BsSdCard } from "react-icons/bs";

const Sidebar = ({ role }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter(); // Get the current router

    const sidebarItemsAdmin = [
        { name: 'Dashboard', icon: <MdOutlineDashboard />, href: '/admin' },
        { name: 'Transaksi', icon: <LiaFileContractSolid />, href: '/admin/transactions' },
        { name: 'Users', icon: <FaRegAddressCard />, href: '/admin/users' },
        { name: 'Produk HP', icon: <RiShoppingBag4Line />, href: '/admin/product' },
        { name: 'Paket', icon: <BsSdCard />, href: '/admin/package' },
    ];

    const sidebarItemsCustomer = [
        { name: 'Home', icon: <FaHome />, href: '/customer' },
        { name: 'Profile', icon: <FaUsers />, href: '/profile' },
    ];

    const sidebarItems = role === 'admin' ? sidebarItemsAdmin : sidebarItemsCustomer;

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (

        <div
            className={`w-64 min-h-screen bg-white transition-transform z-40 md:translate-x-0 fixed md:relative ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            {/* Logo */}
            <div className="flex justify-center py-4">
                <img src="/logo.png" alt="Logo" className="w-32 h-auto" />
            </div>

            {/* Render sidebar items based on the role */}
            <ul className="space-y-2 font-medium mx-[20px]">
                {sidebarItems.map((item, index) => {
                    const isActive = router.pathname === item.href;
                    return (
                        <li key={index}>
                            <Link href={item.href} className={`w-full h-[60px] text-[24px] flex items-center p-[20px] rounded-lg ${isActive ? 'text-white bg-primary' : 'text-black hover:text-white hover:bg-primary'} group`}>

                                {item.icon}
                                <span className="ml-[20px]">{item.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

        </div>

    );
};

export default Sidebar;
