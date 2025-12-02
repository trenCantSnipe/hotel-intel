import React, { useState } from 'react';
import { AppState, HotelData } from './types';
import { searchHotels } from './services/geminiService';
import HotelTable from './components/HotelTable';
import ExportButton from './components/ExportButton';

const App: React.FC = () => {
  const [location, setLocation] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setAppState(AppState.SEARCHING);
    setHotels([]);
    setSources([]);
    setErrorMsg('');

    try {
      const result = await searchHotels(location);
      setHotels(result.hotels);
      setSources(result.sources);
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg("Failed to fetch data. Please try again or check your API key.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h1 className="text-xl font-bold tracking-tight">HotelIntel <span className="text-blue-400 font-light">Research</span></h1>
          </div>
          <div className="text-xs text-slate-400">Powered by Gemini</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Search Hero */}
        <section className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4">
            Find Hotels & Resorts Intelligence
          </h2>
          <p className="text-slate-600 mb-8">
            Enter a city, state, or country to generate a comprehensive spreadsheet of hotels including contact details, website analysis, and chatbot ratings.
          </p>
          
          <form onSubmit={handleSearch} className="relative flex items-center w-full max-w-lg mx-auto">
            <input
              type="text"
              placeholder="E.g., Dubai, Maldives, Las Vegas..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-slate-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg"
              disabled={appState === AppState.SEARCHING}
            />
            <button
              type="submit"
              disabled={appState === AppState.SEARCHING || !location.trim()}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-slate-400"
            >
              {appState === AppState.SEARCHING ? (
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </form>
          {appState === AppState.SEARCHING && (
            <p className="mt-4 text-sm text-blue-600 font-medium animate-pulse">
              Scouring the web for hotels, contacts, and analyzing websites... This may take a moment.
            </p>
          )}
        </section>

        {/* Error Message */}
        {appState === AppState.ERROR && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {hotels.length > 0 && (
          <section className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                Results for "{location}" <span className="text-slate-400 font-normal">({hotels.length} found)</span>
              </h3>
              <ExportButton data={hotels} filename={`hotels-${location.replace(/\s+/g, '-').toLowerCase()}.csv`} />
            </div>
            
            <HotelTable data={hotels} />

            {/* Citations/Sources */}
            {sources.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Sources & References</h4>
                <div className="flex flex-wrap gap-2">
                  {sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors truncate max-w-[300px]"
                    >
                      {new URL(src).hostname}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} HotelIntel. All search results generated via Gemini AI.</p>
          <p className="text-xs mt-2 text-slate-600">
            Note: Contact information and ratings are estimated based on public web search data. Always verify independently.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;