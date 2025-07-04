// import { useEffect, useRef } from 'react'

// function GoldChart() {
//   const containerRef = useRef()

//   useEffect(() => {
//     const script = document.createElement('script')
//     script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
//     script.type = 'text/javascript'
//     script.async = true
//     script.innerHTML = `
//       {
//         "autosize": true,
//         "symbol": "FX:XAUUSD",
//         "interval": "240",
//         "timezone": "Etc/UTC",
//         "theme": "dark",
//         "style": "1",
//         "locale": "en",
//         "enable_publishing": false,
//         "backgroundColor": "rgba(17, 24, 39, 1)",
//         "gridColor": "rgba(55, 65, 81, 0.3)",
//         "hide_top_toolbar": false,
//         "hide_legend": false,
//         "save_image": false,
//         "calendar": false,
//         "hide_volume": false,
//         "support_host": "https://www.tradingview.com",
//         "studies": [
//           "RSI@tv-basicstudies",
//           "MACD@tv-basicstudies"
//         ],
//         "toolbar_bg": "#1f2937",
//         "withdateranges": true,
//         "range": "1D",
//         "allow_symbol_change": false,
//         "details": true,
//         "hotlist": false,
//         "calendar": false
//       }`

//     containerRef.current.appendChild(script)

//     return () => {
//       if (containerRef.current) {
//         containerRef.current.innerHTML = ''
//       }
//     }
//   }, [])

//   return (
//     <div className="bg-dark-800 rounded-xl border border-dark-600 overflow-hidden shadow-xl">
//       <div className="bg-dark-700 px-6 py-4 border-b border-dark-600">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-bold text-white flex items-center space-x-2">
//             <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
//             <span>Live Gold Price Chart (XAU/USD)</span>
//           </h2>
//           <div className="flex items-center space-x-2">
//             <span className="text-sm text-gray-400">Real-time data</span>
//             <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
//           </div>
//         </div>
//       </div>
//       <div className="h-96 lg:h-[500px]">
//         <div
//           className="tradingview-widget-container h-full"
//           ref={containerRef}
//           style={{ height: '100%', width: '100%' }}
//         >
//           <div className="tradingview-widget-container__widget h-full"></div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default GoldChart


import { useEffect, useRef } from 'react';

function GoldChart() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.error('Container reference is null');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: 'OANDA:XAUUSD',
      interval: '240',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      backgroundColor: 'rgba(17, 24, 39, 1)',
      gridColor: 'rgba(55, 65, 81, 0.3)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com',
      studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
      toolbar_bg: '#1f2937',
      withdateranges: true,
      range: '1D',
      allow_symbol_change: false,
      details: true,
      hotlist: false,
    });

    try {
      containerRef.current.appendChild(script);
    } catch (error) {
      console.error('Error appending TradingView script:', error);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full bg-dark-800 rounded-xl border border-dark-600 overflow-hidden shadow-xl">
      <div className="bg-dark-700 px-6 py-4 border-b border-dark-600">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            <span>Live Gold Price Chart (XAU/USD)</span>
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Real-time data</span>
            <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="h-[calc(100vh-80px)]">
        <div
          className="tradingview-widget-container h-full w-full"
          ref={containerRef}
          style={{ height: '100%', width: '100%' }}
        >
          <div className="tradingview-widget-container__widget h-full w-full"></div>
        </div>
      </div>
    </div>
  );
}

export default GoldChart;