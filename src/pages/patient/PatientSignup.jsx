import { useState } from 'react';
import { usePatientAuth } from '../../context/PatientAuthContext';
import { useNavigate } from 'react-router-dom';

const PatientSignup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const { signup } = usePatientAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            navigate('/patient-dashboard');
        } catch (err) {
            alert('Signup failed: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed bg-no-repeat"
            style={{ backgroundImage: "url('/login & signup_page.jpg')" }}
        >
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text" placeholder="Full Name" required
                        className="w-full p-3 border rounded"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="email" placeholder="Email" required
                        className="w-full p-3 border rounded"
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="tel" placeholder="Phone Number" required
                        className="w-full p-3 border rounded"
                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <input
                        type="password" placeholder="Password" required
                        className="w-full p-3 border rounded"
                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-secondary">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientSignup;
