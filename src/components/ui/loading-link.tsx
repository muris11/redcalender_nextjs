"use client";

import Link, { LinkProps } from "next/link";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode } from "react";

interface LoadingLinkProps extends Omit<LinkProps, 'onClick'> {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function LoadingLink({ 
  href, 
  children, 
  className, 
  onClick,
  ...props 
}: LoadingLinkProps) {
  const { startLoading } = useLoading();
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Jika ada onClick custom, jalankan dulu
    if (onClick) {
      onClick(e);
      if (e.defaultPrevented) return;
    }

    // Jika external link atau target blank, skip loading
    const isExternal = typeof href === 'string' && (
      href.startsWith('http') || 
      href.startsWith('mailto:') || 
      href.startsWith('tel:')
    );
    
    if (isExternal || props.target === '_blank') return;

    // Prevent default dan trigger loading
    e.preventDefault();
    startLoading();
    
    // Navigate setelah sedikit delay untuk smooth transition
    setTimeout(() => {
      router.push(href.toString());
    }, 100);
  };

  return (
    <Link 
      href={href} 
      onClick={handleClick} 
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
