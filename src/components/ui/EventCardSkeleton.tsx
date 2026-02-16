import Skeleton from './Skeleton';

export default function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Image skeleton */}
      <Skeleton className="h-40 w-full rounded-t-xl" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Titre */}
        <Skeleton className="h-5 w-3/4" />
        
        {/* Date */}
        <Skeleton className="h-4 w-1/2" />
        
        {/* Lieu */}
        <Skeleton className="h-4 w-2/3" />
        
        {/* Prix et places */}
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}