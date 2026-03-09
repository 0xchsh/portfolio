const s = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const gray = '#9ca3af';
const yellow = '#f59e0b';
const blue = '#60a5fa';
const lightBlue = '#93c5fd';
const amber = '#fbbf24';

// Shared cloud path
const cloud = 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242';

/* ── Sun ─────────────────────────────────────────────────────────────────── */
function AnimatedSun() {
  return (
    <svg {...s}>
      <circle cx="12" cy="12" r="4" stroke={yellow} />
      <g stroke={yellow}>
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="20s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
}

/* ── Cloud + Sun ─────────────────────────────────────────────────────────── */
function AnimatedCloudSun() {
  return (
    <svg {...s}>
      <g stroke={yellow}>
        <path d="M12 2v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="M20 12h2" />
        <path d="m19.07 4.93-1.41 1.41" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 15 5"
          to="360 15 5"
          dur="20s"
          repeatCount="indefinite"
        />
      </g>
      <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" stroke={yellow} />
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" stroke={gray} />
    </svg>
  );
}

/* ── Cloud ────────────────────────────────────────────────────────────────── */
function AnimatedCloud() {
  return (
    <svg {...s}>
      <g stroke={gray}>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0;1 -0.5;0 0;-1 -0.5;0 0"
          dur="6s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
}

/* ── Rain ─────────────────────────────────────────────────────────────────── */
function AnimatedRain() {
  const drops = [
    { x: 8, dur: '0.75s', begin: '0s' },
    { x: 12, dur: '0.7s', begin: '0.35s' },
    { x: 16, dur: '0.8s', begin: '0.15s' },
  ];
  return (
    <svg {...s}>
      <path d={cloud} stroke={gray} />
      {drops.map(({ x, dur, begin }) => (
        <line key={x} x1={x} y1="16" x2={x} y2="18" stroke={blue}>
          <animate attributeName="y1" values="16;23" dur={dur} begin={begin} repeatCount="indefinite" />
          <animate attributeName="y2" values="18;25" dur={dur} begin={begin} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur={dur} begin={begin} repeatCount="indefinite" />
        </line>
      ))}
    </svg>
  );
}

/* ── Snow ─────────────────────────────────────────────────────────────────── */
function AnimatedSnow() {
  const flakes = [
    { cx: 8, dur: '2.2s', begin: '0s' },
    { cx: 14, dur: '2.6s', begin: '0.6s' },
    { cx: 11, dur: '2.4s', begin: '1.2s' },
  ];
  return (
    <svg {...s}>
      <path d={cloud} stroke={gray} />
      {flakes.map(({ cx, dur, begin }) => (
        <circle key={cx} cx={cx} cy="16" r="1.2" fill={lightBlue} stroke="none">
          <animate attributeName="cy" values="16;24" dur={dur} begin={begin} repeatCount="indefinite" />
          <animate
            attributeName="cx"
            values={`${cx};${cx - 1};${cx + 1};${cx}`}
            dur={dur}
            begin={begin}
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="1;1;0" dur={dur} begin={begin} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/* ── Lightning ────────────────────────────────────────────────────────────── */
function AnimatedLightning() {
  return (
    <svg {...s}>
      <path d={cloud} stroke={gray} />
      <path d="M13 16l-2 4h3l-2 4" stroke={amber}>
        <animate
          attributeName="opacity"
          values="0;0;0;0;0;0;1;0;0;1;0;0;0;0;0;0;0;0;0;0"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

/* ── Fog ──────────────────────────────────────────────────────────────────── */
function AnimatedFog() {
  return (
    <svg {...s}>
      <path d={cloud} stroke={gray} />
      <path d="M16 17H7" stroke={gray}>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M17 21H9" stroke={gray}>
        <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

/* ── Export ────────────────────────────────────────────────────────────────── */
export function WeatherIcon({ code }: { code: number }) {
  const snow = [179, 182, 185, 227, 230, 323, 326, 329, 332, 335, 338, 350, 368, 371, 374, 377, 392, 395];
  const rain = [176, 263, 266, 281, 284, 293, 296, 299, 302, 305, 308, 311, 314, 317, 320, 353, 356, 359, 362, 365];

  let icon: React.ReactNode;
  if (snow.includes(code)) icon = <AnimatedSnow />;
  else if (rain.includes(code)) icon = <AnimatedRain />;
  else if ([200, 386, 389].includes(code)) icon = <AnimatedLightning />;
  else if ([143, 248, 260].includes(code)) icon = <AnimatedFog />;
  else if (code === 116) icon = <AnimatedCloudSun />;
  else if ([119, 122].includes(code)) icon = <AnimatedCloud />;
  else icon = <AnimatedSun />;

  return (
    <span className="inline-flex" style={{ mixBlendMode: 'normal', isolation: 'isolate' }}>
      {icon}
    </span>
  );
}
