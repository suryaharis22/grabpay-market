import { useState, useEffect } from 'react';
import Router from 'next/router';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';

const Hero = () => {
  const [loading, setLoading] = useState(false);

  // Check if access_token is missing and remove localStorage profile
  useEffect(() => {
    const token = Cookies.get('access_token');

    if (!token) {
      localStorage.removeItem('profile');

      // setTimeout(() => {
      //   Router.push('/login');
      // }, 4000);
    } else {
      setTimeout(() => {
        setLoading(true);
        const profileData = localStorage.getItem('profile');
        if (profileData) {
          const parsedProfile = JSON.parse(profileData);


          if (parsedProfile.role === 'admin') {
            Router.push('/admin').finally(() => setLoading(false));
          } else if (parsedProfile.role === 'user') {
            Router.push('/customer').finally(() => setLoading(false));
          } else {
            Router.push('/login').finally(() => setLoading(false));
          }
        } else {
          setLoading(true);
          Router.push('/login').finally(() => setLoading(false));
        }
      }, 2000);

    }
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[url('/SplashScreen.png')] bg-cover bg-center">
      {loading && <Loading />} {/* Loading indicator */}

      <div className="flex flex-col justify-center items-center mb-20">
        <img src="/Logo_hero.png" className='w-[100px] ' alt="" />
        <h2 className="text-[70px] font-[700] text-center text-white">MARKET</h2>
        <h2 className="text-[25px] font-[275] mb-2 text-center text-white">by Grabpay</h2>
        <button onClick={() => Router.push('/login')} className='bg-warning px-7 py-1 rounded-xl text-[25px] font-[600] hover:scale-105'>Login</button>
      </div>

      <div className="absolute bottom-0  w-[1000px] h-[200px] bg-[url('/2Rectangle.png')] bg-cover bg-center flex flex-col justify-center items-center ">
        <p className="text-[32px] font-[400] mb-4 text-center text-white">Administrator Back Office</p>
        <p className="text-[16px] font-[400] mb-4 text-center text-white">Copyright Grabpay 2024</p>
      </div>
      {/* <div className="absolute bottom-0  w-80 h-40 bg-blue-500 rounded-full"></div> */}



    </div>
  );
};

export default Hero;
