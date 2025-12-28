import { Link, useLocation } from 'react-router-dom';
import { FaThLarge, FaCalendarAlt, FaUserInjured, FaFilePrescription, FaCog, FaSignOutAlt, FaBriefcase } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: FaThLarge, path: '/admin' },
        { name: 'Appointment', icon: FaCalendarAlt, path: '/admin/appointments' },
        { name: 'Patients', icon: FaUserInjured, path: '/admin/patients' },
        { name: 'Prescriptions', icon: FaFilePrescription, path: '/admin/prescriptions' },
        { name: 'Services', icon: FaBriefcase, path: '/admin/services' },
        { name: 'Setting', icon: FaCog, path: '/admin/settings' },
    ];

    return (
        <div className="w-64 bg-gradient-to-b from-primary to-secondary h-screen text-white fixed left-0 top-0 flex flex-col">
            <div className="p-6 flex justify-center">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                    <img src="/DCURE.svg" alt="DCURE Logo" className="h-16 w-auto" />
                </div>
            </div>
            <nav className="flex-1 mt-6">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center px-6 py-4 hover:bg-white/10 transition ${location.pathname === item.path ? 'bg-white/20 border-l-4 border-white' : ''
                            }`}
                    >
                        <item.icon className="mr-4 text-xl" />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>
            {/* Logout removed */}
        </div>
    );
};

export default Sidebar;
