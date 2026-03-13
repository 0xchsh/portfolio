/* eslint-disable @next/next/no-img-element */

const weatherMap: Record<number, string> = {
  // Clear / Sunny
  113: '/icons/weather/clear-day.svg',
  // Partly cloudy
  116: '/icons/weather/partly-cloudy-day.svg',
  // Cloudy / Overcast
  119: '/icons/weather/cloudy.svg',
  122: '/icons/weather/cloudy.svg',
  // Fog / Mist
  143: '/icons/weather/fog.svg',
  248: '/icons/weather/fog.svg',
  260: '/icons/weather/fog.svg',
  // Rain
  176: '/icons/weather/rain.svg',
  263: '/icons/weather/rain.svg',
  266: '/icons/weather/rain.svg',
  281: '/icons/weather/rain.svg',
  284: '/icons/weather/rain.svg',
  293: '/icons/weather/rain.svg',
  296: '/icons/weather/rain.svg',
  299: '/icons/weather/rain.svg',
  302: '/icons/weather/rain.svg',
  305: '/icons/weather/rain.svg',
  308: '/icons/weather/rain.svg',
  311: '/icons/weather/rain.svg',
  314: '/icons/weather/rain.svg',
  317: '/icons/weather/rain.svg',
  320: '/icons/weather/rain.svg',
  353: '/icons/weather/rain.svg',
  356: '/icons/weather/rain.svg',
  359: '/icons/weather/rain.svg',
  362: '/icons/weather/rain.svg',
  365: '/icons/weather/rain.svg',
  // Snow
  179: '/icons/weather/snow.svg',
  182: '/icons/weather/snow.svg',
  185: '/icons/weather/snow.svg',
  227: '/icons/weather/snow.svg',
  230: '/icons/weather/snow.svg',
  323: '/icons/weather/snow.svg',
  326: '/icons/weather/snow.svg',
  329: '/icons/weather/snow.svg',
  332: '/icons/weather/snow.svg',
  335: '/icons/weather/snow.svg',
  338: '/icons/weather/snow.svg',
  350: '/icons/weather/snow.svg',
  368: '/icons/weather/snow.svg',
  371: '/icons/weather/snow.svg',
  374: '/icons/weather/snow.svg',
  377: '/icons/weather/snow.svg',
  392: '/icons/weather/snow.svg',
  395: '/icons/weather/snow.svg',
  // Thunderstorm
  200: '/icons/weather/thunderstorms-rain.svg',
  386: '/icons/weather/thunderstorms-rain.svg',
  389: '/icons/weather/thunderstorms-rain.svg',
};

export function WeatherIcon({ code, size = 22 }: { code: number; size?: number }) {
  const src = weatherMap[code] || '/icons/weather/clear-day.svg';

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
