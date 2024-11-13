// pages/admin/product/index.jsx

import PackageTable from '@/components/Table/PackageTable';
import { logout } from '@/utils/logout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AdminPage = () => {
    const router = useRouter();
    return (
        <div className='container p-6'>
            <h1 className='text=[30px] font-bold leading-10'>Paket</h1>

            <PackageTable />

        </div>
    );
};

export default AdminPage;
