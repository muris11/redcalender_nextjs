import { cn } from "@/lib/utils";
import * as React from "react";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'display-2xl' | 'display-xl' | 'display-lg' | 'heading-xl' | 'heading-lg' | 'heading-md' | 'heading-sm' | 'heading-xs';
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, size, children, ...props }, ref) => {
    const Component = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    
    // Auto-determine size based on level if not specified
    const sizeClass = size || (
      level === 1 ? 'heading-xl' :
      level === 2 ? 'heading-lg' :
      level === 3 ? 'heading-md' :
      level === 4 ? 'heading-sm' :
      'heading-xs'
    );

    return (
      <Component
        ref={ref as any}
        className={cn(`text-${sizeClass} font-bold`, className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";

export { Heading };
