'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalCount, 
  pageSize 
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Si peu de pages, afficher toutes
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher : 1 ... 4 5 6 ... 10
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null; // Pas de pagination si une seule page
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
      {/* Info */}
      <p className="text-sm text-gray">
        Affichage de <span className="font-medium text-dark">{startItem}</span> à{' '}
        <span className="font-medium text-dark">{endItem}</span> sur{' '}
        <span className="font-medium text-dark">{totalCount}</span> résultats
      </p>

      {/* Pagination */}
      <div className="flex items-center gap-2">
        {/* Bouton Précédent */}
        <button
          onClick={goToPrevious}
          disabled={currentPage === 1}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
            currentPage === 1
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray hover:border-primary hover:text-primary"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        {/* Numéros de page */}
        <div className="hidden md:flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={cn(
                  "min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all",
                  currentPage === pageNum
                    ? "bg-primary text-white"
                    : "text-gray hover:bg-primary/10 hover:text-primary"
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Page actuelle sur mobile */}
        <div className="md:hidden px-4 py-2 text-sm font-medium text-dark">
          Page {currentPage} / {totalPages}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
            currentPage === totalPages
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray hover:border-primary hover:text-primary"
          )}
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}