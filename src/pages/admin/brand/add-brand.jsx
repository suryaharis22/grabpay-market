import { useState } from "react";
import { postData } from "@/utils/api";
import { FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Loading from "@/components/Loading";

const initialFormData = {
    BrandName: "",
    store: "",
    description: "",
};

const AddBrand = () => {
    const [forms, setForms] = useState([initialFormData]);
    const [loading, setLoading] = useState(false);

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedForms = [...forms];
        updatedForms[index] = {
            ...updatedForms[index],
            [name]: value,
        };
        setForms(updatedForms);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validasi: cek jika ada field yang kosong
        for (const [index, formData] of forms.entries()) {
            const { BrandName, store, description } = formData;

            if (!BrandName || !store || !description) {
                await Swal.fire({
                    icon: "warning",
                    title: "Validation Error",
                    text: `Form ${index + 1} is incomplete. Please fill in all fields.`,
                    confirmButtonText: "OK",
                });
                setLoading(false);
                return;
            }
        }

        const formPreview = forms
            .map(
                (formData, index) =>
                    `<div class="text-left mb-2 p-2 rounded-lg  border-gray-300 border-2 bg-gray-200 group">
                <label class="mb-2">Brand ${index + 1}</label><br>
                <span><strong>Brand Name:</strong> ${formData.BrandName}</span><br>
                <span><strong>Store:</strong> ${formData.store}</span><br>
                <span class="overflow-hidden text-ellipsis line-clamp-2 group-hover:line-clamp-none transition-all duration-300"><strong>Description:</strong> ${formData.description}</span>
                </div>`
            )
            .join("");

        const confirmation = await Swal.fire({
            icon: "question",
            title: "Are you sure?",
            html: `<div class="max-h-96 overflow-y-auto p-4" style="max-height: 400px;">${formPreview}</div>`, // Apply overflow only to the form data
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            customClass: {
                popup: "w-full max-w-xl p-6 bg-white rounded-xl shadow-xl", // Tailwind custom class untuk popup
                confirmButton: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                cancelButton: "bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400",
            }
        });

        if (!confirmation.isConfirmed) {
            setLoading(false);
            return; // Jika tidak dikonfirmasi, hentikan proses
        }

        try {
            // Submit data jika validasi berhasil dan konfirmasi diterima
            for (const [index, formData] of forms.entries()) {
                const { BrandName, store, description } = formData;

                try {
                    const response = await postData(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/brand/create-brand`, {
                        name: BrandName,
                        store: store,
                        description: description,
                    });

                    console.log(`Form ${index + 1} Response:`, response);
                } catch (error) {
                    console.error(`Error sending form ${index + 1}:`, error);
                    await Swal.fire({
                        icon: "error",
                        title: "Submission Error",
                        text: `Failed to submit form ${index + 1}. Please check the data and try again.`,
                        confirmButtonText: "OK",
                    });
                    // Lanjutkan ke form berikutnya meskipun ada yang gagal
                }
            }

            await Swal.fire({
                icon: "success",
                title: "Success",
                text: "Brands added successfully!",
                confirmButtonText: "OK",
            });

            setForms([initialFormData]); // Reset forms setelah submit
        } catch (error) {
            console.error("Error adding brands:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add brands. Please try again.",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };



    const addNewForm = () => {
        setForms([...forms, initialFormData]);
    };

    const removeForm = (index) => {
        const updatedForms = forms.filter((_, i) => i !== index);
        setForms(updatedForms);
    };

    return (
        <div className="container p-6">
            <h1 className="text-30px font-semibold leading-10">Add Brand</h1>
            <div className="flex justify-end items-center mb-4">

            </div>
            {forms.map((formData, index) => (
                <div key={index} className="mb-4 bg-white p-4 rounded-xl flex space-x-2">
                    <input
                        type="text"
                        name="BrandName"
                        value={formData.BrandName}
                        onChange={(e) => handleChange(index, e)}
                        className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary mt-2"
                        placeholder="Brand Name"
                    />
                    <input
                        type="text"
                        name="store"
                        value={formData.store}
                        onChange={(e) => handleChange(index, e)}
                        className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary mt-2"
                        placeholder="Store"
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => handleChange(index, e)}
                        className="w-full pl-4 pr-4 py-2 min-h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary mt-2"
                        placeholder="Description"
                    />
                    <button
                        onClick={() => removeForm(index)}
                        className="text-red-600 hover:text-red-800 mt-2 "
                    >
                        <FaTrash />
                    </button>
                </div>
            ))}
            <div className="flex justify-between">
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 w-52"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
                <button
                    onClick={addNewForm}
                    className="flex items-center  bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    <FaPlus className="mr-2" />
                    New Form
                </button>

            </div>

            {loading && <Loading />}
        </div>
    );
};

export default AddBrand;
