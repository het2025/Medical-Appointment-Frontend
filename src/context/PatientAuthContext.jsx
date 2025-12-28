import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const PatientAuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const PatientAuthProvider = ({ children }) => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Guard: Skip API call if URL not configured
        if (!API_URL) {
            console.error('VITE_API_URL is not configured!');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('patientToken');
        if (token) {
            axios.get(`${API_URL}/api/patient-auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setPatient(res.data))
                .catch(() => localStorage.removeItem('patientToken'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        if (!API_URL) {
            throw new Error('API URL is not configured. Please set VITE_API_URL in Vercel environment variables.');
        }
        const res = await axios.post(`${API_URL}/api/patient-auth/login`, { email, password });
        localStorage.setItem('patientToken', res.data.token);
        setPatient(res.data.patient);
        return res.data;
    };

    const signup = async (formData) => {
        if (!API_URL) {
            throw new Error('API URL is not configured. Please set VITE_API_URL in Vercel environment variables.');
        }
        const res = await axios.post(`${API_URL}/api/patient-auth/signup`, formData);
        localStorage.setItem('patientToken', res.data.token);
        setPatient(res.data.patient);
    };

    const logout = () => {
        localStorage.removeItem('patientToken');
        setPatient(null);
    };

    return (
        <PatientAuthContext.Provider value={{ patient, login, signup, logout, loading }}>
            {children}
        </PatientAuthContext.Provider>
    );
};

export const usePatientAuth = () => useContext(PatientAuthContext);
