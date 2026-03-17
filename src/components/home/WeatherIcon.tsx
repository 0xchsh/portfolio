/* eslint-disable @next/next/no-img-element */

const weatherMap: Record<number, string> = {
  // Clear
  0: '/icons/weather/clear-day.svg',
  // Mainly clear / Partly cloudy
  1: '/icons/weather/partly-cloudy-day.svg',
  2: '/icons/weather/partly-cloudy-day.svg',
  // Overcast
  3: '/icons/weather/cloudy.svg',
  // Fog
  45: '/icons/weather/fog.svg',
  48: '/icons/weather/fog.svg',
  // Drizzle
  51: '/icons/weather/rain.svg',
  53: '/icons/weather/rain.svg',
  55: '/icons/weather/rain.svg',
  // Rain
  61: '/icons/weather/rain.svg',
  63: '/icons/weather/rain.svg',
  65: '/icons/weather/rain.svg',
  // Snow
  71: '/icons/weather/snow.svg',
  73: '/icons/weather/snow.svg',
  75: '/icons/weather/snow.svg',
  77: '/icons/weather/snow.svg',
  // Rain showers
  80: '/icons/weather/rain.svg',
  81: '/icons/weather/rain.svg',
  82: '/icons/weather/rain.svg',
  // Snow showers
  85: '/icons/weather/snow.svg',
  86: '/icons/weather/snow.svg',
  // Thunderstorm
  95: '/icons/weather/thunderstorms-rain.svg',
  96: '/icons/weather/thunderstorms-rain.svg',
  99: '/icons/weather/thunderstorms-rain.svg',
};

export function WeatherIcon({ code, size = 22 }: { code: number; size?: number }) {
  const src = weatherMap[code] ?? '/icons/weather/clear-day.svg';

  return (
    <span className="inline-flex -mr-px" style={{ mixBlendMode: 'normal', isolation: 'isolate' }}>
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className="saturate-150 drop-shadow-[0_0_0.5px_rgba(0,0,0,0.25)]"
      />
    </span>
  );
}
