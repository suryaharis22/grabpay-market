// pages/admin/product/index.jsx

import PackageTable from '@/components/Table/PackageTable';
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
    const handleLogout = () => {
        logout(router);  // Pass router to the logout function
    };

    return (
        <div className='container p-6'>
            <h1 className='text=[30px] font-bold'>Paket</h1>

            <PackageTable />

        </div>
    );
};

export default AdminPage;
