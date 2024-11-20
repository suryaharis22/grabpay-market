import { useState } from "react";

const PostProduct = () => {
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        thumbnail: null,
        variants: [
            {
                price: 0,
                discount: 0,
                stock: 0,
                warranty: "",
                media_galleries: [], // Media galleries untuk setiap variant
                attributes: [],
            },
        ],
    });

    // Fungsi untuk meng-handle perubahan input text
    const handleInputChange = (field, value) => {
        setProductData({
            ...productData,
            [field]: value,
        });
    };

    // Fungsi untuk meng-handle perubahan pada variant
    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[index][field] = value;
        setProductData({ ...productData, variants: updatedVariants });
    };

    // Fungsi untuk menambah variant baru
    const handleAddVariant = () => {
        setProductData({
            ...productData,
            variants: [
                ...productData.variants,
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
    };

    // Fungsi untuk menghapus variant
    const handleRemoveVariant = (index) => {
        const updatedVariants = productData.variants.filter((_, i) => i !== index);
        setProductData({ ...productData, variants: updatedVariants });
    };

    // Fungsi untuk menambah attribute pada variant
    const handleAddAttribute = (index) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[index].attributes.push({
            attribute_label: "",
            value: "",
            option_label: "",
            attribute_name: "",
        });
        setProductData({ ...productData, variants: updatedVariants });
    };

    // Fungsi untuk mengubah attribute pada variant
    const handleAttributeChange = (index, attrIndex, field, value) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[index].attributes[attrIndex][field] = value;
        setProductData({ ...productData, variants: updatedVariants });
    };

    // Fungsi untuk menghapus attribute dari variant
    const handleRemoveAttribute = (index, attrIndex) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[index].attributes.splice(attrIndex, 1);
        setProductData({ ...productData, variants: updatedVariants });
    };

    // Fungsi untuk menangani perubahan file pada thumbnail dan media_galleries
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

    // Fungsi untuk meng-handle submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        // Proses data productData, kirim ke backend atau API
        console.log(productData);
    };

    return (
        <div className="container p-6">
            <h1 className="text-[30px] font-semibold leading-10">Produk HP</h1>
            <form onSubmit={handleSubmit} className="flex flex-col bg-white p-4">
                <h1 className="text-2xl font-bold">Post Product</h1>
                <div>
                    <label className="block mb-1 font-medium">Product Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={productData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        value={productData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                </div>

                {/* Thumbnail image */}
                <div>
                    <label className="block mb-2 font-medium">Thumbnail</label>
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "thumbnail")}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Variants */}
                <h2 className="text-xl font-medium">Variants</h2>
                {productData.variants.map((variant, index) => (
                    <div key={index} className="p-4 border rounded bg-gray-50 mb-6">
                        {/* Variant Price, Discount, Stock, Warranty */}
                        <div>
                            <label className="block mb-1 font-medium">Price</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={variant.price}
                                onChange={(e) =>
                                    handleVariantChange(index, "price", e.target.value)
                                }
                            />
                        </div>

                        {/* Media Galleries */}
                        <div>
                            <label className="block mb-2 font-medium">Media Galleries</label>
                            <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileChange(e, "media_galleries", index)}
                                className="w-full p-2 border rounded"
                            />
                            {/* Tampilkan gambar yang di-upload */}
                            {variant.media_galleries.length > 0 && (
                                <div className="mt-4">
                                    {variant.media_galleries.map((file, fileIndex) => (
                                        <img
                                            key={fileIndex}
                                            src={URL.createObjectURL(file)}
                                            alt={`Media ${fileIndex}`}
                                            className="w-24 h-24 object-cover mr-2"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => handleRemoveVariant(index)}
                            className="text-red-500 mt-4"
                        >
                            Remove Variant
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Add Variant
                </button>

                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded mt-6"
                >
                    Submit Product
                </button>
            </form>
        </div>
    );
};

export default PostProduct;
