import TabsSection from "../TabsSection/TabsSection.jsx";
import classes from "../forecast/forecast.module.css";
import WeatherCard from "../weatherCard/weatherCard.jsx";
import { useState, useEffect } from "react";

export default function Forecast({ forecastData, cityData }) {
  const [infoForCards, setInfoForCards] = useState([]);
  const [countCards, setCountCards] = useState(24);

  useEffect(() => {
    if (forecastData) {
      console.log("132123");
      console.log(forecastData.hourly.time[1]);

      // setInfoForCards(forecastData.hourly.time.slice(0, 24));
    }
    const cards = [];
    for (let i = 0; i < countCards; i++) {
      cards.push(
        createCardObj(
          i, //index
          forecastData.hourly.time[i], //date
          forecastData.hourly.weather_code[i], //coed

          //description
          weatherDescription({
            code: forecastData.hourly.weather_code[i],
            isDay:
              parseInt(forecastData.hourly.time[i].slice(-5, -3), 10) >= 6 &&
              parseInt(forecastData.hourly.time[i].slice(-5, -3), 10) < 21
                ? 1
                : 0,
          }),
          forecastData.hourly.temperature_2m[i], //temp
          forecastData.hourly.apparent_temperature[i], //like
          [
            //wind speed and direction
            forecastData.hourly.wind_speed_10m[i],
            forecastData.hourly.wind_direction_10m[i],
          ],
          forecastData.hourly.relative_humidity_2m[i] //humidity
        )
      );
    }
    setInfoForCards(cards);
  }, [forecastData, countCards]);

  function createCardObj(
    index,
    date,
    code,
    description,
    temp,
    feels,
    wind,
    humidity
  ) {
    return {
      index: index,
      date: date,
      code: code,
      description: description,
      temp: temp,
      feels: feels,
      wind: wind,
      humidity: humidity,
    };
  }
  function weatherDescription({ code, isDay = 1 }) {
    switch (code) {
      case 0:
        return isDay === 1 ? "Солнечно" : "";

      case 1:
        return isDay === 1 ? "Малооблачно" : "Малооблачно";

      case 2:
        return isDay === 1 ? "Облачно" : "Облачно";

      case 3:
        return "Пасмурно";

      case 45:
      case 48:
        return "Туман";

      case 51:
      case 53:
      case 55:
        return "Морось";

      case 56:
      case 57:
        return "Снег с дождем";

      case 61:
      case 63:
      case 65:
        return "Дождь";

      case 66:
      case 67:
        return "Сильный дождь";

      case 80:
      case 81:
      case 82:
        return "Ливень";

      case 71:
      case 73:
      case 75:
        return "Снег";

      case 77:
        return "Снежная крупа";

      case 85:
      case 86:
        return "Снегопад";

      case 95:
      case 96:
      case 99:
        return "Гроза";

      default:
        return isDay === 1 ? "Облачно" : "Облачно";
    }
  }

  function onSelectButton(days = 1) {
    if (!forecastData || !forecastData.hourly) return;
    switch (days) {
      case 3:
        setCountCards(72);
        break;
      case 5:
        setCountCards(120);
        break;
      default:
        setCountCards(24);
    }
  }

  if (!forecastData || forecastData === null) {
    console.log("прогноз не получен", forecastData);
    return null;
  }
  //температура, ощущается, description,
  // time, city, code, description
  return (
    <>
      <TabsSection onSelectButton={onSelectButton} />
      {infoForCards.map((forecast, index) => (
        <WeatherCard
          index={index}
          key={`${forecast.date}-${index}`}
          date={forecast.date}
          code={forecast.code}
          description={forecast.description}
          city={cityData}
          temp={forecast.temp}
          feels={forecast.feels}
          wind={forecast.wind}
          humidity={forecast.humidity}
        />
      ))}
    </>
  );
}
