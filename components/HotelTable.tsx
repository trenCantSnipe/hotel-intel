import React from 'react';
import { HotelData } from '../types';

interface HotelTableProps {
  data: HotelData[];
}

const HotelTable: React.FC<HotelTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="p-8 text-center text-gray-500">No structured data found in the response.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm custom-scrollbar">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-3 text-left whitespace-nowrap sticky left-0 bg-gray-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Name</th>
            <th className="px-4 py-3 text-left whitespace-nowrap">Owner Email</th>
            <th className="px-4 py-3 text-left whitespace-nowrap">Company Email</th>
            <th className="px-4 py-3 text-left whitespace-nowrap">Phone</th>
            <th className="px-4 py-3 text-left whitespace-nowrap">Website</th>
            <th className="px-4 py-3 text-left whitespace-nowrap">Web Quality</th>
            <th className="px-4 py-3 text-left whitespace-nowrap">Chatbot?</th>
            <th className="px-4 py-3 text-left whitespace-nowrap">Chatbot Quality</th>
            <th className="px-4 py-3 text-left whitespace-nowrap">Rating</th>
            <th className="px-4 py-3 text-left min-w-[300px]">Comments</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((hotel, index) => (
            <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">
              <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white hover:bg-blue-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                {hotel.name}
              </td>
              <td className="px-4 py-3 text-gray-600">{hotel.ownerEmail}</td>
              <td className="px-4 py-3 text-gray-600">
                {hotel.companyEmail !== "N/A" ? (
                    <a href={`mailto:${hotel.companyEmail}`} className="text-blue-600 hover:underline">{hotel.companyEmail}</a>
                ) : "N/A"}
              </td>
              <td className="px-4 py-3 text-gray-600">{hotel.phone}</td>
              <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                 {hotel.website !== "N/A" && hotel.website.startsWith('http') ? (
                    <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      Link 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                ) : hotel.website}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  hotel.websiteQuality.toLowerCase().includes('good') || hotel.websiteQuality.toLowerCase().includes('modern') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {hotel.websiteQuality}
                </span>
              </td>
              <td className="px-4 py-3">
                 <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  hotel.hasChatbot.toLowerCase().includes('yes')
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {hotel.hasChatbot}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{hotel.chatbotQuality}</td>
              <td className="px-4 py-3 font-bold text-gray-800">{hotel.rating}</td>
              <td className="px-4 py-3 text-gray-600 text-xs italic">{hotel.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HotelTable;