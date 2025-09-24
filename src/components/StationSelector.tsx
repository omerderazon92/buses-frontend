import { BusStop } from '../types/bus.types';

interface StationSelectorProps {
  stations: BusStop[];
  onStationSelect: (station: BusStop) => void;
  loading?: boolean;
  selectedStationId?: number;
}

export const StationSelector: React.FC<StationSelectorProps> = ({ 
  stations, 
  onStationSelect, 
  loading = false,
  selectedStationId 
}) => {
  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${distance}מ'`;
    }
    return `${(distance / 1000).toFixed(1)}ק"מ`;
  };

  const getBusLines = (station: BusStop) => {
    if (!station.LineList || station.LineList.length === 0) return [];
    
    return station.LineList
      .map((line: any) => line.LineNumber || line.Shilut)
      .filter(Boolean)
      .slice(0, 5); // Show max 5 lines
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-gray-600">מחפש תחנות בסביבה...</span>
        </div>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-500">
          לא נמצאו תחנות בסביבה
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 text-right">
          תחנות בסביבה ({stations.length})
        </h3>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {stations.map((station) => {
          const busLines = getBusLines(station);
          const isSelected = selectedStationId === station.Makat;
          
          return (
            <div
              key={station.Makat}
              onClick={() => onStationSelect(station)}
              className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-500 font-medium">
                  {formatDistance(station.Distance)}
                </div>
                <div className="text-right flex-1 mr-3">
                  <div className="font-semibold text-gray-800 text-sm">
                    {station.Name}
                  </div>
                  {station.EnglishName && (
                    <div className="text-xs text-gray-500 mt-1">
                      {station.EnglishName}
                    </div>
                  )}
                </div>
              </div>
              
              {busLines.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-end mt-2">
                  <span className="text-xs text-gray-500 ml-2">קווים:</span>
                  {busLines.map((line, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {line}
                    </span>
                  ))}
                  {station.LineList && station.LineList.length > 5 && (
                    <span className="text-xs text-gray-500">
                      +{station.LineList.length - 5}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};