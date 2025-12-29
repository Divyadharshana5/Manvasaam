"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

interface FastLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetchOnMount?: boolean;
  prefetchOnHover?: boolean;
  onClick?: () => void;
  [key: string]: any;
}

export function FastLink({
  href,
  children,
  className,
  prefetchOnMount = true,
  prefetchOnHover = true,
  onClick,
  ...props
}: FastLinkProps) {
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const prefetchedRef = useRef(false);

  // Prefetch on mount for critical routes - optimized to avoid duplicates
  useEffect(() => {
    if (
      prefetchOnMount &&
      !prefetchedRef.current &&
      typeof document !== "undefined"
    ) {
      router.prefetch(href);
      prefetchedRef.current = true;

      // Add browser-level prefetch only if it doesn't exist
      const existingLink = document.querySelector(
        `link[rel="prefetch"][href="${href}"]`
      );
      if (!existingLink) {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = href;
        link.as = "document";
        document.head.appendChild(link);
      }
    }
  }, [href, router, prefetchOnMount]);

  // Intersection Observer for viewport-based prefetching
  useEffect(() => {
    if (!prefetchOnMount && linkRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !prefetchedRef.current) {
              router.prefetch(href);
              prefetchedRef.current = true;
            }
          });
        },
        { rootMargin: "100px" }
      );

      observer.observe(linkRef.current);
      return () => observer.disconnect();
    }
  }, [href, router, prefetchOnMount]);

  const handleMouseEnter = useCallback(() => {
    if (prefetchOnHover && !prefetchedRef.current) {
      router.prefetch(href);
      prefetchedRef.current = true;
    }
  }, [href, router, prefetchOnHover]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Prefetch one more time for instant navigation
      router.prefetch(href);

      // Add haptic feedback for mobile
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }

      onClick?.();
    },
    [href, router, onClick]
  );

  return (
    <Link
      ref={linkRef}
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter}
      onFocus={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}
