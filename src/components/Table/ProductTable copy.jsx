import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import { getData } from '@/utils/api'; // Import the getData function
import PaginationTable from './PaginationTable';

const ProductTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortColumn, setSortColumn] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');

    // Fetch Products using getData
    const fetchProducts = async () => {
        try {
            let url = 'http://localhost:3000/api/products';
            const queryParams = new URLSearchParams({
                page: currentPage,
                per_page: perPage,
                sortBy: sortColumn,
                order: sortOrder,
            });

            let data;

            if (searchTerm) {
                data = await getData(`${url}?search=${searchTerm}&${queryParams.toString()}`);
            } else if (selectedCategory) {
                data = await getData(`${url}?category=${selectedCategory}&${queryParams.toString()}`);
            } else {
                data = await getData(`${url}?${queryParams.toString()}`);
            }

            setProducts(data.body);
            setTotalPages(data.meta.page_count);
            setTotalItems(data.meta.total);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Fetch Categories using getData
    const fetchCategories = async () => {
        try {
            const data = await getData('http://localhost:3000/api/categories?page=1&per_page=10');
            setCategories(data.body);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Use Effect to Fetch Categories on Initial Render
    useEffect(() => {
        fetchCategories();
    }, []);

    // Use Effect to Fetch Products when any relevant dependency changes
    useEffect(() => {
        fetchProducts();
    }, [currentPage, perPage, searchTerm, selectedCategory, sortColumn, sortOrder]);


    // Handle Search Change
    const handleSearchChange = (e) => {
        setCurrentPage(1);
        setSearchTerm(e.target.value);
    };

    // Handle Category Filter Change
    const handleCategoryChange = (e) => {
        setCurrentPage(1);
        setSelectedCategory(e.target.value);
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

    // Handle Entries Per Page Change
    const handleEntriesPerPageChange = (e) => {
        setPerPage(parseInt(e.target.value));
    };

    // Handle Pagination Change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getPageNumbers = () => {
        const maxVisiblePages = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };



    return (
        <div className="container mx-auto p-6">
            <div className="mb-4 flex justify-between items-center">
                <div className="flex space-x-4">
                    {/* <input
                        type="text"
                        placeholder="Search Products"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    /> */}

                    <div class="relative">
                        <input
                            type="text"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 p-2.5"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange} />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">

                            <FaSearch className='w-4 h-4 text-gray-500' />
                        </div>
                    </div>

                    <select
                        onChange={handleCategoryChange}
                        value={selectedCategory}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                </div>
                <div className="flex items-center space-x-2">
                    <span>Entries per page:</span>
                    <select
                        onChange={handleEntriesPerPageChange}
                        value={perPage}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>



            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th className="px-6 py-3">
                                <div
                                    onClick={() => handleSortChange('title')}
                                    className="flex items-center cursor-pointer">
                                    Neme
                                    {sortColumn === 'title' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3">
                                <div
                                    className="flex items-center cursor-pointer">
                                    Price
                                    {sortColumn === 'price' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3">
                                <div
                                    onClick={() => handleSortChange('category')}
                                    className="flex items-center cursor-pointer">
                                    Category
                                    {sortColumn === 'category' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>

                            </th>
                            <th className="px-6 py-3">
                                <div
                                    className="flex items-center cursor-pointer">
                                    Stok
                                    {sortColumn === 'stok' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3">
                                <div
                                    className="flex items-center cursor-pointer">
                                    Status
                                    {sortColumn === 'Status' && (
                                        <span

                                            className="w-3 h-3 ms-1.5 ">
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </div>

                            </th>
                            <th className=" text-right px-6">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="bg-white border-b ">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    {product.title}
                                </th>
                                <td className="px-6 py-4">
                                    ${product.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    {product.category}
                                </td>
                                <td className="px-6 py-4">
                                    {product.stock}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded-lg text-white ${product.status === 'ready' ? 'bg-green-500' : 'bg-red-500'}`}
                                    >
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a>
                                </td>
                            </tr>
                        ))}




                    </tbody>
                </table>
            </div>
            {/* Pagination Controls */}
            <div className="mt-4 flex justify-center items-center">
                <nav aria-label="Page navigation example">
                    <ul className="flex items-center -space-x-px h-8 text-sm">
                        <li>
                            <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">
                                First
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ">
                                <FaChevronLeft />
                            </button>
                        </li>
                        {getPageNumbers().map((page) => (
                            <li key={page}>
                                <button
                                    onClick={() => handlePageChange(page)}
                                    className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-500 bg-white'}`}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                                <FaChevronRight />
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ">
                                Last
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default ProductTable;
