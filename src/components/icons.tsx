import type { SVGProps } from 'react';

export function HesaabProLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
      <path d="M12 16v-4"></path>
      <path d="M12 8h.01"></path>
      <path d="M16 12h-4"></path>
    </svg>
  );
}
