function DetailSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10 animate-pulse">
      <h1 className="h-10 bg-gray-300 rounded mb-6"></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-6 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow">
        <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="h-10 w-32 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export default DetailSkeleton;
