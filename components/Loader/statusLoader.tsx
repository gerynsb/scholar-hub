import React from "react";

type StatusSkeletonLoaderProps = {
  itemCount: number; // Jumlah item skeleton
  layout?: "grid" | "list"; // Default "grid"
};

const StatusSkeletonLoader: React.FC<StatusSkeletonLoaderProps> = ({
  itemCount,
  layout = "grid",
}) => {
  return (
    <div
      className={`${
      layout === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        : "space-y-4"
      } px-72 py-32`}
    >
      {Array.from({ length: itemCount }).map((_, index) => (
        <div
          key={index}
          className="relative border rounded-lg p-6 shadow-lg bg-white animate-pulse"
        >
          {/* Icon Placeholder */}
          <div className="absolute top-4 right-4 h-6 w-6 bg-gray-300 rounded-full"></div>

          {/* Title Placeholder */}
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>

          {/* Text Placeholders */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>

          {/* Button Placeholder */}
          <div className="mt-4 flex justify-end">
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusSkeletonLoader;
