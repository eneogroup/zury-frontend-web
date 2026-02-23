export default function EstablishmentCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Image area */}
      <div className="h-52 skeleton" />
      {/* Content */}
      <div className="p-4">
        <div className="h-5 skeleton rounded-lg w-3/4 mb-2" />
        <div className="h-3 skeleton rounded w-1/2 mb-4" />
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 skeleton rounded-sm" />
            ))}
          </div>
          <div className="w-7 h-7 skeleton rounded-full" />
        </div>
      </div>
    </div>
  )
}
