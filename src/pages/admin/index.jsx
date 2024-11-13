// pages/admin.js

import ProductTable from '@/components/Table/ProductTable';
import { logout } from '@/utils/logout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AdminPage = () => {
    const router = useRouter();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const profileData = localStorage.getItem('profile');
        if (profileData) {
            setProfile(JSON.parse(profileData));
        }
    }, []);

    return (
        <div className='container p-6'>
            <h1 className='text=[30px] font-bold leading-10'>Produk HP</h1>
            <ProductTable />


        </div>
    );
};

export default AdminPage;
