import React from "react";

export default function HomeSkeletonLoader() {
  return (
    <div className="bg-white py-16 px-16 mt-10">
      <h1 className="text-4xl font-bold text-blue-900 mb-12">Found Scholar</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Section Skeleton */}
        <div className="w-full md:w-1/4 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-2/4"></div>
          </div>
        </div>

        {/* Cards Section Skeleton */}
        <div className="flex-1">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8`}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 bg-gray-100 shadow-md animate-pulse"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-300 rounded-full w-1/4"></div>
                  <div className="h-6 bg-gray-300 rounded-full w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
