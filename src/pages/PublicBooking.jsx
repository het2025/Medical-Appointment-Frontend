import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { format } from 'date-fns';
import { FaSearch, FaMapMarkerAlt, FaCopy } from 'react-icons/fa';
import { usePatientAuth } from '../context/PatientAuthContext';

const PublicBooking = () => {
    const { patient } = usePatientAuth();
    const [date, setDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', serviceId: '' });

    // New State
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filters, setFilters] = useState({ category: '', location: '', search: '' });
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Slots generation (could be dynamic based on Service duration, but keeping simple for now)
    const generateSlots = (duration = 60) => {
        // Simple hardcoded slots for Demo, ideally dependent on duration
        return [
            { start: '08:00', end: '09:00' },
            { start: '09:00', end: '10:00' },
            { start: '10:00', end: '11:00' },
            { start: '11:00', end: '12:00' },
            { start: '14:00', end: '15:00' },
            { start: '15:00', end: '16:00' },
            { start: '16:00', end: '17:00' },
        ];
    };
    const [slots, setSlots] = useState(generateSlots());

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (date) {
            fetchAvailability(date);
        }
    }, [date]);

    useEffect(() => {
        filterServices();
    }, [filters, services]);

    const fetchAvailability = async (selectedDate) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointments/availability?date=${selectedDate.toISOString()}`);
            setBookedSlots(res.data);
        } catch (err) {
            console.error('Failed to fetch availability');
        }
    };

    const fetchServices = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/services`);
            setServices(res.data);
            setFilteredServices(res.data);

            // Extract unique categories and locations
            const cats = [...new Set(res.data.map(s => s.category))];

            // Ensure Vadodara is in locations if not already + backend locations
            const backendLocs = res.data.map(s => s.location).filter(Boolean);
            const locs = [...new Set(['Vadodara', ...backendLocs])];

            setCategories(cats);
            setLocations(locs);
        } catch (err) {
            console.error('Failed to fetch services');
        }
    };

    const filterServices = () => {
        let temp = services;
        if (filters.category) temp = temp.filter(s => s.category === filters.category);
        if (filters.location && filters.location !== 'Vadodara') {
            // Only filter strict location if it's not our "Vadodara" default unless services actually specify it.
            // If user selects Vadodara, show services in Vadodara or All (empty location)
            temp = temp.filter(s => s.location === filters.location || !s.location);
        } else if (filters.location === 'Vadodara') {
            // Show services in Vadodara or generic (null)
            temp = temp.filter(s => !s.location || s.location === 'Vadodara');
        }

        if (filters.search) temp = temp.filter(s => s.name.toLowerCase().includes(filters.search.toLowerCase()));
        setFilteredServices(temp);
    };

    const isSlotBooked = (slot) => {
        if (!bookedSlots.length) return false;

        const [sH, sM] = slot.start.split(':');

        return bookedSlots.some(b => {
            // Check time match AND service match (if filtered). 
            // If no filter selected, maybe show 'some booked'? But user wants specific booking.
            // If I am looking at a Service Card, 'isSlotBooked' is likely iterating slots for THAT service card?
            // Actually, `slots` is a generic array mapped in the Service Card.
            // But `isSlotBooked` is defined at top level. We should pass `service` to it.
            return false; // See calling code change below
        });
    };

    // Updated helper to take serviceId
    const isSlotBookedForService = (slot, serviceId) => {
        if (!bookedSlots.length) return false;
        const [sH, sM] = slot.start.split(':');

        return bookedSlots.some(b => {
            const bStart = new Date(b.slotStart);
            const bH = bStart.getHours();
            const bM = bStart.getMinutes();
            // Match Time AND Service
            return bH === parseInt(sH) && bM === parseInt(sM) && b.serviceId === serviceId;
        });
    };

    const handleBook = (slot, service) => {
        setSelectedSlot(slot);
        setSelectedService(service);
        setFormData({ ...formData, serviceId: service._id });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const [startH, startM] = selectedSlot.start.split(':');
            const [endH, endM] = selectedSlot.end.split(':');

            const slotStart = new Date(date);
            slotStart.setHours(startH, startM, 0);

            const slotEnd = new Date(date);
            slotEnd.setHours(endH, endM, 0);

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/appointments`, {
                date,
                slotStart,
                slotEnd,
                serviceId: selectedService._id,
                service: selectedService.name, // Fallback
                guestDetails: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                },
                patientId: patient?._id || null
            });

            setBookingId(response.data.bookingId);
            setShowModal(false);
            setShowConfirmation(true);
        } catch (err) {
            alert('Booking Failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-primary text-white py-12 text-center relative">
                <h1 className="text-4xl font-bold">Find & Book Appointment</h1>
                <p className="mt-2 text-lg">Search for services, check availability, and book instantly</p>

                {/* Search Bar */}
                {/* Search Bar Removed from this line per request */}
                <div className="mt-8 max-w-2xl mx-auto px-4 relative z-20">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 text-gray-800 justify-center">
                        <div className="flex-1 flex items-center border rounded px-3 bg-gray-50">
                            {/* Removed Icon */}
                            <select
                                className="bg-transparent w-full p-2 outline-none"
                                value={filters.category}
                                onChange={e => setFilters({ ...filters, category: e.target.value })}
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 flex items-center border rounded px-3 bg-gray-50">
                            <FaMapMarkerAlt className="text-gray-400 mr-2" />
                            <select
                                className="bg-transparent w-full p-2 outline-none"
                                value={filters.location}
                                onChange={e => setFilters({ ...filters, location: e.target.value })}
                            >
                                <option value="">All Locations</option>
                                {locations.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Calendar Selection */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 sticky top-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Select Date</h3>
                            <Calendar
                                onChange={setDate}
                                value={date}
                                minDate={new Date()}
                                className="border-none w-full"
                            />
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-sm text-gray-600">Selected Date:</p>
                                <p className="font-bold text-lg text-primary">{format(date, 'MMMM d, yyyy')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Available Services & Slots */}
                    <div className="w-full md:w-2/3">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Services</h2>

                        {filteredServices.length === 0 ? (
                            <p className="text-gray-500 text-center py-10">No services found matching your criteria.</p>
                        ) : (
                            <div className="space-y-6">
                                {filteredServices.map(service => (
                                    <div key={service._id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-secondary">{service.name}</h3>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 inline-block">{service.category}</span>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 inline-block ml-2">{service.location || 'All Locations'}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-primary">₹{service.price}</p>
                                                <p className="text-xs text-gray-500">+₹{(service.price * service.taxRate / 100).toFixed(2)} Tax</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-4 text-sm">{service.description || 'Professional dental service.'}</p>

                                        <div className="mt-4">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Available Slots ({service.duration} mins):</p>
                                            <div className="flex flex-wrap gap-2">
                                                {slots.map((slot, idx) => {
                                                    const booked = isSlotBookedForService(slot, service._id);
                                                    return (
                                                        <button
                                                            key={idx}
                                                            disabled={booked}
                                                            onClick={() => handleBook(slot, service)}
                                                            className={`px-3 py-1 text-sm rounded border ${booked
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed decoration-slice'
                                                                : 'bg-white text-primary border-primary hover:bg-primary hover:text-white'
                                                                }`}
                                                        >
                                                            {slot.start} {booked && '(Booked)'}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking & Payment Modal */}
            {showModal && selectedService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg">
                        <h3 className="text-2xl font-bold text-primary mb-2">Confirm Booking</h3>
                        <p className="text-gray-600 mb-6">Completing payment for <strong>{selectedService.name}</strong></p>

                        <div className="bg-gray-50 p-4 rounded mb-6 text-sm">
                            <div className="flex justify-between mb-1">
                                <span>Date:</span>
                                <span className="font-semibold">{format(date, 'MMMM d, yyyy')}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span>Time:</span>
                                <span className="font-semibold">{selectedSlot.start} - {selectedSlot.end}</span>
                            </div>
                            <div className="border-t my-2 pt-2 flex justify-between font-bold text-lg">
                                <span>Total to Pay:</span>
                                <span>₹{(selectedService.price + (selectedService.price * selectedService.taxRate / 100)).toFixed(2)}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text" placeholder="Your Name" required
                                className="w-full p-3 border rounded focus:outline-primary"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text" placeholder="Phone Number" required
                                    className="w-full p-3 border rounded focus:outline-primary"
                                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <input
                                    type="email" placeholder="Email" required
                                    className="w-full p-3 border rounded focus:outline-primary"
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {/* Mock Payment UI */}
                            <div className="border rounded p-4 mt-4">
                                <p className="font-semibold mb-2 text-gray-700">Payment Details (Mock)</p>
                                <input type="text" disabled value="**** **** **** 4242" className="w-full p-2 bg-gray-100 border rounded mb-2 text-gray-500" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" disabled value="12/28" className="w-full p-2 bg-gray-100 border rounded text-gray-500" />
                                    <input type="text" disabled value="123" className="w-full p-2 bg-gray-100 border rounded text-gray-500" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary text-white rounded font-bold hover:bg-secondary">Pay & Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">Your appointment has been confirmed.</p>

                        <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 mb-6 relative">
                            <p className="text-sm text-gray-600 mb-2">Booking ID</p>
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-4xl font-bold text-primary tracking-wider">{bookingId}</p>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(bookingId); alert('Copied!'); }}
                                    className="text-gray-500 hover:text-primary transition"
                                    title="Copy Booking ID"
                                >
                                    <FaCopy size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => window.location.href = '/check-booking'} className="flex-1 bg-white border-2 border-primary text-primary py-3 rounded font-bold">Check Status</button>
                            <button onClick={() => { setShowConfirmation(false); setBookingId(''); }} className="flex-1 bg-primary text-white py-3 rounded font-bold">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicBooking;
