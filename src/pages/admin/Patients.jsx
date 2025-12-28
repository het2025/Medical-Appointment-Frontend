import { useState, useEffect } from 'react';
import axios from 'axios';

import { FaHistory, FaTimes } from 'react-icons/fa';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPatients();
    }, []);

    const fetchHistory = async (patient) => {
        setSelectedPatient(patient);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/prescriptions/patient/${patient._id}`);
            setHistory(res.data);
            setShowHistory(true);
        } catch (err) {
            alert('Failed to fetch history');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-primary">All Patients</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-light text-gray-600">
                            <th className="p-3 rounded-l-lg">Sr. No</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Gender</th>
                            <th className="p-3">Age</th>
                            <th className="p-3">Weight</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Weight</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Address</th>
                            <th className="p-3 rounded-r-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient, idx) => (
                            <tr key={patient._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{idx + 1}</td>
                                <td className="p-3 font-semibold">{patient.name}</td>
                                <td className="p-3">{patient.gender || '-'}</td>
                                <td className="p-3">{patient.age || '-'}</td>
                                <td className="p-3">{patient.weight || '-'}</td>
                                <td className="p-3">{patient.phone}</td>
                                <td className="p-3">{patient.address || '-'}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => fetchHistory(patient)}
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-semibold"
                                    >
                                        <FaHistory /> History
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500">No patients found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {
                showHistory && selectedPatient && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-primary">History: {selectedPatient.name}</h3>
                                <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-red-500"><FaTimes size={24} /></button>
                            </div>

                            <div className="space-y-4">
                                {history.length === 0 ? (
                                    <p className="text-gray-500 text-center">No history found.</p>
                                ) : (
                                    history.map(p => (
                                        <div key={p._id} className="border p-4 rounded bg-gray-50">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-gray-700">{new Date(p.createdAt).toLocaleDateString()}</span>
                                                {p.appointmentId && <span className="text-xs text-gray-500">Appt ID: {p.appointmentId.bookingId || 'N/A'}</span>}
                                            </div>
                                            <div className="text-sm grid grid-cols-3 gap-2 mb-2">
                                                <span>Age: {p.age}</span>
                                                <span>Wt: {p.weight}</span>
                                                <span>BP: {p.bp}</span>
                                            </div>
                                            <div className="bg-white p-2 rounded border">
                                                <p className="font-semibold text-xs text-gray-500 uppercase">Prescription</p>
                                                <p className="whitespace-pre-wrap">{p.prescription}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Patients;
