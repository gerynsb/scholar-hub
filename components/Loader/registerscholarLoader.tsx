import React from "react";

const RegisterScholarshipLoader: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10 animate-pulse">
      {/* Title */}
      <div className="h-10 bg-gray-300 rounded mb-8 w-3/4 mx-auto"></div>

      {/* Form Skeleton */}
      <div className="grid grid-cols-1 gap-6">
        {/* Input Skeleton */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="h-5 bg-gray-300 rounded mb-2 w-1/4 mx-auto"></div>
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
        ))}

        {/* File Upload Skeleton */}
        <div>
          <div className="h-5 bg-gray-300 rounded mb-2 w-1/3 mx-auto"></div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>

        {/* Submit Button Skeleton */}
        <div className="mt-6">
          <div className="h-12 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScholarshipLoader;
