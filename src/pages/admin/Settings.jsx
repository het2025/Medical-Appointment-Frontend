import { useState } from 'react';

const Settings = () => {
    const [clinicProfile, setClinicProfile] = useState({
        name: 'D-Cure Dental Clinic',
        address: '123 Health Street, Vadodara, Gujarat',
        phone: '+91 98765 43210',
        email: 'contact@dcure.com'
    });

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleProfileChange = (e) => {
        setClinicProfile({ ...clinicProfile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const saveProfile = (e) => {
        e.preventDefault();
        alert('Clinic Profile Updated! (Mock Action)');
    };

    const updatePassword = (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert('New passwords do not match');
            return;
        }
        alert('Password Updated Successfully! (Mock Action)');
        setPasswordData({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-dark flex items-center gap-2">
                Settings
            </h2>

            {/* Clinic Profile Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h3 className="text-lg font-bold mb-4 text-primary border-b pb-2">Clinic Profile</h3>
                <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                        <input
                            type="text"
                            name="name"
                            value={clinicProfile.name}
                            onChange={handleProfileChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            name="address"
                            value={clinicProfile.address}
                            onChange={handleProfileChange}
                            rows="2"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={clinicProfile.phone}
                            onChange={handleProfileChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={clinicProfile.email}
                            onChange={handleProfileChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors">
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>

            {/* Security Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-red-600 border-b pb-2">Security</h3>
                <form onSubmit={updatePassword} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            name="current"
                            value={passwordData.current}
                            onChange={handlePasswordChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            name="new"
                            value={passwordData.new}
                            onChange={handlePasswordChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirm"
                            value={passwordData.confirm}
                            onChange={handlePasswordChange}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-black transition-colors">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
