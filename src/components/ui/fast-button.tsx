/**
 * Fast Button Component - Optimized for instant navigation
 */

import React, { forwardRef, useCallback } from 'react';
import { Button, ButtonProps } from './button';
import { useOptimizedNavigation, useHoverPreload } from '@/lib/navigation-optimizer';
import { cn } from '@/lib/utils';

interface FastButtonProps extends ButtonProps {
  href?: string;
  preloadOnHover?: boolean;
  preloadNext?: string[];
  showLoadingState?: boolean;
  optimisticUpdate?: () => void;
}

export const FastButton = forwardRef<HTMLButtonElement, FastButtonProps>(
  ({ 
    href, 
    preloadOnHover = true, 
    preloadNext = [],
    showLoadingState = false,
    optimisticUpdate,
    onClick,
    onMouseEnter,
    className,
    children,
    ...props 
  }, ref) => {
    const { navigateFast } = useOptimizedNavigation();
    const handleHoverPreload = useHoverPreload();

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      // Run optimistic update first
      if (optimisticUpdate) {
        optimisticUpdate();
      }

      // Handle navigation
      if (href) {
        e.preventDefault();
        navigateFast(href, { 
          showLoadingState, 
          preloadNext 
        });
      }

      // Call original onClick
      if (onClick) {
        onClick(e);
      }
    }, [href, navigateFast, showLoadingState, preloadNext, optimisticUpdate, onClick]);

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      // Preload on hover
      if (preloadOnHover && href) {
        handleHoverPreload(href);
        // Also preload next routes
        preloadNext.forEach(route => handleHoverPreload(route));
      }

      // Call original onMouseEnter
      if (onMouseEnter) {
        onMouseEnter(e);
      }
    }, [preloadOnHover, href, handleHoverPreload, preloadNext, onMouseEnter]);

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={cn(
          // Fast transition classes
          'transition-all duration-200 ease-out',
          'hover:scale-[1.02] active:scale-[0.98]',
          'transform-gpu will-change-transform',
          // Loading state styles
          showLoadingState && 'relative overflow-hidden',
          className
        )}
        {...props}
      >
        {children}
        {showLoadingState && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer opacity-0 group-hover:opacity-100" />
        )}
      </Button>
    );
  }
);

FastButton.displayName = 'FastButton';