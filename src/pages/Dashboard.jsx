// import { useState, useEffect } from 'react'
// import Navbar from '../components/Navbar'
// import GoldChart from '../components/GoldChart'
// import AISuggestion from '../components/AISuggestion'
// import api from '../api/index'

// function Dashboard() {
//   const [suggestion, setSuggestion] = useState(null)
//   const [suggestions, setSuggestions] = useState([])
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     fetchLatestSuggestion()
//     fetchSuggestions()
//   }, [])

//   const fetchLatestSuggestion = async () => {
//     try {
//       const response = await api.get('/suggestions/latest')
//       setSuggestion(response.data)
//     } catch (error) {
//       console.error('Error fetching suggestion:', error)
//     }
//   }

//   const fetchSuggestions = async () => {
//     try {
//       const response = await api.get('/suggestions')
//       setSuggestions(response.data)
//     } catch (error) {
//       console.error('Error fetching suggestions:', error)
//     }
//   }

//   const refreshSuggestion = async () => {
//     setLoading(true)
//     try {
//       const response = await api.post('/suggestions/refresh')
//       setSuggestion(response.data)
//       fetchSuggestions()
//     } catch (error) {
//       console.error('Error refreshing suggestion:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-dark-900">
//       <Navbar />
      
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Top Section: Live Gold Price Chart */}
//         <div className="mb-8">
//           <GoldChart />
//         </div>
        
//         {/* Bottom Section: AI Suggestion Panel */}
//         <div className="mb-8">
//           <AISuggestion 
//             suggestion={suggestion} 
//             onRefresh={refreshSuggestion}
//             loading={loading}
//           />
//         </div>
        
//         {/* Historical Suggestions */}
//         {suggestions.length > 0 && (
//           <div className="bg-dark-800 rounded-xl border border-dark-600 shadow-xl">
//             <div className="bg-dark-700 px-6 py-4 border-b border-dark-600 rounded-t-xl">
//               <h3 className="text-lg font-bold text-white">
//                 Recent Trading Recommendations
//               </h3>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {suggestions.slice(0, 6).map((item, index) => (
//                   <div key={index} className="bg-dark-700 rounded-lg p-4 border border-dark-600 hover:border-gold-500 transition-colors duration-200">
//                     <div className="flex justify-between items-start mb-3">
//                       <span className="text-sm text-gray-400">
//                         {new Date(item.createdAt).toLocaleDateString()}
//                       </span>
//                       <span className="text-xs bg-gold-500 text-white px-2 py-1 rounded-full font-medium">
//                         {item.confidence}%
//                       </span>
//                     </div>
//                     <div className="text-sm text-white space-y-2">
//                       <div className="flex justify-between">
//                         <span className="text-gray-400">Entry:</span> 
//                         <span className="font-medium text-green-400">${item.entryPrice}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-400">Target:</span> 
//                         <span className="font-medium text-gold-400">${item.targetPrice}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-400">Stop:</span> 
//                         <span className="font-medium text-red-400">${item.stopLoss}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Dashboard


import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import GoldChart from '../components/GoldChart';
import AISuggestion from '../components/AISuggestion';
import api from '../api/index';

function Dashboard() {
  const [suggestion, setSuggestion] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLatestSuggestion();
    fetchSuggestions();
  }, []);

  const fetchLatestSuggestion = async () => {
    try {
      const response = await api.get('/suggestions/latest');
      setSuggestion(response.data);
    } catch (error) {
      console.error('Error fetching suggestion:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await api.get('/suggestions');
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const refreshSuggestion = async () => {
    setLoading(true);
    try {
      const response = await api.post('/suggestions/refresh');
      setSuggestion(response.data);
      fetchSuggestions();
    } catch (error) {
      console.error('Error refreshing suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      {/* Full-width GoldChart */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <GoldChart />
      </div>

      {/* Centered content for AI Suggestion and Historical Suggestions */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* AI Suggestion Panel */}
        <div className="mb-8">
          <AISuggestion 
            suggestion={suggestion} 
            onRefresh={refreshSuggestion}
            loading={loading}
          />
        </div>
        
        {/* Historical Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-dark-800 rounded-xl border border-dark-600 shadow-xl">
            <div className="bg-dark-700 px-6 py-4 border-b border-dark-600 rounded-t-xl">
              <h3 className="text-lg font-bold text-white">
                Recent Trading Recommendations
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.slice(0, 6).map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-dark-700 rounded-lg p-4 border border-dark-600 hover:border-gold-500 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs bg-gold-500 text-white px-2 py-1 rounded-full font-medium">
                        {item.confidence}%
                      </span>
                    </div>
                    <div className="text-sm text-white space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Entry:</span> 
                        <span className="font-medium text-green-400">${item.entryPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target:</span> 
                        <span className="font-medium text-gold-400">${item.targetPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stop:</span> 
                        <span className="font-medium text-red-400">${item.stopLoss}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;