import { BusStationResponse } from '../types/bus.types';
import { BusCard } from './BusCard';

interface BusListProps {
  data: BusStationResponse;
  onRefresh: () => void;
}

export const BusList: React.FC<BusListProps> = ({ data, onRefresh }) => {
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">
            תחנה {data.station_id}
          </h2>
          <button
            onClick={onRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            רענן
          </button>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>סך הכול: {data.total_buses} אוטובוסים</span>
          <span>עודכן: {formatLastUpdated(data.last_updated)}</span>
        </div>
      </div>

      {data.buses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-500 text-lg">
            אין אוטובוסים בתחנה זו כעת
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {data.buses.map((bus, index) => (
            <BusCard key={`${bus.bus_number}-${index}`} bus={bus} />
          ))}
        </div>
      )}
    </div>
  );
};