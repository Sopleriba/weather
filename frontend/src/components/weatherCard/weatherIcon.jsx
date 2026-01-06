import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiCloudy,
  WiShowers,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiSnowflakeCold,
  WiFog,
  WiSnowWind,
  WiNightAltPartlyCloudy,
  WiSprinkle,
  WiSleet,
  WiStormShowers,
} from "react-icons/wi";

export default function weatherIcon({ code, isDay = 1, size = 100 }) {
  switch (code) {
    case 0:
      return isDay === 1 ? (
        <WiDaySunny size={size} />
      ) : (
        <WiNightClear size={size} />
      );

    case 1:
      return isDay === 1 ? (
        <WiDayCloudy size={size} />
      ) : (
        <WiNightAltPartlyCloudy size={size} />
      );

    case 2:
      return isDay === 1 ? (
        <WiDayCloudy size={size} />
      ) : (
        <WiNightAltCloudy size={size} />
      );

    case 3:
      return <WiCloudy size={size} />;

    case 45:
    case 48:
      return <WiFog size={size} />;

    case 51:
    case 53:
    case 55:
      return <WiSprinkle size={size} />;

    case 56:
    case 57:
      return <WiSleet size={size} />;

    case 61:
    case 63:
    case 65:
      return <WiRain size={size} />;

    case 66:
    case 67:
      return <WiRainMix size={size} />;

    case 80:
    case 81:
    case 82:
      return <WiStormShowers size={size} />;

    case 71:
    case 73:
    case 75:
    case 77:
      return <WiSnow size={size} />;

    case 85:
    case 86:
      return <WiSnowWind size={size} />;

    case 95:
    case 96:
    case 99:
      return <WiThunderstorm size={size} />;

    default:
      return isDay === 1 ? (
        <WiDayCloudy size={size} />
      ) : (
        <WiNightAltCloudy size={size} />
      );
  }
}
