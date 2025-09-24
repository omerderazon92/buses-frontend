import { useState, useRef, useEffect } from 'react';
import { Address } from '../types/bus.types';
import { useAddressSearch } from '../hooks/useAddressSearch';

interface AddressSearchProps {
  onAddressSelect: (address: Address) => void;
  placeholder?: string;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({ 
  onAddressSelect, 
  placeholder = "הכנס כתובת..." 
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useAddressSearch(query);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length >= 2);
    setSelectedIndex(-1);
  };

  const handleAddressClick = (address: Address) => {
    setQuery(address.display_name);
    setShowSuggestions(false);
    onAddressSelect(address);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!data?.addresses.length || !showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < data.addresses.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : data.addresses.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleAddressClick(data.addresses[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        suggestionsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 2 && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        dir="rtl"
      />

      {loading && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}

      {showSuggestions && data?.addresses && data.addresses.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {data.addresses.map((address, index) => (
            <div
              key={`${address.lat}-${address.lon}-${index}`}
              onClick={() => handleAddressClick(address)}
              className={`px-4 py-3 cursor-pointer text-right border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-sm text-gray-800">
                {address.display_name}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && data?.addresses && data.addresses.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-center text-gray-500 text-sm">
            לא נמצאו כתובות
          </div>
        </div>
      )}

      {error && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-red-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-center text-red-500 text-sm">
            {error.message}
          </div>
        </div>
      )}
    </div>
  );
};