// pages/_app.js
import { useRouter } from 'next/router';
import '../styles/globals.css';  // Import Tailwind CSS
import { useEffect, useState } from 'react';
import DashboardLayoutAdmin from '@/layout/DashboardLayoutAdmin'; // Admin Layout
import DashboardLayoutCustomer from '@/layout/DashboardLayoutCustomer'; // Customer Layout

function App({ Component, pageProps }) {
  const router = useRouter();

  // Define routes where no layout is required
  const noLayoutRequired = ['/', '/login', '/registrasi'];
  const isNoLayoutRoute = noLayoutRequired.includes(router.pathname);

  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve profile from localStorage
    const profileData = localStorage.getItem('profile');

    if (profileData) {
      const profile = JSON.parse(profileData);
      setRole(profile.role);  // Set role if profile is found
    } else if (!isNoLayoutRoute) {
      router.push('/login'); // Redirect to login if no profile found
    }

    setIsLoading(false); // Finish loading once profile is fetched
  }, [router, isNoLayoutRoute]);

  if (isLoading) {
    return <div>Loading...</div>;  // Optional loading spinner
  }

  // Render Component directly for routes without layout
  if (isNoLayoutRoute) {
    return <Component {...pageProps} />;
  }

  // Conditional rendering based on role
  if (role === 'admin') {
    return (
      <DashboardLayoutAdmin>
        <Component {...pageProps} />
      </DashboardLayoutAdmin>
    );
  } else if (role === 'user') {
    return (
      <DashboardLayoutCustomer>
        <Component {...pageProps} />
      </DashboardLayoutCustomer>
    );
  }

  // If role is undefined or invalid, redirect to login
  return <div>Redirecting to login...</div>;
}

export default App;
