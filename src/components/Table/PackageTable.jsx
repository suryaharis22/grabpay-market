import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaSortUp, FaSortDown, FaSearch, FaRegTrashAlt, FaRegEye, FaEllipsisH, FaTimes } from 'react-icons/fa';
import { getData } from '@/utils/api'; // Import the getData function
import Pagination from './Pagination';
import { PiPencilLine } from "react-icons/pi";
import { TbCirclePlus } from "react-icons/tb";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Link from 'next/link';


const ProviderTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [packages, setPackages] = useState([]);
    const [providers, setProviders] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProvider, setSelectedProvider] = useState('');
    const [sortColumn, setSortColumn] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [openMenu, setOpenMenu] = useState(null);

    // Fetch Packages using getData
    const fetchPackages = async () => {
        try {
            let url = 'http://localhost:3000/api/packages';
            const queryParams = new URLSearchParams({
                page: currentPage,
                per_page: perPage,
                sortBy: sortColumn,
                order: sortOrder,
            });


            let data;

            if (searchTerm) {
                data = await getData(`${url}?search=${searchTerm}&${queryParams.toString()}`);
            } else if (selectedProvider) {
                data = await getData(`${url}?provider_name=${selectedProvider}&${queryParams.toString()}`);
            } else {
                data = await getData(`${url}?${queryParams.toString()}`);
            }

            setPackages(data.body);
            setTotalPages(data.meta.page_count);
            setTotalItems(data.meta.total);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Fetch Providers using getData
    const fetchProviders = async () => {
        try {
            const data = await getData('http://localhost:3000/api/providers?page=1&per_page=10');
            setProviders(data.body);
        } catch (error) {
            console.error('Error fetching providers:', error);
        }
    };

    // Use Effect to Fetch Providers on Initial Render
    useEffect(() => {
        fetchProviders();
    }, []);

    // Use Effect to Fetch Packages when any relevant dependency changes
    useEffect(() => {
        fetchPackages();
    }, [currentPage, perPage, searchTerm, selectedProvider, sortColumn, sortOrder]);


    // Handle Search Change
    const handleSearchChange = (e) => {
        setCurrentPage(1);
        setSearchTerm(e.target.value);
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

    // Handle Provider Filter Change
    const handleProviderChange = (e) => {
        setCurrentPage(1);
        setSelectedProvider(e.target.value);
    };

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


                    <div class="relative">
                        <input
                            type="text"
                            class="w-full pr-10 block p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  "
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange} />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">

                            <FaSearch className='w-4 h-4 text-gray-500' />
                        </div>
                    </div>

                    <select
                        onChange={handleProviderChange}
                        value={selectedProvider}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                        <option value="">All Providers</option>
                        {providers.map((pkg) => (
                            <option key={pkg.id} value={pkg.name}>
                                {pkg.name}
                            </option>
                        ))}
                    </select>

                </div>

                <Link href="/admin/add-package" className='flex items-center gap-2 bg-primary hover:bg-black text-white py-2 px-4 rounded-xl  text-gray-900 text-sm rounded-lg'><TbCirclePlus size={20} />Tambah</Link>

            </div>



            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-white uppercase bg-primary ">
                        <tr>
                            <th className="px-6 py-3">
                                <div
                                    onClick={() => handleSortChange('name')}
                                    className="flex items-center cursor-pointer">
                                    Neme
                                    {sortColumn === 'name' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3">
                                <div
                                    onClick={() => handleSortChange('prefix_code')}
                                    className="flex items-center cursor-pointer">
                                    Kode
                                    {sortColumn === 'prefix_code' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3">
                                <div
                                    onClick={() => handleSortChange('provider.name')}
                                    className="flex items-center cursor-pointer">
                                    Provider
                                    {sortColumn === 'provider' && (
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
                        {packages.map((pkg) => (
                            <tr key={pkg?.id} className="bg-white border-b">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {pkg?.name}
                                </th>

                                <td className="px-6 py-4">{pkg?.prefix_code}</td>
                                <td className="px-6 py-4">{pkg?.provider?.name}</td>

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

export default ProviderTable;
