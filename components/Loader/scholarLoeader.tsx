import React from "react";

type ScholarshipLoaderProps = {
  itemCount: number; // Jumlah skeleton cards yang akan ditampilkan
};

const ScholarshipLoader: React.FC<ScholarshipLoaderProps> = ({ itemCount }) => {
  return (
    <div className="cards-container">
      {Array.from({ length: itemCount }).map((_, index) => (
        <div
          key={index}
          className="card bg-gray-200 animate-pulse p-6 rounded-lg shadow-lg"
        >
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
          {/* Date Skeleton */}
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          {/* Description Skeleton */}
          <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
          {/* Badges Skeleton */}
          <div className="flex space-x-2">
            <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
          </div>
          {/* Button Skeleton */}
          <div className="mt-4 h-8 w-32 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default ScholarshipLoader;
