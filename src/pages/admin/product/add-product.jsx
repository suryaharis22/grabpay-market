import { useState, useEffect } from "react";
import HrText from "@/components/HrText";
import { FaCamera, FaPlus, FaTrash } from "react-icons/fa";
import { getData } from "@/utils/api";

const initialFormData = {
    productName: "",
    package: "",
    color: [""], // To store multiple color variants
    romCapacity: [""], // To store multiple ROM capacity variants
    screen: "",
    rearCamera: "",
    processor: "",
    battery: "",
    features: "",
    description: "",
    images: [], // To store multiple images
};

const AddProduct = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [packages, setPackages] = useState();

    const fetchPackages = async () => {
        try {
            const data = await getData('http://localhost:3000/api/packages?page=1&per_page=10');
            setPackages(data.body);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    // Use Effect to Fetch Packages on Initial Render
    useEffect(() => {
        fetchPackages();
    }, []);


    const handleChange = (e) => {
        const { name, value, files, dataset } = e.target;

        if (name === "images") {
            setFormData({
                ...formData,
                images: Array.from(files), // Convert files to an array
            });
        } else if (dataset.index !== undefined) {
            const index = dataset.index;
            setFormData({
                ...formData,
                [name]: formData[name].map((item, i) =>
                    i === parseInt(index) ? value : item
                ),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleAddInput = (field) => {
        setFormData({
            ...formData,
            [field]: [...formData[field], ""],
        });
    };

    const handleRemoveInput = (field, index) => {
        setFormData({
            ...formData,
            [field]: formData[field].filter((_, i) => i !== index),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form data here (send to API, etc.)
        console.log(formData);
        // Reset the form by setting state to initial values
        setFormData(initialFormData);
    };
    return (
        <div className="container p-6">
            <h1 className='text=[30px] font-semibold leading-10'>Produk HP</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-white p-4 rounded-xl">
                {/* Left Column */}
                <div className="space-y-4">
                    <div className="relative mb-2">
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Product Name"
                        />
                    </div>

                    <div className="relative mb-2">
                        <select
                            name="package"
                            value={formData.package}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" selected>Select Packages</option>
                            {packages && packages.map((packageItem) => (
                                <option key={packageItem.id} value={packageItem.id}>
                                    {packageItem.name}
                                </option>
                            ))}

                        </select>
                    </div>

                    {/* Color Variants */}
                    <div className="relative mb-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Color variants</label>
                        {formData.color.map((color, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="color"
                                    name="color"
                                    value={color}
                                    onChange={handleChange}
                                    data-index={index}
                                    className="w-full pl-10 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInput("color", index)}
                                    className="text-red-500"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddInput("color")}
                            className="text-sm text-blue-500 mt-2 flex justify-center items-center"
                        >
                            <FaPlus className="mr-2" /> Add Color
                        </button>
                    </div>


                    <HrText title="Specification" />
                    {/* ROM Capacity Variants */}
                    <div className="relative mb-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900">ROM Capacity Variants</label>
                        {formData.romCapacity.map((rom, index) => (

                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    key={index}
                                    min={0}
                                    type="number"
                                    name="romCapacity"
                                    value={rom}
                                    onChange={handleChange}
                                    data-index={index}
                                    className="w-full pl-10 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                                    placeholder="ROM Capacity"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveInput("romCapacity", index)}
                                    className="text-red-500"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleAddInput("romCapacity")}
                            className="text-sm text-blue-500 mt-2 flex justify-center items-center"
                        >
                            <FaPlus className=" mr-2" />Add ROM Capacity

                        </button>
                    </div>


                    <div className="relative mb-2">
                        <input
                            type="number"
                            min={0}
                            name="screen"
                            value={formData.screen}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Screen"
                        />
                    </div>
                    <div className="relative mb-2">
                        <input
                            type="number"
                            min={0}
                            name="rearCamera"
                            value={formData.rearCamera}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Rear Camera"
                        />
                    </div>


                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div className="relative mb-2">
                        <input
                            type="text"
                            name="processor"
                            value={formData.processor}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Processor"
                        />
                    </div>

                    <div className="relative mb-2">
                        <input
                            type="number"
                            min={0}
                            name="battery"
                            value={formData.battery}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Battery"
                        />
                    </div>
                    <HrText title="Fitur Utama" />
                    <div className="relative mb-2">
                        <textarea
                            name="features"
                            value={formData.features}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 h-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Fitur Utama"
                        ></textarea>
                    </div>

                    <div className="relative mb-2">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 h-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Description"
                        ></textarea>
                    </div>

                    {/* Add features and description here */}

                    <div className="relative mb-2">
                        <label htmlFor="images" className="w-full bg-gray-50 flex justify-center items-center pl-10 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <div className="flex justify-center items-center">
                                <FaCamera className="mr-2" />
                                Upload Images
                            </div>
                        </label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            multiple // Allow multiple files
                            onChange={handleChange}
                            className="hidden pl-10 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Display selected images */}
                    <div className="space-x-2 mt-4 flex">
                        {formData.images.length > 0 && formData.images.map((image, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(image)}
                                alt={`preview-${index}`}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
