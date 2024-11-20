import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaSortUp, FaSortDown, FaSearch, FaRegTrashAlt, FaRegEye, FaEllipsisH, FaTimes } from 'react-icons/fa';
import { getData } from '@/utils/api'; // Import the getData function
import Pagination from './Pagination';
import { PiPencilLine } from "react-icons/pi";
import { TbCirclePlus } from "react-icons/tb";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Link from 'next/link';
import sensorNumber from '@/utils/sensor_number';


const UserTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sortColumn, setSortColumn] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [openMenu, setOpenMenu] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [searchStore, setSearchStore] = useState('');

    // Fetch Packages using getData
    const fetchPackages = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/user/all-user?`;

            // Membuat query parameter
            const queryParams = new URLSearchParams({
                page: currentPage,
                per_page: perPage,
                sortBy: sortColumn,
                order: sortOrder,
            });

            if (searchName) {
                queryParams.append("full_name", searchName);
            }

            if (searchStore) {
                queryParams.append("store", searchStore);
            }

            const data = await getData(`${url}${queryParams.toString()}`);

            setUsers(data.body);
            setTotalPages(data.meta.page_count);
            setTotalItems(data.meta.total);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    // Use Effect to Fetch Packages when any relevant dependency changes
    useEffect(() => {
        fetchPackages();
    }, [currentPage, perPage, searchName, searchStore, sortColumn, sortOrder]);


    // Handle Search Change
    const handleSearchNameChange = (e) => {
        setCurrentPage(1);
        setSearchName(e.target.value);
    };

    // Handle Min Price Change
    const handleMinPriceChange = (e) => {
        setCurrentPage(1);
        setMinPrice(e.target.value);
    }
    const handleMaxPriceChange = (e) => {
        setCurrentPage(1);
        setMaxPrice(e.target.value);
    }



    // Handle Entries Per Page Change
    const handleEntriesPerPageChange = (e) => {
        setPerPage(parseInt(e.target.value));
    };

    // Handle Sorting Change
    const handleSortChange = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    // Handle Pagination Change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleMenuToggle = (id) => {
        setOpenMenu(openMenu === id ? null : id); // Toggle visibility of the dropdown
    };

    return (
        <>
            <div className="my-4 flex justify-between items-center">
                <div className="flex space-x-4">


                    <div className="relative">
                        <input
                            type="text"
                            className="w-full pr-10 block p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  "
                            placeholder="Search"
                            value={searchName}
                            onChange={handleSearchNameChange} />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">

                            <FaSearch className='w-4 h-4 text-gray-500' />
                        </div>
                    </div>



                </div>

                <Link href="/admin/add-package" className='flex items-center gap-2 bg-primary hover:bg-black text-white py-2 px-4 rounded-xl  text-gray-900 text-sm rounded-lg'><TbCirclePlus size={20} />Tambah</Link>

            </div>



            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-white uppercase bg-primary ">
                        <tr>
                            <th className="px-6 py-3">
                                <div
                                    onClick={() => handleSortChange('full_name')}
                                    className="flex items-center cursor-pointer">
                                    Full Name
                                    {sortColumn === 'full_name' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3">
                                <div
                                    onClick={() => handleSortChange('email')}
                                    className="flex items-center cursor-pointer">
                                    Email
                                    {sortColumn === 'email' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3">
                                <div
                                    onClick={() => handleSortChange('phone_number')}
                                    className="flex items-center cursor-pointer">
                                    Phone Number
                                    {sortColumn === 'phone_number' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3">
                                <div
                                    onClick={() => handleSortChange('nik')}
                                    className="flex items-center cursor-pointer">
                                    NIK
                                    {sortColumn === 'nik' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3">
                                <div
                                    onClick={() => handleSortChange('status')}
                                    className="flex items-center cursor-pointer">
                                    Status
                                    {sortColumn === 'status' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>
                            </th>


                            <th className=" text-center px-6">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((pkg) => (
                            <tr key={pkg?.id} className="bg-white border-b">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {pkg?.full_name}
                                </th>

                                <td className="px-6 py-4">{pkg?.email}</td>
                                <td className="px-6 py-4">{pkg?.phone_number}</td>
                                <td className="px-6 py-4">{sensorNumber(pkg?.nik)}</td>
                                <td className="px-6 py-4">{pkg?.is_active}
                                    <span
                                        className={`px-2 py-1 rounded-lg text-white ${pkg.is_active ? 'bg-green-500' : 'bg-red-500'}`}
                                    >
                                        {pkg.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>


                                <td className="relative flex justify-center items-center py-4 space-x-2 ">
                                    <button
                                        onClick={() => handleMenuToggle(pkg?.id)}
                                        className="font-medium text-primary hover:animate-pulse"
                                    >
                                        {openMenu === pkg?.id ? <FaTimes size={20} /> : <FaEllipsisH size={20} />}

                                    </button>
                                    {openMenu === pkg?.id && (
                                        <div className=" p-1 bg-white z-20 text-black flex space-x-1 border border-2 border-primary rounded-xl">
                                            <button className="px-2 py-2 bg-red-500 text-white border rounded-md hover:bg-red-600"><FaRegTrashAlt /></button>
                                            <button className="px-2 py-2 bg-yellow-500 text-black border rounded-md hover:bg-yellow-600"><PiPencilLine /></button>
                                            <button className="px-2 py-2 bg-blue-500 text-black border rounded-md hover:bg-blue-600"><FaRegEye /></button>
                                        </div>


                                    )}
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-2">
                    <span>Entries per page:</span>
                    <select
                        onChange={handleEntriesPerPageChange}
                        value={perPage}
                        className="block px-1 h-8 w-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                <div className="flex-grow flex justify-center items-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageChange={handlePageChange}
                    />
                </div>
            </div>

        </>

    );
};

export default UserTable;
