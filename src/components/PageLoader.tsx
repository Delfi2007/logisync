import React from 'react';

const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
        
        {/* Inner circle for visual appeal */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-8 w-8 bg-white rounded-full"></div>
        </div>
      </div>
      
      {/* Loading text */}
      <p className="mt-6 text-lg text-gray-700 font-medium">Loading...</p>
      
      {/* Subtle hint */}
      <p className="mt-2 text-sm text-gray-500">Please wait while we load the page</p>
    </div>
  );
};

export default PageLoader;
