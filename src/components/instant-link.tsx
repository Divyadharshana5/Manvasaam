"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

interface InstantLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}

/**
 * InstantLink - A link component optimized for instant navigation
 * Prefetches aggressively and navigates immediately
 */
export function InstantLink({ href, children, className, onNavigate }: InstantLinkProps) {
  const router = useRouter();
  const prefetchedRef = useRef(false);

  // Prefetch immediately on mount
  useEffect(() => {
    if (!prefetchedRef.current) {
      router.prefetch(href);
      prefetchedRef.current = true;
    }
  }, [router, href]);

  // Prefetch on hover/touch
  const handleInteraction = useCallback(() => {
    router.prefetch(href);
  }, [router, href]);

  // Navigate instantly on click
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.();
    router.push(href);
  }, [router, href, onNavigate]);

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      onMouseEnter={handleInteraction}
      onTouchStart={handleInteraction}
      onFocus={handleInteraction}
    >
      {children}
    </a>
  );
}
