import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
    '5xl'?: number;
  };
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const gapClasses = {
  none: 'gap-0',
  xs: 'gap-1 sm:gap-2 md:gap-2 5xl:gap-3',
  sm: 'gap-2 sm:gap-3 md:gap-4 5xl:gap-6',
  md: 'gap-3 sm:gap-4 md:gap-6 5xl:gap-10',
  lg: 'gap-4 sm:gap-6 md:gap-8 5xl:gap-12',
  xl: 'gap-6 sm:gap-8 md:gap-10 5xl:gap-16',
};

export function ResponsiveGrid({ 
  children, 
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  className 
}: ResponsiveGridProps) {
  // Build grid-cols classes for each breakpoint
  const getColClass = (prefix: string, count?: number) => {
    if (!count) return '';
    const p = prefix ? `${prefix}:` : '';
    return `${p}grid-cols-${count}`;
  };

  return (
    <div className={cn(
      "grid",
      getColClass('', cols.default),
      getColClass('xs', cols.xs),
      getColClass('sm', cols.sm),
      getColClass('md', cols.md),
      getColClass('lg', cols.lg),
      getColClass('xl', cols.xl),
      getColClass('2xl', cols['2xl']),
      getColClass('5xl', cols['5xl']),
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}
