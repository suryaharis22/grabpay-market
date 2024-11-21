import { useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Check if access_token is missing and remove localStorage profile
    useEffect(() => {
        const token = Cookies.get('access_token');
        if (!token) {
            localStorage.removeItem('profile');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/auth/login`, {
                email,
                password,
            });

            const { access_token } = response.data.body;

            // Save token in cookies
            Cookies.set('access_token', access_token, { expires: 1 }); // Token saved for 1 day

            // Get profile data
            const profileResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/auth/profile/fetch`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            // Save profile data in localStorage
            localStorage.setItem('profile', JSON.stringify(profileResponse.data.body));

            // Redirect based on role
            const { role } = profileResponse.data.body;
            if (role === 'admin') {
                Router.push('/admin');
            } else if (role === 'user') {
                Router.push('/customer');
            }
        } catch (error) {
            setError('Login failed. Please check your credentials.');
            setLoading(false);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 3000);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <div
                className="md:w-1/2 w-full bg-center bg-[url('/SplashScreen.png')] bg-cover bg-center"
            >
                <div className="w-[201px] m-4">
                    <img src="/Logo_login.png" alt="Logo" className="w-full bg-cover" />
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center bg-white md:bg-gray-100 h-screen">
                <div className="bg-white md:shadow-lg md:rounded-lg p-6 sm:p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-600 font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 block w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Input Password */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-600 font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 block w-full p-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Link Lupa Password */}
                        <div className="flex justify-end items-center mb-4">
                            <a href="#" className="text-sm text-blue-500 hover:underline">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Tombol Login */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full font-bold py-3 rounded-lg transition duration-300 ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 animate-spin text-white mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Loading...
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    {/* Teks Daftar Akun */}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        {`Don't have an account? `}
                        <a href="#" className="text-blue-500 hover:underline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
            {loading && <Loading />}
        </div>
    );

};

export default Login;
