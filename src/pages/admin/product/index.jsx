// pages/admin/product/index.jsx

import ProductTable from '@/components/Table/ProductTable';
import { logout } from '@/utils/logout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Products = () => {
    const router = useRouter();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const profileData = localStorage.getItem('profile');
        if (profileData) {
            setProfile(JSON.parse(profileData));
        }
    }, []);
    const handleLogout = () => {
        logout(router);  // Pass router to the logout function
    };

    return (

        <div className='container p-6'>
            <h1 className='text=[30px] font-bold leading-10'>Produk HP</h1>
            <ProductTable />


        </div>
    );
};

export default Products;
