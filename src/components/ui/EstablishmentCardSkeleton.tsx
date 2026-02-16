import Skeleton from './Skeleton';

export default function EstablishmentCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded-t-xl" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Titre */}
        <Skeleton className="h-5 w-3/4" />
        
        {/* Adresse */}
        <Skeleton className="h-4 w-1/2" />
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}