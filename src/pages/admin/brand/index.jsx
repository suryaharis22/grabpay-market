// pages/admin/product/index.jsx

import BrandTable from '@/components/Table/BrandTable';
import { logout } from '@/utils/logout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Brands = () => {
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
            <h1 className='text=[30px] font-bold leading-10'>Brands HP</h1>
            <BrandTable />


        </div>
    );
};

export default Brands;
