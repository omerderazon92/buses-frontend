interface LocationHelpProps {
  onClose: () => void;
  permissionState?: PermissionState;
}

export const LocationHelp: React.FC<LocationHelpProps> = ({ onClose, permissionState }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  const getInstructions = () => {
    if (permissionState === 'denied') {
      if (isIOS) {
        return {
          title: "אפשר מיקום ב-iOS",
          steps: [
            "פתח הגדרות המכשיר",
            "פרטיות וביטחון → שירותי מיקום",
            "וודא שהשירות מופעל",
            "גלול למטה ל-Safari",
            "בחר 'בזמן שימוש באפליקציה'",
            "רענן את הדף ונסה שוב"
          ]
        };
      } else if (isAndroid) {
        return {
          title: "אפשר מיקום ב-Android",
          steps: [
            "פתח Chrome → תפריט (⋮)",
            "הגדרות → הגדרות אתר",
            "מיקום",
            "מצא את האתר שלנו ובחר 'אפשר'",
            "רענן את הדף ונסה שוב"
          ]
        };
      }
    }
    
    return {
      title: "איך מאפשרים מיקום?",
      steps: [
        "הדפדפן יבקש הרשאה למיקום",
        "לחץ על 'אפשר' או 'Allow'",
        "אם החלון לא מופיע, בדוק את סמל המיקום בסמל הכתובת",
        "במכשיר נייד - וודא ששירותי המיקום מופעלים"
      ]
    };
  };

  const instructions = getInstructions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm w-full p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 text-right">
            {instructions.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {instructions.steps.map((step, index) => (
            <div key={index} className="flex items-start text-right">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium ml-3 flex-shrink-0">
                {index + 1}
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                {step}
              </span>
            </div>
          ))}
        </div>

        {permissionState === 'denied' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="text-xs text-yellow-800 text-center">
              💡 לאחר שינוי ההגדרות, יש לרענן את הדף
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            סגור
          </button>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            רענן דף
          </button>
        </div>
      </div>
    </div>
  );
};