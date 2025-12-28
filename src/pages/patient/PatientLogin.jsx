import { useState } from 'react';
import { usePatientAuth } from '../../context/PatientAuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const PatientLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = usePatientAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/patient-dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            await login(email, password);
            // User Request: Always redirect to Dashboard first
            navigate('/patient-dashboard', { replace: true });
        } catch (err) {
            alert('Login failed: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed bg-no-repeat"
            style={{ backgroundImage: "url('/login & signup_page.jpg')" }}
        >
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Patient Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email" placeholder="Email" required
                        className="w-full p-3 border rounded"
                        value={email} onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password" placeholder="Password" required
                        className="w-full p-3 border rounded"
                        value={password} onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-secondary">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-600">New patient? <Link to="/patient-signup" className="text-primary font-bold">Sign up here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default PatientLogin;
