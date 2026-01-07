import { cn } from "@/lib/utils";
import * as React from "react";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 
    | 'display-2xl' | 'display-xl' | 'display-lg'
    | 'heading-xl' | 'heading-lg' | 'heading-md' | 'heading-sm' | 'heading-xs'
    | 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs'
    | 'label-lg' | 'label-md' | 'label-sm' | 'label-xs';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

const weightClasses = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant = 'body-md', as, weight, children, ...props }, ref) => {
    // Auto-determine HTML tag based on variant if not specified
    const Component = as || (
      variant.startsWith('display') ? 'h1' :
      variant.startsWith('heading') ? 'h2' :
      variant.startsWith('label') ? 'label' :
      'p'
    );

    return (
      <Component
        ref={ref as any}
        className={cn(
          `text-${variant}`,
          weight && weightClasses[weight],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";

export { Text };
