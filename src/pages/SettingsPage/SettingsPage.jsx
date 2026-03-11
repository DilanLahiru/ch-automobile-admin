import React, { useState } from 'react';
import { Lock, History, Save, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('password');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  const [repairHistory, setRepairHistory] = useState([
    {
      id: 1,
      date: '2024-03-01',
      vehicleInfo: 'Toyota Corolla - ABC123',
      issue: 'Engine Oil Change',
      status: 'Completed',
      cost: 2500,
    },
    {
      id: 2,
      date: '2024-02-15',
      vehicleInfo: 'Honda City - XYZ789',
      issue: 'Brake Pad Replacement',
      status: 'Completed',
      cost: 5000,
    },
  ]);

  const [newRepair, setNewRepair] = useState({
    date: '',
    vehicleInfo: '',
    issue: '',
    cost: '',
  });
  const [showAddRepair, setShowAddRepair] = useState(false);

  // Password Change Handler
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: '' });

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMessage({ text: 'All fields are required', type: 'error' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ text: 'New password must be at least 6 characters', type: 'error' });
      return;
    }

    setIsLoadingPassword(true);

    try {
      // TODO: Replace with actual API call
      // const response = await axios.post(`${baseUrl}/api/user/change-password`, passwordData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordMessage({ text: 'Password changed successfully!', type: 'success' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setPasswordMessage({ text: error.response?.data?.message || 'Failed to change password', type: 'error' });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  // Repair History Handlers
  const handleAddRepair = (e) => {
    const { name, value } = e.target;
    setNewRepair(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitRepair = async (e) => {
    e.preventDefault();

    if (!newRepair.date || !newRepair.vehicleInfo || !newRepair.issue || !newRepair.cost) {
      alert('All fields are required');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const response = await axios.post(`${baseUrl}/api/repair-history/add`, newRepair);
      
      const repairEntry = {
        id: repairHistory.length + 1,
        date: newRepair.date,
        vehicleInfo: newRepair.vehicleInfo,
        issue: newRepair.issue,
        status: 'Pending',
        cost: parseFloat(newRepair.cost),
      };

      setRepairHistory(prev => [repairEntry, ...prev]);
      setNewRepair({ date: '', vehicleInfo: '', issue: '', cost: '' });
      setShowAddRepair(false);
      setPasswordMessage({ text: 'Repair history added successfully!', type: 'success' });
    } catch (error) {
      alert('Failed to add repair history');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'password'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lock className="h-5 w-5" />
          Change Password
        </button>
        <button
          onClick={() => setActiveTab('repair')}
          className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'repair'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <History className="h-5 w-5" />
          Repair History
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Password Change Tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Change Your Password</h2>
              <p className="text-gray-600 text-sm mt-1">
                Enter your current password and choose a new one
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoadingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoadingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoadingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Message Alert */}
              {passwordMessage.text && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    passwordMessage.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {passwordMessage.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{passwordMessage.text}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoadingPassword}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-5 w-5" />
                {isLoadingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            {/* Security Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Security Tips:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Use a strong password with mix of uppercase, lowercase, numbers and symbols</li>
                    <li>Never share your password with anyone</li>
                    <li>Change your password regularly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Repair History Tab */}
        {activeTab === 'repair' && (
          <div className="space-y-6">
            {/* Add Repair Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddRepair(!showAddRepair)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <span>+</span>
                Add Repair History
              </button>
            </div>

            {/* Add Repair Form */}
            {showAddRepair && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Repair Entry</h3>
                <form onSubmit={handleSubmitRepair} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={newRepair.date}
                        onChange={handleAddRepair}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Cost */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cost (₹)
                      </label>
                      <input
                        type="number"
                        name="cost"
                        value={newRepair.cost}
                        onChange={handleAddRepair}
                        placeholder="Enter repair cost"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Information (Make, Model, Reg Number)
                    </label>
                    <input
                      type="text"
                      name="vehicleInfo"
                      value={newRepair.vehicleInfo}
                      onChange={handleAddRepair}
                      placeholder="e.g., Toyota Corolla - ABC123"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Issue/Service */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue/Service Description
                    </label>
                    <textarea
                      name="issue"
                      value={newRepair.issue}
                      onChange={handleAddRepair}
                      placeholder="Describe the repair or service performed"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Save className="h-5 w-5" />
                      Save Repair
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddRepair(false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Repair History List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Repair History</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Issue/Service
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {repairHistory.length > 0 ? (
                      repairHistory.map((repair) => (
                        <motion.tr
                          key={repair.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(repair.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {repair.vehicleInfo}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {repair.issue}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                repair.status === 'Completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {repair.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ₹{repair.cost.toLocaleString('en-IN')}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No repair history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
