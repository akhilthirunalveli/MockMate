import React from 'react';

const PermissionModal = ({ permissionGranted, errorMessage, audioOnly, hasAttemptedMediaAccess, retryPermissions }) => {
  // Don't show modal if:
  // 1. Permissions are granted and not audio-only info, OR
  // 2. User hasn't attempted to access media yet
  if ((permissionGranted && !audioOnly) || (!hasAttemptedMediaAccess && !permissionGranted)) {
    return null;
  }

  const handleRetry = () => {
    if (retryPermissions) {
      retryPermissions();
    } else {
      window.location.reload();
    }
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
        <div className="bg-black border border-white/20 p-8 rounded-2xl max-w-lg mx-4 text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2 text-white">Audio-Only Mode</h2>
            <p className="text-orange-400 text-sm mb-4 px-4 py-2 bg-orange-900/20 rounded-lg">
              No camera detected. Your interview will be recorded with audio only.
            </p>
          </div>

          <div className="text-left mb-6">
            <p className="text-gray-300 mb-3">What this means:</p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start">
                <span className="text-green-400 mr-3 mt-0.5 flex-shrink-0">
                  ✓
                </span>
                Your voice will be recorded and transcribed
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 mt-0.5 flex-shrink-0">
                  ✓
                </span>
                Speech analysis and feedback will work normally
              </li>
              <li className="flex items-start">
                <span className="text-orange-400 mr-3 mt-0.5 flex-shrink-0">
                  !
                </span>
                Video recording won't be available
              </li>
              <li className="flex items-start">
                <span className="text-white mr-3 mt-0.5 flex-shrink-0">
                  i
                </span>
                Connect a camera anytime and refresh to enable video
              </li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleContinueAudioOnly}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Audio-Only
            </button>
            <button
              onClick={handleRetry}
              className="bg-white text-black px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="bg-black border border-white/20 p-8 rounded-2xl max-w-lg mx-4 text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2 text-white">{getTitle()}</h2>
            {errorMessage && (
              <p className="text-red-400 text-sm mb-4 px-4 py-2 bg-red-900/20 rounded-lg">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="text-left mb-6">
            <p className="text-gray-300 mb-3">To fix this issue:</p>
            <ul className="text-sm text-gray-300 space-y-2">
              {getInstructions().map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-white mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}.
                  </span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.close()}
              className="bg-red-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
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
