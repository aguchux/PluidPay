export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#e50025] border-t-transparent rounded-full animate-spin" />
          <h2 className="mt-6 text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="mt-2 text-sm text-gray-600">Please wait while Pluid loads your content.</p>
        </div>
      </div>
    </div>
  );
}
