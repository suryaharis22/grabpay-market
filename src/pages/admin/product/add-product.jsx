
import Loading from "@/components/Loading";
import { getData, postData } from "@/utils/api";
import blobToBinary from "@/utils/blobToBinary";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus, FaTimes, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const PostProduct = () => {
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [bundlings, setBundlings] = useState([]);
    const [productData, setProductData] = useState({
        name: "",
        is_available: false,
        screen: "",
        rear_camera: "",
        front_camera: "",
        processor: "",
        battery: "",
        brand_id: 0,
        bundling_id: 0,
        description: "",
        thumbnail: null,
        variants: [
            {
                price: 0,
                discount: 0,
                stock: 0,
                warranty: "",
                media_galleries: [],
                attributes: [],
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataBrands = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/brand/all-brand?page=1&per_page=1000`);
                setBrands(dataBrands.body);


                const dataBundlings = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/bundling/all-package?page=1&per_page=1000`);
                setBundlings(dataBundlings.body);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        fetchData();
    }, []);

    // Handle input changes
    const handleInputChange = (field, value) => {
        setProductData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    // Handle file input changes
    const handleFileChange = (e, type, variantIndex = null) => {
        const files = Array.from(e.target.files);

        if (type === "thumbnail") {
            setProductData({
                ...productData,
                thumbnail: files[0],
            });
        } else if (type === "media_galleries" && variantIndex !== null) {
            const updatedVariants = [...productData.variants];
            updatedVariants[variantIndex].media_galleries = [
                ...updatedVariants[variantIndex].media_galleries,
                ...files,
            ];
            setProductData({ ...productData, variants: updatedVariants });
        }
    };

    // Add a new variant
    const handleAddVariant = () => {
        setProductData((prevData) => ({
            ...prevData,
            variants: [
                ...prevData.variants,
                {
                    price: 0,
                    discount: 0,
                    stock: 0,
                    warranty: "",
                    media_galleries: [],
                    attributes: [],
                },
            ],
        }));
    };

    // Remove a variant
    const handleRemoveVariant = (index) => {
        setProductData((prevData) => ({
            ...prevData,
            variants: prevData.variants.filter((_, i) => i !== index),
        }));
    };

    // Handle variant field changes
    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[index][field] = value;
        setProductData({ ...productData, variants: updatedVariants });
    };

    // Add an attribute to a variant
    const handleAddAttribute = (variantIndex) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[variantIndex].attributes.push({
            attribute_label: "",
            value: "",
            option_label: "",
            attribute_name: "",
        });
        setProductData({ ...productData, variants: updatedVariants });
    };

    // Remove an attribute from a variant
    const handleRemoveAttribute = (variantIndex, attrIndex) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[variantIndex].attributes = updatedVariants[variantIndex].attributes.filter(
            (_, i) => i !== attrIndex
        );
        setProductData({ ...productData, variants: updatedVariants });
    };

    const handleRemoveImage = (variantIndex, mediaIndex) => {
        setProductData((prevState) => {
            const updatedVariants = [...prevState.variants];

            // Hapus gambar berdasarkan index
            updatedVariants[variantIndex].media_galleries.splice(mediaIndex, 1);

            return {
                ...prevState,
                variants: updatedVariants,
            };
        });
    };


    // Handle attribute field changes
    const handleAttributeChange = (variantIndex, attrIndex, field, value) => {
        const updatedVariants = [...productData.variants];

        // Update the specified field
        updatedVariants[variantIndex].attributes[attrIndex][field] = value;

        // Jika field yang diubah adalah attribute_label dan nilai adalah "Warna"
        if (field === "attribute_label" && value === "Warna") {
            // Pastikan attribute.value diatur sebagai nilai hex default (contoh: hitam)
            updatedVariants[variantIndex].attributes[attrIndex].value = "#000000";
        }

        // Validasi nilai hex jika field adalah value dan label adalah "Warna"
        if (
            field === "value" &&
            updatedVariants[variantIndex].attributes[attrIndex].attribute_label === "Warna"
        ) {
            // Regex untuk memeriksa apakah value adalah hex
            const hexRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
            if (!hexRegex.test(value)) {
                alert("Value harus berupa kode warna HEX yang valid (contoh: #FFFFFF)");
                return;
            }
        }

        // Perbarui state
        setProductData({ ...productData, variants: updatedVariants });
    };



    const uploadImage = async (file, destination) => {
        console.log('destination', destination);

        try {
            if (!file) throw new Error("File tidak ditemukan.");
            if (!file.type.startsWith("image/")) {
                throw new Error("Hanya file gambar yang diperbolehkan.");
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("destination", `${destination}`);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/media/upload-media`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return response.data.body; // Kembalikan data file dari server
        } catch (error) {
            console.error("Gagal mengunggah gambar:", error.response?.data || error.message);
            throw new Error("Gagal mengunggah gambar.");
        }
    };


    const uploadData = async (data) => {
        try {
            const setupData = {
                name: data.name,
                description: data.description,
                is_available: Boolean(data.is_available), // Konversi ke boolean
                screen: data.screen,
                rear_camera: data.rear_camera,
                front_camera: data.front_camera,
                processor: data.processor,
                battery: data.battery,
                thumbnail: data.thumbnail,
                brand_id: parseInt(data.brand_id),
                bundling_id: parseInt(data.bundling_id),
                variants: data.variants.map((variant) => ({
                    price: Number(variant.price),
                    discount: Number(variant.discount), // Pastikan angka
                    stock: Number(variant.stock), // Pastikan angka
                    warranty: variant.warranty,
                    media_galleries: variant.media_galleries.map((media) => ({
                        file_name: media.file_name,
                        file: media.file,
                        media_type: media.media_type,
                    })),
                    attributes: variant.attributes.map((attr) => ({
                        attribute_label: attr.attribute_label,
                        value: attr.value,
                        option_label: attr.option_label,
                        attribute_name: attr.attribute_name,
                    })),
                })),
            };

            console.log('Data yang akan dikirim:', JSON.stringify(setupData, null, 2));

            // Kirim data ke API
            const response = await postData(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/product/create-product`,
                setupData
            );

            // Cek respons server
            if (response?.code === 200) {
                console.log('Respons server:', response);
                setProductData({
                    name: "",
                    is_available: false,
                    screen: "",
                    rear_camera: "",
                    front_camera: "",
                    processor: "",
                    battery: "",
                    brand_id: 0,
                    bundling_id: 0,
                    description: "",
                    thumbnail: null,
                    variants: [
                        {
                            price: 0,
                            discount: 0,
                            stock: 0,
                            warranty: "",
                            media_galleries: [],
                            attributes: [],
                        },
                    ],
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data produk berhasil diunggah!',
                });
                return response;
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Gagal',
                    text: 'Data produk gagal diunggah. Silakan cek kembali input Anda!',
                });
            }
        } catch (error) {
            // Tangani error dengan SweetAlert2
            console.error('Gagal mengunggah data produk:', error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan',
                text: `Gagal mengunggah data produk. Error: ${error.response?.data?.message || error.message}`,
            });
        }
    };




    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const productCopy = structuredClone(productData); // Hindari mutasi langsung

            // Validasi thumbnail
            if (!productCopy.thumbnail) {
                throw new Error("Thumbnail tidak boleh kosong.");
            }

            // Upload Thumbnail
            const thumbnailResponse = await uploadImage(productCopy.thumbnail, "product");
            productCopy.thumbnail = thumbnailResponse.file;

            // Upload Media Galleries untuk setiap variant
            for (let i = 0; i < productCopy.variants.length; i++) {
                const variant = productCopy.variants[i];

                if (variant.media_galleries.length > 0) {
                    const mediaGalleryUrls = await Promise.all(
                        variant.media_galleries.map((file) => uploadImage(file, "product"))
                    );

                    productCopy.variants[i].media_galleries = mediaGalleryUrls.map((mediaResponse, index) => ({
                        file_name: variant.media_galleries[index].name || mediaResponse.file.split("/").pop(),
                        file: mediaResponse.file,
                        media_type: variant.media_galleries[index].type || "application/octet-stream",
                    }));
                }
            }

            // Upload Product Data
            const result = await uploadData(productCopy);
            console.log("Produk berhasil dibuat:", result);

            // Reset state

        } catch (error) {
            console.error("Terjadi kesalahan saat pengiriman:", error.message || error);
            alert(error.message || "Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container p-6">
            <h1 className="text-2xl font-semibold mb-6">Add Produk HP</h1>

            <form onSubmit={handleSubmit} className="flex flex-col bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4">Form Produk</h2>

                {/* Product Name */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Product Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-xl"
                        value={productData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        className="w-full p-2 border rounded-xl"
                        value={productData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                </div>

                {/* Additional Fields */}
                {[
                    { label: "Screen", key: "screen" },
                    { label: "Rear Camera", key: "rear_camera" },
                    { label: "Front Camera", key: "front_camera" },
                    { label: "Processor", key: "processor" },
                    { label: "Battery", key: "battery" },
                ].map((field, index) => (
                    <div key={index} className="mb-4">
                        <label className="block mb-1 font-medium">{field.label}</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-xl"
                            value={productData[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                        />
                    </div>
                ))}

                {/* Dropdowns */}
                {[
                    { label: "Brand", key: "brand_id", options: brands },
                    { label: "Bundling", key: "bundling_id", options: bundlings },
                ].map((dropdown, index) => (
                    <div key={index} className="mb-4">
                        <label className="block mb-1 font-medium">{dropdown.label}</label>
                        <select
                            className="w-full p-2 border rounded-xl"
                            value={productData[dropdown.key] || ""}
                            onChange={(e) => handleInputChange(dropdown.key, e.target.value)}
                        >
                            <option value="" disabled>
                                Select {dropdown.label}
                            </option>
                            {dropdown.options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                {/* Checkbox */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Is Available</label>
                    <input
                        type="checkbox"
                        checked={productData.is_available}
                        className="p-2 border rounded-xl"
                        onChange={(e) => handleInputChange("is_available", e.target.checked)}
                    />
                </div>

                {/* Thumbnail */}
                <div className="mb-6">
                    <label className="block mb-2 font-medium">Thumbnail</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "thumbnail")}
                        className="w-full p-2 border rounded-xl"
                    />
                    {/* Render Thumbnail jika ada */}
                    {productData.thumbnail && (
                        <div className="mt-4 flex flex-wrap">
                            <div className="relative ">
                                <img
                                    src={URL.createObjectURL(productData.thumbnail)}
                                    alt="Thumbnail Preview"
                                    className="w-24 h-24 object-cover m-1 rounded-xl"
                                />
                                {/* Tombol Hapus */}

                            </div>
                        </div>
                    )}
                </div>


                {/* Variants */}
                <h3 className="text-lg font-medium mb-4">Variants</h3>
                {productData.variants.map((variant, index) => (
                    <div key={index} className="p-4 border rounded-xl bg-gray-50 mb-6">
                        {[
                            { label: "Price", key: "price", type: "number", min: 1 },
                            { label: "Discount (%)", key: "discount", type: "number", min: 0 },
                            { label: "Stock", key: "stock", type: "number", min: 1 },
                            { label: "Warranty", key: "warranty", type: "text" },
                        ].map((field, idx) => (
                            <div key={idx} className="mb-4">
                                <label className="block mb-1 font-medium">{field.label}</label>
                                <input
                                    type={field.type}
                                    className="w-full p-2 border rounded-xl"
                                    value={variant[field.key]}
                                    onChange={(e) => handleVariantChange(index, field.key, e.target.value)}
                                    min={field.type === "number" ? field.min : undefined}
                                    onKeyDown={(e) => {
                                        if (
                                            field.type === "number" &&
                                            (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-")
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        ))}


                        {/* Media Galleries */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Media Galleries</label>
                            <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileChange(e, "media_galleries", index)}
                                className="w-full p-2 border rounded-xl"
                            />
                            <div className="mt-4 flex flex-wrap space-x-2">
                                {variant.media_galleries.map((file, fileIndex) => (
                                    <div key={fileIndex} className="relative group bg-gray-200 p-0.5 rounded-xl flex justify-center items-center">
                                        {/* Image */}
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Media ${fileIndex}`}
                                            className="w-24 h-24 object-cover m-1 rounded-xl"
                                        />
                                        {/* Close Icon */}
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition"
                                            onClick={() => handleRemoveImage(index, fileIndex)}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attributes */}
                        <h4 className="text-md font-medium mb-2">Attributes</h4>
                        {variant.attributes.map((attribute, attrIndex) => (
                            <div
                                key={attrIndex}
                                className="p-4 border rounded-xl bg-gray-100 mb-4"
                            >
                                {/* Attribute Fields */}
                                {["Attribute Label", "Value", "Option Label", "Attribute Name"].map((attr, idx) => (
                                    <div key={idx} className="mb-2">
                                        <label className="block mb-1 font-medium">{attr}</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded-xl"
                                            value={attribute[attr.toLowerCase().replace(/ /g, "_")] || ""}
                                            onChange={(e) =>
                                                handleAttributeChange(index, attrIndex, attr.toLowerCase().replace(/ /g, "_"), e.target.value)
                                            }
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAttribute(index, attrIndex)}
                                    className="flex items-center text-red-500 hover:animate-pulse"
                                >
                                    <FaTrashAlt className="mr-2" />Remove Attribute
                                </button>
                            </div>
                        ))}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => handleAddAttribute(index)}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl mt-4"
                            >
                                <FaPlus className="mr-2" />
                                Add Attribute
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemoveVariant(index)}
                                className="flex items-center text-red-500 mt-4 hover:animate-pulse"
                            >
                                <FaTrashAlt className="mr-2" /> Remove Variant
                            </button>
                        </div>

                    </div>
                ))}

                {/* Add Variant Button */}
                <div className="flex justify-center space-x-2">
                    <button
                        type="button"
                        onClick={handleAddVariant}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-xl"
                    >
                        <FaPlus className="mr-2" /> Add Variant
                    </button>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl "
                    >
                        Submit Product
                    </button>
                </div>
            </form>

            {loading && <Loading />}
        </div>

    );
};

export default PostProduct;
