import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Appointments from './admin/Appointments';
import Patients from './admin/Patients';
import DashboardHome from './admin/DashboardHome';
import Services from './admin/Services';
import Prescriptions from './admin/Prescriptions';
import Settings from './admin/Settings';

const Dashboard = () => {
    const { logout } = useAuth();

    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-64 flex-1 min-h-screen bg-light p-8 relative">
                {/* Top Right Logout */}
                <button
                    onClick={logout}
                    className="absolute top-6 right-8 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm text-red-600 hover:bg-red-50 transition font-medium"
                >
                    <FaSignOutAlt /> Logout
                </button>
                <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/prescriptions" element={<div className="h-full"><Prescriptions /></div>} />
                    <Route path="/settings" element={<div className="h-full"><Settings /></div>} />
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;
