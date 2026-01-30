import React from 'react';

const ModalLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
        
        {/* Loading text */}
        <p className="mt-4 text-gray-700 font-medium">Loading form...</p>
      </div>
    </div>
  );
};

export default ModalLoader;
