import type * as React from "react";

interface SanadLogoProps extends React.ComponentProps<"svg"> {
  /** عرض الأيقونة فقط (ثلاث كتل بنفسجية) بدون الاسم */
  iconOnly?: boolean;
}

export function SanadLogo({
  className,
  iconOnly = false,
  ...props
}: SanadLogoProps) {
  if (iconOnly) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="2198.31 616.59 867 433.5"
        className={className}
        aria-label="شعار سند"
        {...props}
      >
        <g fill="#9b18e7">
          <polygon points="2776.31 1050.09 3065.31 905.59 3065.31 616.59 2776.31 761.09 2776.31 1050.09" />
          <polygon points="2487.31 1050.09 2776.31 905.59 2776.31 616.59 2487.31 761.09 2487.31 1050.09" />
          <polygon points="2198.31 1050.09 2487.31 905.59 2487.31 616.59 2198.31 761.09 2198.31 1050.09" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 530 1540 540"
      className={className}
      aria-label="شعار سند"
      role="img"
      {...props}
    >
      <defs>
        <style>{`
          .sanad-ar-text {
            font-family: 'thmanyah sans', 'IBM Plex Sans Arabic', system-ui, -apple-system, sans-serif;
            font-size: 320px;
            font-weight: 700;
            fill: #9b18e7;
          }
          .sanad-en-text {
            font-family: 'Clash Display', 'Inter', system-ui, -apple-system, sans-serif;
            font-size: 200px;
            font-weight: 800;
            letter-spacing: 0.04em;
            fill: #9b18e7;
          }
          .sanad-icon-blocks {
            fill: #9b18e7;

          }
        `}</style>
      </defs>

      {/* اسم سند (عربي وإنجليزي) */}
      <g style={{ direction: "ltr" }} >
        <text className="sanad-ar-text" x="40" y="825">
          سنـــــد
        </text>
        <text className="sanad-en-text" x="40" y="1035">
          SANAD
        </text>
      </g>

      {/* أيقونة سند بحجم مصغّر متناسق (scale 0.8) لتتناسب تماماً مع حجم النص */}
      <g transform="translate(-958.65, 163.33) scale(0.8)" className="sanad-icon-blocks">
        <polygon points="2776.31 1050.09 3065.31 905.59 3065.31 616.59 2776.31 761.09 2776.31 1050.09" />
        <polygon points="2487.31 1050.09 2776.31 905.59 2776.31 616.59 2487.31 761.09 2487.31 1050.09" />
        <polygon points="2198.31 1050.09 2487.31 905.59 2487.31 616.59 2198.31 761.09 2198.31 1050.09" />
      </g>
    </svg>
  );
}
