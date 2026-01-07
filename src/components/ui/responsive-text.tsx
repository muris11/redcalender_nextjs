import { cn } from "@/lib/utils";

interface ResponsiveTextProps {
  children: React.ReactNode;
  variant: 
    | 'display-2xl' | 'display-xl' | 'display-lg'
    | 'heading-xl' | 'heading-lg' | 'heading-md' | 'heading-sm' | 'heading-xs'
    | 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs'
    | 'label-lg' | 'label-md' | 'label-sm' | 'label-xs'
    // Legacy support - map to new system
    | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'tiny';
  className?: string;
  as?: React.ElementType;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

// Map legacy variants to new typography system
const legacyVariantMap = {
  'h1': 'heading-xl',
  'h2': 'heading-lg',
  'h3': 'heading-md',
  'h4': 'heading-sm',
  'body': 'body-md',
  'small': 'body-sm',
  'tiny': 'label-xs',
} as const;

const weightClasses = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function ResponsiveText({ 
  children, 
  variant, 
  className, 
  as: Component = 'span',
  weight
}: ResponsiveTextProps) {
  // Map legacy variant to new system if needed
  const mappedVariant = variant in legacyVariantMap 
    ? legacyVariantMap[variant as keyof typeof legacyVariantMap]
    : variant;

  return (
    <Component className={cn(
      `text-${mappedVariant}`,
      weight && weightClasses[weight],
      className
    )}>
      {children}
    </Component>
  );
}
