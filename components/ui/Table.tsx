import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T, index: number) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  emptyText?: string;
  loading?: boolean;
}

function getNestedValue<T>(obj: T, key: string): unknown {
  return key.split('.').reduce((acc: unknown, k) => (acc as Record<string, unknown>)?.[k], obj);
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  className,
  emptyText = 'No data available',
  loading = false,
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-border/50', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/30 border-b border-border/50">
            {columns.map((col, colIdx) => (
              <th
                key={`col-${colIdx}`}
                style={{ width: col.width }}
                className={cn(
                  'px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap',
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border/30">
                {columns.map((col) => (
                  <td key={col.key as string} className="px-4 py-3">
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground text-sm">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={cn(
                  'border-b border-border/30 transition-colors hover:bg-muted/20',
                  rowIdx === data.length - 1 && 'border-b-0'
                )}
              >
                {columns.map((col, colIdx) => {
                  const value = getNestedValue(row, col.key as string) as T[keyof T];
                  return (
                    <td
                      key={`col-${colIdx}`}
                      className={cn(
                        'px-4 py-3 text-foreground',
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      )}
                    >
                      {col.render ? col.render(value, row, rowIdx) : String(value ?? '')}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
