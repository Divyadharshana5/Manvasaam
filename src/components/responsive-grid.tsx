import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "sm" | "md" | "lg";
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = "md",
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4 md:gap-6",
    lg: "gap-6 md:gap-8",
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  return (
    <div
      className={cn(
        "grid w-full",
        cols.default && gridCols[cols.default as keyof typeof gridCols],
        cols.sm && `sm:${gridCols[cols.sm as keyof typeof gridCols]}`,
        cols.md && `md:${gridCols[cols.md as keyof typeof gridCols]}`,
        cols.lg && `lg:${gridCols[cols.lg as keyof typeof gridCols]}`,
        cols.xl && `xl:${gridCols[cols.xl as keyof typeof gridCols]}`,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
