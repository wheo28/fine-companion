// Lightweight, dependency-free inline icons.
// Stroke uses currentColor so icons inherit text color.

function Svg({ children, size = 20, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export function ArrowRight(props) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Svg>
  )
}

export function Compass(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </Svg>
  )
}

export function Sunrise(props) {
  return (
    <Svg {...props}>
      <path d="M12 2v3" />
      <path d="m5 8 1.5 1.5" />
      <path d="M2 16h4" />
      <path d="M18 16h4" />
      <path d="m17.5 9.5 1.5-1.5" />
      <path d="M22 20H2" />
      <path d="M8 16a4 4 0 0 1 8 0" />
    </Svg>
  )
}

export function BookOpen(props) {
  return (
    <Svg {...props}>
      <path d="M12 7v13" />
      <path d="M3 5.5A19 19 0 0 1 12 7a19 19 0 0 1 9-1.5V18a19 19 0 0 0-9 1.5A19 19 0 0 0 3 18Z" />
    </Svg>
  )
}

export function ShieldCheck(props) {
  return (
    <Svg {...props}>
      <path d="M12 3 5 6v5c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6Z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  )
}

export function Check(props) {
  return (
    <Svg {...props}>
      <path d="m5 12 4.5 4.5L19 7" />
    </Svg>
  )
}

export function NoEntry(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M6 6 18 18" />
    </Svg>
  )
}

export function Spark(props) {
  return (
    <Svg {...props}>
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="M12 9a3 3 0 0 0 3 3 3 3 0 0 0-3 3 3 3 0 0 0-3-3 3 3 0 0 0 3-3Z" />
    </Svg>
  )
}
