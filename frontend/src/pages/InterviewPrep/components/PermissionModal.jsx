import React from 'react';

const PermissionModal = ({ permissionGranted }) => {
  if (permissionGranted) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl max-w-md mx-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Camera & Microphone Access</h2>
        <p className="text-gray-600 mb-6">
          This interview recorder needs access to your camera and microphone to function properly.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Grant Access
        </button>
      </div>
    </div>
  );
};

export default PermissionModal;
