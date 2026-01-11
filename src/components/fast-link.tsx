"use client";

import Link from "next/link";
import React from "react";

type FastLinkProps = React.ComponentProps<typeof Link> & {
  children: React.ReactNode;
  prefetchOnMount?: boolean;
  className?: string;
};

export function FastLink({ href, children, prefetchOnMount, className, ...rest }: FastLinkProps) {
  // Map prefetchOnMount (custom prop) to Next.js Link `prefetch` prop
  const prefetch = !!prefetchOnMount;
  return (
    <Link href={href as any} prefetch={prefetch} className={className} {...rest}>
      {children}
    </Link>
  );
}
