import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight } from "lucide-react";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Check for existing token on component mount
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            navigate('/admin-portal'); // Redirect if token exists
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'admin123@gmail.com' && password === 'admin123') {
            const token = generateJWT();
            localStorage.setItem('jwt', token); // Save token after successful login
            navigate('/admin-portal'); // Redirect to admin dashboard
        } else {
            setError('Invalid credentials, please try again');
        }
    };

    const generateJWT = () => {
        return 'mock-jwt-token'; // Replace this with real JWT logic
    };

    return (
        <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
            {/* Full Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-50"
                style={{
                    backgroundImage: "url('https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm0yMThiYXRjaDQta2F0aWUtMTcuanBn.jpg')"
                }}
            ></div>

            <motion.div 
                className="relative z-10 flex items-center justify-center px-4 w-full sm:max-w-md lg:max-w-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-white/80 shadow-2xl rounded-lg w-full p-6 sm:p-8 lg:p-10 border border-white/30 transform hover:scale-105 transition-transform duration-300">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Admin Portal</h2>
                        <p className="text-gray-600 text-sm sm:text-base">Secure Access Required</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm sm:text-base"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm sm:text-base"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <motion.p 
                                className="text-red-600 text-xs sm:text-sm text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {error}
                            </motion.p>
                        )}

                        <button 
                            type="submit" 
                            className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 sm:py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition group text-sm sm:text-base"
                        >
                            Login
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition" size={20} />
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* Additional Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-10 left-10 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-2xl animate-blob"></div>
                <div className="absolute bottom-10 right-10 w-20 h-20 sm:w-32 sm:h-32 bg-purple-500/10 rounded-full blur-2xl animate-blob animation-delay-4000"></div>
            </div>
        </div>
    );
};

export default LoginPage;
