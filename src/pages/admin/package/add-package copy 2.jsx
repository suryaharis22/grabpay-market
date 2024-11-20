import { useState } from "react";
import { postData } from "@/utils/api";
import { FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Loading from "@/components/Loading";
import { validatePackageData } from "@/utils/validatePackageData";

const initialFormData = {
    packageName: "",
    msisdn: "",
    roaming: "",
    provider: "",
    active_period: "",
    quota_amount: "",
    free_calls: "",
    sms_amount: "",
    free_access: "",
    is_active: false,
    description: "",
};

const AddPackage = () => {
    const [forms, setForms] = useState([initialFormData]);
    const [loading, setLoading] = useState(false);
    const [errorMassage, setErrorMassage] = useState(
        {}
    );

    const handleChange = (index, e) => {
        const { name, value } = e.target;

        // Update state forms dengan data baru
        const updatedForms = [...forms];
        updatedForms[index] = {
            ...updatedForms[index],
            [name]: value,
        };
        setForms(updatedForms);

        // Validasi data setelah form diperbarui
        const errors = validatePackageData(updatedForms[index], index);

        // Update error messages berdasarkan validasi
        setErrorMassage((prev) => ({
            ...prev,
            [index]: errors, // Menambahkan errors baru untuk index tertentu
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validasi: cek jika ada field yang kosong
            for (const [index, formData] of forms.entries()) {
                const missingFields = Object.entries(formData)
                    .filter(([key, value]) => !value && key !== "is_active") // Kecualikan "is_active" jika false
                    .map(([key]) => key);

                if (missingFields.length > 0) {
                    await Swal.fire({
                        icon: "warning",
                        title: "Validation Error",
                        text: `Form ${index + 1} is incomplete. Please fill in the following fields: ${missingFields.join(
                            ", "
                        )}`,
                        confirmButtonText: "OK",
                    });
                    setLoading(false);
                    return;
                }
            }

            // Tampilkan preview data
            const formPreview = forms
                .map(
                    (formData, index) =>
                        `<div class="p-4 mb-4 border rounded-lg shadow-md bg-gray-100 ">
                        <div class="mb-2">
                            <h2 class="text-lg font-bold text-gray-800">Brand ${index + 1}</h2>
                        </div>
                        <div class="space-y-2 text-left group">
                            <p><span class="font-semibold">Package Name:</span> ${formData.packageName}</p>
                            <p><span class="font-semibold">MSISDN:</span> ${formData.msisdn}</p>
                            <p><span class="font-semibold">Roaming:</span> ${formData.roaming}</p>
                            <p><span class="font-semibold">Provider:</span> ${formData.provider}</p>
                            <p><span class="font-semibold">Active Period:</span> ${formData.active_period}</p>
                            <p><span class="font-semibold">Quota:</span> ${formData.quota_amount}</p>
                            <p><span class="font-semibold">Free Calls:</span> ${formData.free_calls}</p>
                            <p><span class="font-semibold">SMS:</span> ${formData.sms_amount}</p>
                            <p><span class="font-semibold">Free Access:</span> ${formData.free_access}</p>
                            <p>
                                <span class="font-semibold">Active:</span> 
                                <span class="px-3 py-1 rounded-lg text-white text-sm font-medium ${formData.is_active === true ? "bg-green-500" : "bg-red-500"
                        }">
                                    ${formData.is_active === true ? "Active" : "Inactive"}
                                </span>
                            </p>
                            <p class="overflow-hidden text-ellipsis line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                <span class="font-semibold">Description:</span> ${formData.description} 
                            </p>
                        </div>
                    </div>`
                )

                .join("");

            const confirmation = await Swal.fire({
                icon: "question",
                title: "Are you sure?",
                html: `<div class="max-h-96 overflow-y-auto p-4" style="max-height: 400px;">${formPreview}</div>`,
                showCancelButton: true,
                confirmButtonText: "Submit",
                cancelButtonText: "Cancel",
                customClass: {
                    popup: "w-full max-w-xl p-6 bg-white rounded-xl shadow-xl",
                    confirmButton:
                        "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    cancelButton:
                        "bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400",
                },
            });

            if (!confirmation.isConfirmed) {
                setLoading(false);
                return;
            }

            // Submit data ke API
            for (const [index, formData] of forms.entries()) {
                try {
                    const response = await postData(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/brand/create-brand`,
                        {
                            ...formData,
                            is_active: formData.is_active === "true",
                        }
                    );
                    console.log(`Form ${index + 1} response:`, response);
                } catch (error) {
                    console.error(`Error submitting form ${index + 1}:`, error);
                    await Swal.fire({
                        icon: "error",
                        title: "Submission Error",
                        text: `Failed to submit form ${index + 1}. Please check the data and try again.`,
                        confirmButtonText: "OK",
                    });
                }
            }

            await Swal.fire({
                icon: "success",
                title: "Success",
                text: "All forms submitted successfully!",
                confirmButtonText: "OK",
            });

            // Reset form setelah sukses
            setForms([initialFormData]);
        } catch (error) {
            console.error("Error in submission:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to process the forms. Please try again.",
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
            <h1 className="text-30px font-semibold leading-10">Add Packege</h1>
            <div className="flex justify-end items-center mb-4">

            </div>
            {forms.map((formData, index) => (
                <div key={index} className="mb-6 bg-white p-4 rounded-xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Baris 1 */}
                        <input
                            type="text"
                            name="packageName"
                            value={formData.packageName}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            placeholder="Nama Paket"
                        />
                        <div className="">
                            <input
                                type="text"
                                name="msisdn"
                                value={formData.msisdn}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="MSISDN"
                            />
                            {errorMassage[index] && errorMassage[index].msisdn && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errorMassage[index].msisdn}
                                </p>
                            )}
                        </div>
                        <input
                            type="text"
                            name="roaming"
                            value={formData.roaming}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            placeholder="Roaming"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Baris 2 */}
                        <input
                            type="text"
                            name="provider"
                            value={formData.provider}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            placeholder="Provider"
                        />
                        <input
                            type="text"
                            name="active_period"
                            value={formData.active_period}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            placeholder="Masa Aktif"
                        />
                        <input
                            type="text"
                            name="quota_amount"
                            value={formData.quota_amount}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            placeholder="Jumlah Kuota"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Baris 3 */}
                        <input
                            type="text"
                            name="free_calls"
                            value={formData.free_calls}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            placeholder="Panggilan Gratis"
                        />
                        <input
                            type="text"
                            name="sms_amount"
                            value={formData.sms_amount}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            placeholder="Jumlah SMS"
                        />
                        <input
                            type="text"
                            name="free_access"
                            value={formData.free_access}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            placeholder="Akses Gratis"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Checkbox dan Deskripsi */}
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active === true} // Pastikan nilai boolean
                                onChange={(e) => handleChange(index, {
                                    target: {
                                        name: "is_active",
                                        value: e.target.checked // Ubah ke boolean true/false
                                    }
                                })}
                                className="h-5 w-5 border-gray-300 rounded focus:ring-2 focus:ring-secondary"
                            />
                            <span className="text-gray-700">Aktif</span>
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => handleChange(index, e)}
                            className="w-full pl-4 pr-4 py-2 min-h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                            placeholder="Deskripsi"
                        />
                        <button
                            onClick={() => removeForm(index)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <FaTrash />
                        </button>
                    </div>
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

export default AddPackage;
