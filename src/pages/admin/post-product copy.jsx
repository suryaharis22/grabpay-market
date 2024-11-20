import { useState } from 'react';
import axios from 'axios';

export default function PostProduct() {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        is_available: true,
        screen: '',
        rear_camera: '',
        front_camera: '',
        processor: '',
        battery: '',
        thumbnail: '',
        brand_id: '',
        bundling_id: '',
        variants: [
            {
                price: '',
                discount: '',
                stock: '',
                warranty: '',
                media_galleries: [],
                attributes: [],
            },
        ],
    });

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [mediaGalleryFiles, setMediaGalleryFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (event, type) => {
        if (type === 'thumbnail') {
            setThumbnailFile(event.target.files[0]);
        } else if (type === 'media_galleries') {
            setMediaGalleryFiles([...event.target.files]);
        }
    };

    const uploadImage = async (file, destination) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('destination', destination);

        try {
            const response = await axios.post(
                'https://api.bundling.nuncorp.id/api/v1/media/upload-media',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data.body; // Return the `body` containing file details
        } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            // Step 1: Upload thumbnail
            let thumbnailResponse = null;
            if (thumbnailFile) {
                thumbnailResponse = await uploadImage(thumbnailFile, 'product');
            }

            // Step 2: Upload media galleries
            const uploadedMedia = [];
            for (const file of mediaGalleryFiles) {
                const mediaData = await uploadImage(file, 'product');
                uploadedMedia.push({
                    file_name: mediaData.file_name,
                    file: mediaData.file,
                    media_type: mediaData.media_type,
                });
            }

            // Step 3: Update productData with uploaded file details
            const updatedProductData = {
                ...productData,
                thumbnail: thumbnailResponse ? thumbnailResponse.file : '',
                variants: [
                    {
                        ...productData.variants[0],
                        media_galleries: uploadedMedia,
                    },
                ],
            };

            // Step 4: Submit product data
            const response = await axios.post(
                'https://api.bundling.nuncorp.id/api/v1/product/create-product',
                updatedProductData,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            alert('Product uploaded successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Product submission failed:', error);
            alert('Failed to upload product.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-4">Post Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Information */}
                <div>
                    <label className="block mb-2 font-medium">Product Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={productData.name}
                        onChange={(e) =>
                            setProductData({ ...productData, name: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                        className="w-full p-2 border rounded"
                        value={productData.description}
                        onChange={(e) =>
                            setProductData({ ...productData, description: e.target.value })
                        }
                    ></textarea>
                </div>

                {/* Thumbnail Upload */}
                <div>
                    <label className="block mb-2 font-medium">Thumbnail</label>
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                        className="w-full p-2 border rounded"
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

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Product'}
                </button>
            </form>
        </div>
    );
}
