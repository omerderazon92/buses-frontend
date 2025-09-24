export const LoadingSpinner: React.FC = () => {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-gray-600 text-lg">טוען נתוני אוטובוסים...</div>
        </div>
      </div>
    </div>
  );
};