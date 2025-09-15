"use client";

import { Button } from "@/components/ui/button";
import { useFastNavigation } from "@/lib/navigation-optimizer";
import { useHoverPreload } from "@/lib/navigation-optimizer";
import { cn } from "@/lib/utils";
import { forwardRef, useCallback } from "react";

interface FastNavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
  preloadNext?: string[];
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

export const FastNavButton = forwardRef<HTMLButtonElement, FastNavButtonProps>(
  ({ href, preloadNext = [], variant = "default", size = "default", className, children, ...props }, ref) => {
    const { navigateWithPreload } = useFastNavigation();
    const { handleHover, handleClick } = useHoverPreload();

    const handleNavigation = useCallback(() => {
      handleClick(href);
      navigateWithPreload(href, preloadNext);
    }, [href, preloadNext, navigateWithPreload, handleClick]);

    const handleMouseEnter = useCallback(() => {
      handleHover(href);
    }, [href, handleHover]);

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn("fast-button transition-all duration-75", className)}
        onClick={handleNavigation}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

FastNavButton.displayName = "FastNavButton";