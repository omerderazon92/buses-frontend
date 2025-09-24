import { ApiError } from '../types/bus.types';

interface ErrorMessageProps {
  error: ApiError;
  onRetry: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-red-500">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="mr-3">
            <h3 className="text-lg font-semibold text-red-800">שגיאה בטעינת הנתונים</h3>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-red-700 text-right">{error.message}</p>
          {error.status && (
            <p className="text-sm text-red-600 mt-1 text-right">
              קוד שגיאה: {error.status}
            </p>
          )}
        </div>
        
        <button
          onClick={onRetry}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          נסה שוב
        </button>
      </div>
    </div>
  );
};