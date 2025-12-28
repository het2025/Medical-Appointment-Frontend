import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        pending: 0,
        today: 0,
        total: 0,
        patients: 0,
        cancelled: 0,
        todayCompleted: 0
    });
    const [recentAppts, setRecentAppts] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const [statsRes, recentRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/appointments/dashboard/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:5000/api/appointments/dashboard/recent', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                console.log('Stats Response:', statsRes.data);
                console.log('Recent Response:', recentRes.data);

                setStats(statsRes.data);
                setRecentAppts(recentRes.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ count, label, color }) => (
        <div className={`${color} text-white p-6 rounded-lg shadow-md flex items-center justify-between`}>
            <div>
                <h3 className="text-4xl font-bold">{count}</h3>
                <p className="text-sm opacity-90">{label}</p>
            </div>
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-dark">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard count={stats.today} label="Today's Appointments" color="bg-blue-500" />
                <StatCard count={stats.todayCompleted} label="Today Completed" color="bg-teal-500" />
                <StatCard count={stats.pending} label="Pending" color="bg-orange-500" />
                <StatCard count={stats.cancelled} label="Cancelled" color="bg-red-500" />
                <StatCard count={stats.total} label="Total Bookings" color="bg-indigo-500" />
                <StatCard count={stats.patients} label="Total Patients" color="bg-purple-500" />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-primary">Recent Appointments</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-gray-500">
                            <th className="py-2">Date</th>
                            <th className="py-2">Time</th>
                            <th className="py-2">Name</th>
                            <th className="py-2">Contact</th>
                            <th className="py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentAppts.length === 0 ? (
                            <tr><td colSpan="5" className="py-4 text-center text-gray-500">No appointments found.</td></tr>
                        ) : (
                            recentAppts.map(appt => (
                                <tr key={appt._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3">{format(new Date(appt.date), 'MMM d, yyyy')}</td>
                                    <td className="py-3">{format(new Date(appt.slotStart), 'h:mm a')}</td>
                                    <td className="py-3 font-medium">{appt.guestDetails?.name || 'Patient'}</td>
                                    <td className="py-3">{appt.guestDetails?.phone}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold 
                                            ${appt.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                appt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    appt.status === 'Visited' ? 'bg-blue-100 text-blue-700' :
                                                        appt.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardHome;
