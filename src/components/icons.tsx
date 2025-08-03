import type { SVGProps } from 'react';

export function AgriLinkLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 4 13c0-3.9 3.1-7 7-7 2.5 0 4.8.9 6.4 2.3" />
      <path d="M11 20v-8" />
      <path d="m14.3 10.7 4.3-4.3" />
      <path d="M13 22a7 7 0 0 0 7-7c0-3.9-3.1-7-7-7" />
      <path d="M13 2v8" />
      <path d="m9.7 13.3-4.3 4.3" />
    </svg>
  );
}
