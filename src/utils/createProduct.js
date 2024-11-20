import axios from 'axios';
import FormData from 'form-data';

// Helper function untuk upload file ke server
const uploadMedia = async (file, destination) => {
    console.log('Uploading media...');

    const data = new FormData();
    data.append('file', file);
    data.append('destination', destination);

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.bundling.nuncorp.id/api/v1/media/upload-media',
        headers: {
            ...data.getHeaders(),
        },
        data: data,
    };

    try {
        const response = await axios.request(config);

        // Cek apakah upload berhasil dan ambil URL file
        if (response.data.code === 200) {
            return response.data.body.file; // URL file yang berhasil diupload
        } else {
            throw new Error('Failed to upload media');
        }
    } catch (error) {
        console.error('Error uploading media:', error);
        throw error;
    }
};

// Helper function untuk create product
export const createProduct = async (productData) => {
    try {
        // Upload Thumbnail terlebih dahulu
        const thumbnailUrl = await uploadMedia(productData.thumbnail, 'product');

        // Update product data dengan URL thumbnail yang sudah diupload
        productData.thumbnail = thumbnailUrl;

        // Upload media galleries untuk setiap variant
        for (let i = 0; i < productData.variants.length; i++) {
            const variant = productData.variants[i];

            if (variant.media_galleries.length > 0) {
                const mediaGalleryUrls = [];

                // Proses upload untuk setiap gambar di media_galleries
                for (let file of variant.media_galleries) {
                    const mediaUrl = await uploadMedia(file, 'variant_media');
                    mediaGalleryUrls.push({
                        file_name: file.name, // Ambil nama file
                        file: mediaUrl, // URL file yang diupload
                        media_type: file.type, // Jenis file (image/jpeg, dll.)
                    });
                }

                // Update media galleries untuk variant dengan URL yang baru
                productData.variants[i].media_galleries = mediaGalleryUrls;
            }
        }

        // Setelah upload selesai, kirim data produk ke API
        const productDataToSend = {
            ...productData,
        };

        // Example: POST to API untuk create product
        const createProductResponse = await axios.post(
            'https://api.bundling.nuncorp.id/api/v1/product/create-product',
            productDataToSend
        );

        console.log('Product created successfully:', createProductResponse.data);
        return createProductResponse.data; // Mengembalikan respons produk yang berhasil dibuat
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};
