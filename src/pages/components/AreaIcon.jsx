export default function AreaIcon({ type, ...props }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {type === 'd20' ? <>
        <path d="M32 4 57 19v28L32 61 7 47V19Z M32 4 19 24 7 19 M32 4l13 20 12-5 M19 24h26L32 47Z M7 47l12-23 M57 47 45 24 M7 47h25l25 0 M32 47v14" />
        <text x="32" y="36" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11" fontWeight="700">20</text>
      </> : <>
        <path d="M32 15C24 9 13 9 6 12v40c9-3 18-2 26 4 8-6 17-7 26-4V12c-7-3-18-3-26 3Z M32 15v41 M13 21c4-1 9 0 13 2 M13 30c4-1 9 0 13 2 M38 23c4-2 9-3 13-2 M38 32c4-2 9-3 13-2" />
      </>}
    </svg>
  );
}
