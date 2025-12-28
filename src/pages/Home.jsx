import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePatientAuth } from '../context/PatientAuthContext';

const Home = () => {
    const { logout } = usePatientAuth();

    useEffect(() => {
        // Force logout when visiting Home (Landing Page)
        logout();
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-cover bg-center"
            style={{ backgroundImage: "url('/landing_page.jpg')" }}
        >
            <div className="bg-white/80 p-12 rounded-xl shadow-2xl backdrop-blur-sm max-w-4xl">
                <h1 className="text-6xl font-extrabold text-blue-900 mb-6 drop-shadow-sm">Your New Smile Starts Here</h1>
                <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto font-medium">
                    Book an appointment today with our expert team.
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <Link to="/book" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:scale-105 transition transform duration-200">
                        Book Appointment
                    </Link>
                    <Link to="/check-booking" className="bg-white text-blue-600 border-2 border-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition transform duration-200 hover:scale-105">
                        Check Booking
                    </Link>
                    <Link to="/login" className="px-10 py-4 text-blue-800 font-semibold hover:underline">
                        Admin Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
