import type { JSX, SVGProps } from "react";

export type Icon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

export const BezierIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      d="M3 25h4v4H3zM25 3h4v4h-4zm0 2C14 5 5 14 5 25v0"
      style={{
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 10,
      }}
    />
  </svg>
);

export const StepIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12.25 14a.75.75 0 0 0 0-1.5h-3a1.75 1.75 0 0 1-1.75-1.75v-.25a1.75 1.75 0 0 0 1.75-1.75v-1.5A1.75 1.75 0 0 0 7.5 5.5V2.75a.75.75 0 0 0-1.5 0V5.5a1.75 1.75 0 0 0-1.75 1.75v1.5c0 .966.784 1.75 1.75 1.75v.25A3.25 3.25 0 0 0 9.25 14zm-6.5-6.75A.25.25 0 0 1 6 7h1.5a.25.25 0 0 1 .25.25v1.5A.25.25 0 0 1 7.5 9H6a.25.25 0 0 1-.25-.25z"
      clipRule="evenodd"
    />
  </svg>
);

export const StraightLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M2 19v3h3v-2.293L19.707 5H22V2h-3v2.293L4.293 19zm2 2H3v-1h1zM20 3h1v1h-1z" />
    <path fill="none" d="M0 0h24v24H0z" />
  </svg>
);
