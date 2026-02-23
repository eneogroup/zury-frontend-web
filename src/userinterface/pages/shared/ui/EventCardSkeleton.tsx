export default function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Image area with simulated date chip */}
      <div className="relative h-48 skeleton">
        <div className="absolute top-3 left-3 w-11 h-14 bg-white/60 rounded-xl animate-pulse" />
        <div className="absolute top-3 right-3 w-16 h-5 bg-white/60 rounded-full animate-pulse" />
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="h-5 skeleton rounded-lg w-4/5 mb-1" />
        <div className="h-4 skeleton rounded-lg w-2/3 mb-3" />
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="h-6 skeleton rounded w-20" />
          <div className="w-7 h-7 skeleton rounded-full" />
        </div>
      </div>
    </div>
  )
}
