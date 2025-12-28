import { usePatientAuth } from '../../context/PatientAuthContext';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaCalendarPlus, FaListAlt, FaSignOutAlt } from 'react-icons/fa';

const PatientDashboard = () => {
    const { patient, logout } = usePatientAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex bg-light">
            {/* Sidebar */}
            <div className="w-64 bg-white/95 shadow-lg flex flex-col backdrop-blur-sm">
                <div className="p-6 border-b">
                    <img src="/DCURE.svg" alt="DCURE Logo" className="h-20 w-auto" />
                    <p className="text-sm text-gray-500">Welcome, {patient?.name}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/book" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded transition">
                        <FaCalendarPlus /> Book Appointment
                    </Link>
                    <Link to="/check-booking" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded transition">
                        <FaListAlt /> Check Status
                    </Link>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 bg-white/80 backdrop-blur-sm m-4 rounded-xl shadow-inner overflow-y-auto relative">
                {/* Top Right Logout */}
                <button
                    onClick={handleLogout}
                    className="absolute top-4 right-4 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm text-red-600 hover:bg-red-50 transition font-medium z-10"
                >
                    <FaSignOutAlt /> Logout
                </button>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/book')}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600"><FaCalendarPlus size={24} /></div>
                            <h3 className="text-xl font-bold">Book New Appointment</h3>
                        </div>
                        <p className="text-gray-600">Find a doctor and schedule your visit.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/check-booking')}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-100 rounded-full text-green-600"><FaListAlt size={24} /></div>
                            <h3 className="text-xl font-bold">Check Status</h3>
                        </div>
                        <p className="text-gray-600">View your upcoming appointments and history.</p>
                    </div>
                </div>

                {/* Dashboard Image */}
                <div className="w-full rounded-xl overflow-hidden shadow-sm">
                    <img
                        src="/patient_dashboard.jpg"
                        alt="Dashboard Illustration"
                        className="w-full h-auto object-contain max-h-[60vh]"
                    />
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
