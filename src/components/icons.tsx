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
        <rect width="16" height="16" x="4" y="4" rx="2" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
    </svg>
  );
}
