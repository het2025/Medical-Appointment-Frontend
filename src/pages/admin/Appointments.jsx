import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { format } from 'date-fns';
import { useSocket } from '../../context/SocketContext';
import { FaLock } from 'react-icons/fa';

const Appointments = () => {
    const [date, setDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const socket = useSocket();

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/appointments?date=${date.toISOString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [date]);

    useEffect(() => {
        if (!socket) return;
        socket.on('new_appointment', (appt) => {
            // Refresh if the new appointment is on the selected date
            if (new Date(appt.date).toDateString() === date.toDateString()) {
                fetchAppointments();
            }
        });
        socket.on('appointment_updated', fetchAppointments);

        return () => {
            socket.off('new_appointment');
            socket.off('appointment_updated');
        };
    }, [socket, date]);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/appointments/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Socket will trigger refresh
        } catch (err) {
            alert('Error updating status');
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full">
            <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-sm h-fit">
                <Calendar onChange={setDate} value={date} className="w-full border-none" />
            </div>

            <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-primary">Appointments for {format(date, 'MMMM d, yyyy')}</h2>
                </div>

                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No appointments for this date.</p>
                    ) : (
                        appointments.map((appt) => (
                            <div key={appt._id} className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition">
                                <div>
                                    <h3 className="font-bold text-lg">{appt.guestDetails?.name || appt.patient?.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {format(new Date(appt.slotStart), 'h:mm a')} - {format(new Date(appt.slotEnd), 'h:mm a')}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{appt.service}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                    ${appt.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : ''}
                    ${appt.status === 'Approved' ? 'bg-green-100 text-green-600' : ''}
                    ${appt.status === 'Cancelled' ? 'bg-red-100 text-red-600' : ''}
                    ${appt.status === 'Visited' ? 'bg-blue-100 text-blue-600' : ''}
                    ${appt.status === 'Missed' ? 'bg-gray-100 text-gray-600' : ''}
                  `}>
                                        {appt.status}
                                    </span>

                                    {appt.status === 'Visited' ? (
                                        <div className="flex items-center gap-2 text-gray-500 mt-2 bg-gray-100 px-3 py-1 rounded">
                                            <FaLock />
                                            <span className="text-sm font-semibold">Locked</span>
                                        </div>
                                    ) : (
                                        <select
                                            className="text-sm border rounded p-1 mt-2"
                                            value={appt.status}
                                            onChange={(e) => updateStatus(appt._id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Visited">Visited</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Appointments;
