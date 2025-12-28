import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FaCheckCircle, FaClock, FaTimesCircle, FaBan, FaExclamationCircle, FaCopy, FaBell } from 'react-icons/fa';
import { usePatientAuth } from '../context/PatientAuthContext';

const CheckBooking = () => {
    const { patient } = usePatientAuth();
    const [bookingId, setBookingId] = useState('');
    const [email, setEmail] = useState('');
    const [appointment, setAppointment] = useState(null);
    const [myAppointments, setMyAppointments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // If logged in, fetch history
    useEffect(() => {
        if (patient) {
            fetchHistory();
        }
    }, [patient]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('patientToken');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointments/my-history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheck = async (e) => {
        // ... existing handleCheck logic ...
        e.preventDefault();
        setError('');
        setAppointment(null);
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/booking/check`, { bookingId, email });
            setAppointment(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to check booking');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <FaCheckCircle className="text-green-500" />;
            case 'Pending': return <FaClock className="text-yellow-500" />;
            case 'Visited': return <FaCheckCircle className="text-blue-500" />;
            case 'Cancelled': return <FaBan className="text-red-500" />;
            case 'Missed': return <FaExclamationCircle className="text-gray-500" />;
            default: return <FaClock className="text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Visited': return 'bg-blue-100 text-blue-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            case 'Missed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-light">
            <div className="bg-primary text-white py-12 text-center">
                <h1 className="text-4xl font-bold">Check Your Booking</h1>
                <p className="mt-2 text-lg">Enter your Booking ID and email to check your appointment status</p>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {patient ? (
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">My Appointment History</h2>
                        {myAppointments.length === 0 ? (
                            <p className="text-gray-500">No appointments found.</p>
                        ) : (
                            <div className="space-y-4">
                                {myAppointments.map(appt => (
                                    <div key={appt._id} className="border rounded-lg p-4 hover:shadow-md transition bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-lg text-dark">{appt.service}</p>
                                                <p className="text-sm text-gray-600">ID: {appt.bookingId}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(appt.status)}`}>
                                                {getStatusIcon(appt.status)} <span className="ml-1">{appt.status}</span>
                                            </span>
                                        </div>
                                        <div className="mt-3 flex gap-4 text-sm text-gray-700">
                                            <p><FaClock className="inline mr-1" /> {format(new Date(appt.date), 'MMM d, yyyy')} at {format(new Date(appt.slotStart), 'h:mm a')}</p>
                                            <p className="font-semibold text-green-600">₹{appt.totalAmount}</p>
                                        </div>
                                        {/* Cancel Button only for active appointments */}
                                        {['Approved', 'Pending'].includes(appt.status) && (
                                            <div className="mt-3 text-right">
                                                <button
                                                    onClick={async () => {
                                                        if (!window.confirm('Cancel this appointment?')) return;
                                                        try {
                                                            await axios.put(`${import.meta.env.VITE_API_URL}/api/appointments/${appt._id}/cancel`);
                                                            fetchHistory();
                                                        } catch (e) { alert('Failed to cancel'); }
                                                    }}
                                                    className="text-red-500 hover:text-red-700 text-sm underline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
                        <form onSubmit={handleCheck} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Booking ID</label>
                                <input
                                    type="text"
                                    value={bookingId}
                                    onChange={(e) => setBookingId(e.target.value)}
                                    placeholder="e.g., A1B2C3D4"
                                    className="w-full p-3 border rounded-lg focus:outline-primary uppercase"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full p-3 border rounded-lg focus:outline-primary"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition disabled:opacity-50"
                            >
                                {loading ? 'Checking...' : 'Check Status'}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {appointment && (
                            <div className="mt-8 border-t pt-6">
                                <h2 className="text-2xl font-bold text-dark mb-4">Appointment Details</h2>

                                {/* 30-Minute Reminder Logic */}
                                {(() => {
                                    const now = new Date();
                                    const slotStart = new Date(appointment.slotStart);
                                    const diffMs = slotStart - now;
                                    const diffMins = Math.floor(diffMs / 60000);
                                    // Show if within 30 mins and not yet passed (and active status)
                                    if (diffMins > 0 && diffMins <= 30 && ['Approved', 'Pending'].includes(appointment.status)) {
                                        return (
                                            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded flex items-start gap-3 animate-pulse">
                                                <FaBell className="text-blue-500 mt-1 text-xl" />
                                                <div>
                                                    <h4 className="font-bold text-blue-800">Upcoming Appointment Reminder</h4>
                                                    <p className="text-blue-700">Your appointment is in {diffMins} minutes! Please be ready.</p>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-light rounded-lg">
                                        <span className="text-gray-600">Status</span>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(appointment.status)}
                                            <span className={`px-4 py-2 rounded-full font-bold ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between p-4 bg-light rounded-lg">
                                        <span className="text-gray-600">Booking ID</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-primary">{appointment.bookingId}</span>
                                            <button
                                                onClick={() => { navigator.clipboard.writeText(appointment.bookingId); alert('Copied!'); }}
                                                className="text-gray-400 hover:text-primary"
                                            >
                                                <FaCopy />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between p-4 bg-light rounded-lg">
                                        <span className="text-gray-600">Patient Name</span>
                                        <span className="font-bold">{appointment.name}</span>
                                    </div>

                                    <div className="flex justify-between p-4 bg-light rounded-lg">
                                        <span className="text-gray-600">Service</span>
                                        <span className="font-bold">{appointment.service}</span>
                                    </div>

                                    <div className="flex justify-between p-4 bg-light rounded-lg">
                                        <span className="text-gray-600">Date</span>
                                        <span className="font-bold">{format(new Date(appointment.date), 'MMMM d, yyyy')}</span>
                                    </div>

                                    <div className="flex justify-between p-4 bg-light rounded-lg">
                                        <span className="text-gray-600">Time</span>
                                        <span className="font-bold">
                                            {format(new Date(appointment.slotStart), 'h:mm a')} - {format(new Date(appointment.slotEnd), 'h:mm a')}
                                        </span>
                                    </div>

                                    {appointment.notes && (
                                        <div className="p-4 bg-light rounded-lg">
                                            <span className="text-gray-600 block mb-2">Notes</span>
                                            <p className="text-gray-800">{appointment.notes}</p>
                                        </div>
                                    )}

                                    <div className="flex justify-between p-4 bg-light rounded-lg">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className={`font-bold ${appointment.paymentStatus === 'Paid' ? 'text-green-600' : appointment.paymentStatus === 'Refunded' ? 'text-gray-500' : 'text-yellow-600'}`}>
                                            {appointment.paymentStatus || 'Pending'}
                                            {appointment.totalAmount > 0 && ` (₹${appointment.totalAmount})`}
                                        </span>
                                    </div>

                                    {appointment.status === 'Pending' && (
                                        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                            <p className="text-yellow-800">
                                                Your appointment is pending confirmation. We'll update you shortly!
                                            </p>
                                        </div>
                                    )}

                                    {appointment.status === 'Approved' && (
                                        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                                            <p className="text-green-800">
                                                Your appointment has been confirmed! Please arrive 10 minutes early.
                                            </p>
                                        </div>
                                    )}

                                    {appointment.status === 'Cancelled' && (
                                        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                                            <p className="text-red-800">
                                                This appointment has been cancelled. Please contact us if you have questions.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                {appointment.status !== 'Cancelled' && appointment.status !== 'Visited' && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={async () => {
                                                if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
                                                try {
                                                    await axios.put(`${import.meta.env.VITE_API_URL}/api/appointments/${appointment._id}/cancel`);
                                                    // Refresh
                                                    handleCheck({ preventDefault: () => { } });
                                                    alert('Appointment cancelled successfully. Refund initiated.');
                                                } catch (err) {
                                                    alert('Failed to cancel');
                                                }
                                            }}
                                            className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded hover:bg-red-100 transition"
                                        >
                                            Cancel Appointment
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Navigation Helper */}
            <div className="fixed top-4 right-4">
                <a href="/patient-dashboard" className="text-primary hover:underline font-bold bg-white px-4 py-2 rounded shadow">
                    Go to Dashboard
                </a>
            </div>
        </div>
    );
};

export default CheckBooking;
