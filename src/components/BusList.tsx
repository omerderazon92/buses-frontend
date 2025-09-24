import { useState, useMemo } from 'react';
import { BusStationResponse, SimpleBusInfo } from '../types/bus.types';
import { BusCard } from './BusCard';

interface BusListProps {
  data: BusStationResponse;
  onRefresh: () => void;
}

type SortMode = 'time' | 'bus_number';

export const BusList: React.FC<BusListProps> = ({ data, onRefresh }) => {
  const [filterText, setFilterText] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('time');
  // Filter and sort buses
  const filteredAndSortedBuses = useMemo(() => {
    let filteredBuses = data.buses;

    // Filter by bus number
    if (filterText.trim()) {
      filteredBuses = data.buses.filter(bus => 
        bus.bus_number.includes(filterText.trim())
      );
    }

    // Sort buses
    const sortedBuses = [...filteredBuses].sort((a, b) => {
      if (sortMode === 'time') {
        return a.next_arrival_minutes - b.next_arrival_minutes;
      } else {
        // Sort by bus number numerically if possible, otherwise alphabetically
        const aNum = parseInt(a.bus_number);
        const bNum = parseInt(b.bus_number);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return a.bus_number.localeCompare(b.bus_number);
      }
    });

    return sortedBuses;
  }, [data.buses, filterText, sortMode]);

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const clearFilter = () => {
    setFilterText('');
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-3 sm:mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            תחנה {data.station_id}
          </h2>
          <button
            onClick={onRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm transition-colors min-h-[44px] sm:min-h-0"
          >
            רענן
          </button>
        </div>
        
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-3">
          <span>
            {filterText ? `${filteredAndSortedBuses.length} מתוך ` : ''}
            {data.total_buses} אוטובוסים
          </span>
          <span>עודכן: {formatLastUpdated(data.last_updated)}</span>
        </div>

        {/* Filter and Sort Controls */}
        <div className="space-y-3">
          {/* Filter Input */}
          <div className="relative">
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="סנן לפי מספר קו..."
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              dir="rtl"
            />
            <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {filterText && (
              <button
                onClick={clearFilter}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortMode('time')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] sm:min-h-0 ${
                sortMode === 'time'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              מיון לפי זמן
            </button>
            <button
              onClick={() => setSortMode('bus_number')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] sm:min-h-0 ${
                sortMode === 'bus_number'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              מיון לפי קו
            </button>
          </div>
        </div>
      </div>

      {/* Bus List */}
      {data.buses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
          <div className="text-gray-500 text-base sm:text-lg">
            אין אוטובוסים בתחנה זו כעת
          </div>
        </div>
      ) : filteredAndSortedBuses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
          <div className="text-gray-500 text-base sm:text-lg">
            אין אוטובוסים המתאימים לחיפוש
          </div>
          <button
            onClick={clearFilter}
            className="mt-3 text-blue-500 hover:text-blue-600 text-sm underline"
          >
            נקה סינון
          </button>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filteredAndSortedBuses.map((bus, index) => (
            <BusCard key={`${bus.bus_number}-${index}`} bus={bus} />
          ))}
        </div>
      )}
    </div>
  );
};