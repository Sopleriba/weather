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
  WiFog,
} from "react-icons/wi";

export default function weatherIcon({ code, size = 100 }) {
  switch (code) {
    case "01d":
      return <WiDaySunny size={size} />;
    case "01n":
      return <WiNightClear size={size} />;
    case "02d":
      return <WiDayCloudy size={size} />;
    case "02n":
      return <WiNightAltCloudy size={size} />;
    case "03d":
    case "03n":
      return <WiCloud size={size} />;
    case "04d":
    case "04n":
      return <WiCloudy size={size} />;
    case "09d":
    case "09n":
      return <WiShowers size={size} />;
    case "10d":
    case "10n":
      return <WiRain size={size} />;
    case "11d":
    case "11n":
      return <WiThunderstorm size={size} />;
    case "13d":
    case "13n":
      return <WiSnow size={size} />;
    case "50d":
    case "50n":
      return <WiFog size={size} />;
    default:
      return <WiCloud size={size} />;
  }
}
