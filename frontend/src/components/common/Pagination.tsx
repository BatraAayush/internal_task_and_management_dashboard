import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalItems,
  limit,
  onPageChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-slate-800 text-sm text-slate-400">
      <div>
        Showing <span className="font-semibold text-slate-200">{startItem}</span> to <span className="font-semibold text-slate-200">{endItem}</span> of <span className="font-semibold text-slate-200">{totalItems}</span> results
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <span className="text-xs px-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-md font-mono text-slate-300">
          {page} / {totalPages || 1}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};