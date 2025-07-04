// src/pages/Settings.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/index';
import { useAuth } from '../context/AuthContext';

function Settings() {
  const { user, setUser } = useAuth();
  const [riskPercentage, setRiskPercentage] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(''); // 'success', 'error', ''

  useEffect(() => {
    if (user?.settings) {
      setRiskPercentage(user.settings.riskPercentage);
      setIsLoading(false);
    } else {
      // Fetch user data if not fully loaded in context
      api.get('/auth/me')
        .then(response => {
          setUser(response.data); // Update context
          setRiskPercentage(response.data.settings.riskPercentage);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch user settings', error);
          setIsLoading(false);
        });
    }
  }, [user, setUser]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaveStatus('');
    try {
      const response = await api.put('/auth/me/settings', { riskPercentage });
      // Optimistically update context, or refetch
      setUser({ ...user, settings: response.data });
      setSaveStatus('success');
    } catch (error) {
      console.error('Failed to save settings', error);
      setSaveStatus('error');
    } finally {
      setTimeout(() => setSaveStatus(''), 3000); // Clear status after 3s
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <div className="text-center py-12 text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-dark-800 rounded-xl border border-dark-600 shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">User Settings</h2>
          
          <form onSubmit={handleSaveChanges}>
            <div className="mb-6">
              <label htmlFor="risk" className="block text-sm font-medium text-gray-300 mb-2">
                Max Risk per Trade (%)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Define the maximum percentage of your capital to risk on a single trade.
              </p>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  id="risk"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={riskPercentage}
                  onChange={(e) => setRiskPercentage(parseFloat(e.target.value))}
                  className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gold-400 font-bold text-lg w-20 text-center">
                  {riskPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4">
              {saveStatus === 'success' && <p className="text-green-400">Saved successfully!</p>}
              {saveStatus === 'error' && <p className="text-red-400">Failed to save.</p>}
              <button
                type="submit"
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
