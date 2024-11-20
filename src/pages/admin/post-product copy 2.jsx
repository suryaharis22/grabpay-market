import { useState } from "react";

const PostProduct = () => {
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        is_available: true,
        thumbnail: "",
        brand_id: 1,
        bundling_id: 1,
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

    // Handle input changes for basic product fields
    const handleInputChange = (field, value) => {
        setProductData({ ...productData, [field]: value });
    };

    // Handle variant-specific fields
    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[index][field] = value;
        setProductData({ ...productData, variants: updatedVariants });
    };

    // Add a new variant
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

    // Remove a variant
    const handleRemoveVariant = (index) => {
        const updatedVariants = [...productData.variants];
        updatedVariants.splice(index, 1);
        setProductData({ ...productData, variants: updatedVariants });
    };

    // Handle attribute changes
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

    const handleRemoveAttribute = (variantIndex, attributeIndex) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[variantIndex].attributes.splice(attributeIndex, 1);
        setProductData({ ...productData, variants: updatedVariants });
    };

    const handleAttributeChange = (variantIndex, attributeIndex, field, value) => {
        const updatedVariants = [...productData.variants];
        updatedVariants[variantIndex].attributes[attributeIndex][field] = value;
        setProductData({ ...productData, variants: updatedVariants });
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting product data:", productData);

        // Simulate API call
        try {
            const response = await fetch("https://api.example.com/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });
            const result = await response.json();
            console.log("Success:", result);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container p-6">
            <h1 className='text=[30px] font-semibold leading-10'>Produk HP</h1>
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
                <div className="">
                    <label className="block mb-2 font-medium">Thumbnail</label>
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <h2 className="text-xl font-medium">Variants</h2>
                {productData.variants.map((variant, index) => (
                    <div key={index} className="p-4 border rounded bg-gray-50 mb-6">
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
                        <div>
                            <label className="block mb-1 font-medium">Discount (%)</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={variant.discount}
                                onChange={(e) =>
                                    handleVariantChange(index, "discount", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Stock</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={variant.stock}
                                onChange={(e) =>
                                    handleVariantChange(index, "stock", e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Warranty</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={variant.warranty}
                                onChange={(e) =>
                                    handleVariantChange(index, "warranty", e.target.value)
                                }
                            />
                        </div>

                        {/* Media Galleries Upload */}
                        <div>
                            <label className="block mb-2 font-medium">Media Galleries</label>
                            <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileChange(e, 'media_galleries')}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <h3 className="font-medium text-lg mb-2">Attributes</h3>
                            {variant.attributes.map((attribute, attrIndex) => (
                                <div
                                    key={attrIndex}
                                    className="p-4 border rounded bg-gray-50 mb-4 space-y-2"
                                >
                                    <div>
                                        <label className="block mb-1 font-medium">Attribute Label</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            value={attribute.attribute_label}
                                            onChange={(e) =>
                                                handleAttributeChange(
                                                    index,
                                                    attrIndex,
                                                    "attribute_label",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Value</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            value={attribute.value}
                                            onChange={(e) =>
                                                handleAttributeChange(index, attrIndex, "value", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Option Label</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            value={attribute.option_label}
                                            onChange={(e) =>
                                                handleAttributeChange(
                                                    index,
                                                    attrIndex,
                                                    "option_label",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Attribute Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            value={attribute.attribute_name}
                                            onChange={(e) =>
                                                handleAttributeChange(
                                                    index,
                                                    attrIndex,
                                                    "attribute_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAttribute(index, attrIndex)}
                                        className="text-red-500 mt-2"
                                    >
                                        Remove Attribute
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddAttribute(index)}
                                className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
                            >
                                Add Attribute
                            </button>
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
