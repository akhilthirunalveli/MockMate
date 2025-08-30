import React from 'react';

const PermissionModal = ({ permissionGranted, errorMessage, audioOnly }) => {
  // Don't show modal if permissions are granted, unless it's audio-only info
  if (permissionGranted && !audioOnly) return null;

  const handleRetry = () => {
    window.location.reload();
  };

  const handleContinueAudioOnly = () => {
    // Close modal and continue with audio-only mode
    // This could be passed as a prop if needed
    return null;
  };

  // Audio-only scenario
  if (audioOnly && permissionGranted) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl max-w-lg mx-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Audio-Only Mode</h2>
            <p className="text-orange-600 text-sm mb-4 px-4 py-2 bg-orange-50 rounded-lg">
              No camera detected. Your interview will be recorded with audio only.
            </p>
          </div>
          
          <div className="text-left mb-6">
            <p className="text-gray-600 mb-3">What this means:</p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                  ✓
                </span>
                Your voice will be recorded and transcribed
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                  ✓
                </span>
                Speech analysis and feedback will work normally
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                  !
                </span>
                Video recording won't be available
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                  i
                </span>
                Connect a camera anytime and refresh to enable video
              </li>
            </ul>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleContinueAudioOnly} 
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Continue Audio-Only
            </button>
            <button 
              onClick={handleRetry} 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular error scenarios
  if (!permissionGranted) {
    const getTitle = () => {
      if (errorMessage.includes('Not found') || errorMessage.includes('No camera')) {
        return 'No Camera or Microphone Found';
      }
      if (errorMessage.includes('denied') || errorMessage.includes('NotAllowed')) {
        return 'Permission Required';
      }
      return 'Camera & Microphone Access';
    };

    const getInstructions = () => {
      if (errorMessage.includes('Not found') || errorMessage.includes('No camera')) {
        return [
          'Please ensure your camera and microphone are connected',
          'Check that no other applications are using your camera',
          'Try a different browser if the issue persists'
        ];
      }
      if (errorMessage.includes('denied') || errorMessage.includes('NotAllowed')) {
        return [
          'Click the camera/microphone icon in your browser\'s address bar',
          'Select "Allow" for both camera and microphone access',
          'Refresh the page after granting permissions'
        ];
      }
      return [
        'This interview recorder needs access to your camera and microphone',
        'Your data is processed locally and not stored on our servers',
        'Click "Grant Access" to continue'
      ];
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl max-w-lg mx-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">{getTitle()}</h2>
            {errorMessage && (
              <p className="text-red-600 text-sm mb-4 px-4 py-2 bg-red-50 rounded-lg">
                {errorMessage}
              </p>
            )}
          </div>
          
          <div className="text-left mb-6">
            <p className="text-gray-600 mb-3">To fix this issue:</p>
            <ul className="text-sm text-gray-700 space-y-2">
              {getInstructions().map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleRetry} 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.close()} 
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PermissionModal;
