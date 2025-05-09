import React from "react";

const ScholarshipDetailLoader: React.FC = () => {
  return (
    <div className="bg-white py-8 px-8 max-w-7xl mx-auto shadow-lg rounded-lg border border-gray-200 mt-16 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>

      {/* Date Skeleton */}
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>

      {/* Status and Category Skeleton */}
      <div className="flex space-x-4 mb-8">
        <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
        <div className="h-8 w-28 bg-gray-300 rounded-full"></div>
      </div>

      {/* Description Skeleton */}
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-8"></div>

      {/* Requirements Skeleton */}
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-4 bg-gray-300 rounded w-3/4"></div>
        ))}
      </div>

      {/* Contact Skeleton */}
      <div className="h-6 bg-gray-300 rounded w-1/3 mt-8 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>

      {/* Button Skeleton */}
      <div className="mt-10 h-12 bg-gray-300 rounded w-full"></div>
    </div>
  );
};

export default ScholarshipDetailLoader;
