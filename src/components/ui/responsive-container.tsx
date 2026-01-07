import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'content' | 'tv';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'section';
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',       // 640px
  md: 'max-w-screen-md',       // 768px
  lg: 'max-w-screen-lg',       // 1024px
  xl: 'max-w-screen-xl',       // 1280px
  '2xl': 'max-w-7xl',          // 1536px
  full: 'max-w-full',
  content: 'max-w-3xl',        // Optimal reading width
  tv: 'max-w-7xl 5xl:max-w-[2800px]', // TV optimization
};

const paddingClasses = {
  none: '',
  sm: 'px-4 py-4 sm:px-6 sm:py-6',
  md: 'px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 5xl:px-20 5xl:py-12',
  lg: 'px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 md:py-10 lg:py-12 5xl:px-24 5xl:py-16',
  section: 'px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16 xl:py-20 5xl:px-24 5xl:py-32',
};

export function ResponsiveContainer({ 
  children, 
  className, 
  maxWidth = '2xl',
  padding = 'md'
}: ResponsiveContainerProps) {
  return (
    <div className={cn(
      "mx-auto w-full",
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}
