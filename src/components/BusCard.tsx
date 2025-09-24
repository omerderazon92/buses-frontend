import { SimpleBusInfo } from '../types/bus.types';

interface BusCardProps {
  bus: SimpleBusInfo;
}

export const BusCard: React.FC<BusCardProps> = ({ bus }) => {
  const formatArrivalTime = (minutes: number) => {
    if (minutes === 0) return 'עכשיו';
    if (minutes === 1) return 'דקה';
    return `${minutes} דקות`;
  };

  const getArrivalColor = (minutes: number) => {
    if (minutes <= 2) return 'text-red-600 font-bold';
    if (minutes <= 5) return 'text-orange-600 font-semibold';
    if (minutes <= 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3 border-r-4 border-blue-500">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full font-bold text-lg">
            {bus.bus_number}
          </div>
          <div className="text-sm text-gray-600">
            {bus.company_name}
          </div>
        </div>
        <div className={`text-2xl font-bold ${getArrivalColor(bus.next_arrival_minutes)}`}>
          {formatArrivalTime(bus.next_arrival_minutes)}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="font-semibold text-gray-800 text-right">
          {bus.destination}
        </div>
        <div className="text-sm text-gray-600 text-right">
          {bus.description}
        </div>
      </div>

      {bus.arrival_times.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-end">
          <span className="text-sm text-gray-500">זמני הגעה:</span>
          {bus.arrival_times.slice(0, 3).map((time, index) => (
            <span
              key={index}
              className={`text-sm px-2 py-1 rounded ${
                index === 0 
                  ? 'bg-blue-100 text-blue-800 font-semibold' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {formatArrivalTime(time)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};