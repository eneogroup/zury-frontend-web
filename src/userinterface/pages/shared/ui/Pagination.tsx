import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../../../service/utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    navigate(`?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...'); pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1); pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1); pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...'); pages.push(totalPages)
      }
    }
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
      <div className="text-sm text-gray-500">
        Page <span className="font-semibold text-dark">{currentPage}</span> sur{' '}
        <span className="font-semibold text-dark">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
            currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-dark hover:bg-primary hover:text-white border border-gray-200'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Précédent</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, i) => (
            <div key={i}>
              {pageNum === '...' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(pageNum as number)}
                  className={cn('w-10 h-10 rounded-lg font-medium transition-all',
                    pageNum === currentPage ? 'bg-primary text-white shadow-lg' : 'bg-white text-dark hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  {pageNum}
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
            currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-dark hover:bg-primary hover:text-white border border-gray-200'
          )}
        >
          <span className="hidden sm:inline">Suivant</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
