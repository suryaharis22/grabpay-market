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
            // **Validasi Awal Semua Form**
            for (const [index, formData] of forms.entries()) {
                const validationErrors = validatePackageData(formData, index); // Ambil semua error
                console.log(validationErrors);

                // Cek apakah ada error (jika objek `validationErrors` tidak kosong)
                if (Object.keys(validationErrors).length > 0) {
                    // Format pesan error menjadi string untuk ditampilkan di Swal
                    const errorMessage = Object.entries(validationErrors)
                        .map(([field, message]) => `<li><strong>${field}:</strong> ${message}</li>`)
                        .join("");

                    await Swal.fire({
                        icon: "warning",
                        title: `<h2 class="text-lg font-semibold text-red-600">Validation Error on Form ${index + 1}</h2>`,
                        html: `<ul class="text-left text-sm text-gray-800 space-y-2">${errorMessage}</ul>`,
                        confirmButtonText: "OK",
                        customClass: {
                            popup: "bg-white rounded-lg shadow-lg max-w-xl p-6",
                            title: "text-red-600 font-semibold",
                            htmlContainer: "text-gray-700",
                            confirmButton: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400",
                        },
                    });

                    setLoading(false);
                    return; // Hentikan jika ada error validasi
                }
            }


            // **Preview Data untuk Konfirmasi**
            const formPreview = forms
                .map((formData, index) => {
                    return `
                        <div class="p-4 mb-4 border rounded-lg shadow-md bg-gray-100">
                            <div class="mb-2">
                                <h2 class="text-lg font-bold text-gray-800">Brand ${index + 1}</h2>
                            </div>
                            <div class="space-y-2 text-left">
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
                                    <span class="px-3 py-1 rounded-lg text-white text-sm font-medium ${formData.is_active ? "bg-green-500" : "bg-red-500"
                        }">
                                        ${formData.is_active ? "Active" : "Inactive"}
                                    </span>
                                </p>
                                <p class="overflow-hidden text-ellipsis line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                    <span class="font-semibold">Description:</span> ${formData.description}
                                </p>
                            </div>
                        </div>
                    `;
                })
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
                    confirmButton: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                    cancelButton: "bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400",
                },
            });

            if (!confirmation.isConfirmed) {
                setLoading(false);
                return; // Hentikan jika pengguna membatalkan
            }

            // **Proses Submit Data**
            const results = await Promise.all(
                forms.map(async (formData) => {
                    try {
                        await postData(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/bundling/create-package`, {
                            name: formData.packageName,
                            msisdn: formData.msisdn,
                            roaming: formData.roaming,
                            // provider: formData.provider,
                            provider: 'TELKOMSEL',
                            active_period: formData.active_period,
                            quota_amount: formData.quota_amount,
                            free_calls: formData.free_calls,
                            sms_amount: formData.sms_amount,
                            free_access: formData.free_access,
                            is_active: formData.is_active,
                            description: formData.description,
                        });
                        return { success: true };
                    } catch (error) {
                        console.error("Error submitting form:", formData.packageName, error);
                        return { success: false, error: formData.packageName };
                    }
                })
            );

            // **Cek Hasil Submit**
            const failed = results.filter((result) => !result.success);
            if (failed.length > 0) {
                const failedPackages = failed.map((f) => f.error).join(", ");
                await Swal.fire({
                    icon: "error",
                    title: "Submission Error",
                    text: `Failed to submit the following packages: ${failedPackages}. Please check and try again.`,
                    confirmButtonText: "OK",
                });
            } else {
                await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "All brands added successfully!",
                    confirmButtonText: "OK",
                });

                setForms([initialFormData]); // Reset forms jika berhasil
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "An unexpected error occurred. Please try again.",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false); // Pastikan loading di-reset di akhir
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
                        <div className="relative">
                            <label htmlFor="packageName" className="block text-sm font-medium text-gray-700">Package Name</label>
                            <input
                                type="text"
                                name="packageName"
                                value={formData.packageName}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="Nama Paket"
                            />
                            {errorMassage[index] && errorMassage[index].packageName && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errorMassage[index].packageName}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <label htmlFor="msisdn" className="block text-sm font-medium text-gray-700">MSISDN</label>
                            <input
                                type="tel"
                                min={0}
                                maxLength={13}
                                onKeyDown={(e) => {
                                    if (
                                        !(
                                            (e.key >= "0" && e.key <= "9") || // angka 0-9
                                            e.key === "Backspace" || // tombol backspace
                                            e.key === "ArrowLeft" || // tombol panah kiri
                                            e.key === "ArrowRight" || // tombol panah kanan
                                            e.key === "Delete" || // tombol delete
                                            e.key === "Tab" // tombol tab
                                        )
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                name="msisdn"
                                value={formData.msisdn}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="MSISDN"
                            />
                            {errorMassage[index] && errorMassage[index].msisdn && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errorMassage[index].msisdn}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <label htmlFor="roaming" className="block text-sm font-medium text-gray-700">Roaming</label>
                            <input
                                type="text"
                                name="roaming"
                                value={formData.roaming}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="Roaming"
                            />
                            {errorMassage[index] && errorMassage[index].roaming && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errorMassage[index].roaming}
                                </p>
                            )}
                        </div>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Baris 2 */}
                        <div className="relative">
                            <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Provider</label>
                            <input
                                type="text"
                                name="provider"

                                disabled
                                value={`TELKOMSEL`}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="Provider"
                            />
                            {errorMassage[index] && errorMassage[index].provider && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errorMassage[index].provider}
                                </p>
                            )}
                        </div>
                        <div className="relative">
                            <label htmlFor="active_period" className="block text-sm font-medium text-gray-700">Active Period</label>
                            <input
                                type="text"
                                name="active_period"
                                value={formData.active_period}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="Masa Aktif"
                            />
                            {errorMassage[index] && errorMassage[index].active_period && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errorMassage[index].active_period}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <label htmlFor="quota_amount" className="block text-sm font-medium text-gray-700">Quota Amount</label>
                            <input
                                type="text"
                                name="quota_amount"
                                value={formData.quota_amount}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="Jumlah Kuota"
                            />
                            {errorMassage[index] && errorMassage[index].quota_amount && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errorMassage[index].quota_amount}
                                </p>
                            )}
                        </div>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Baris 3 */}
                        <div className="relative">
                            <label htmlFor="free_calls" className="block text-sm font-medium text-gray-700">Free Calls</label>
                            <input
                                type="text"
                                name="free_calls"
                                value={formData.free_calls}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="Panggilan Gratis"
                            />
                            {errorMassage[index] && errorMassage[index].free_calls && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errorMassage[index].free_calls}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <label htmlFor="sms_amount" className="block text-sm font-medium text-gray-700">SMS Amount</label>
                            <input
                                type="text"
                                name="sms_amount"
                                value={formData.sms_amount}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="Jumlah SMS"
                            />
                            {errorMassage[index] && errorMassage[index].sms_amount && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errorMassage[index].sms_amount}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            <label htmlFor="free_access" className="block text-sm font-medium text-gray-700">Free Access</label>
                            <input
                                type="text"
                                name="free_access"
                                value={formData.free_access}
                                onChange={(e) => handleChange(index, e)}
                                className="w-full pl-4 pr-4 py-2 h-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                                placeholder="Akses Gratis"
                            />
                            {errorMassage[index] && errorMassage[index].free_access && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errorMassage[index].free_access}
                                </p>
                            )}
                        </div>

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
