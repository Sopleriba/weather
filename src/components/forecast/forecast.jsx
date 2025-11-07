import TabsSection from "../TabsSection/TabsSection.jsx";
import { useState } from "react";
import classes from "../forecast/forecast.module.css";
import { useEffect } from "react";
import WeatherCard from "../weatherCard/weatherCard.jsx";

export default function Forecast({ forecastData, cityData }) {
  const [infoForCards, setInfoForCards] = useState(
    forecastData.list.slice(0, 8)
  );

  function onSelectButton(days = 1) {
    switch (days) {
      case 3:
        // setHowManyCards(24);
        setInfoForCards(forecastData.list.slice(0, 24));
        break;
      case 5:
        // setHowManyCards(40);
        setInfoForCards(forecastData.list.slice(0, 40));

        break;
      default:
        // setHowManyCards(8);ф
        setInfoForCards(forecastData.list.slice(0, 8));
    }
  }

  if (!forecastData || !forecastData.list) {
    console.log("прогноз не получен", forecastData);
    return null;
  }
  //температура, ощущается, description,
  // time, city, code, description
  return (
    <>
      <TabsSection onSelectButton={onSelectButton} />;
      {infoForCards.map((forecast, index) => (
        <WeatherCard
          key={index}
          time={forecast.dt_txt}
          code={forecast.weather[0].icon}
          description={forecast.weather[0].description}
          city={cityData}
          temp={forecast.main.temp}
          feels={forecast.main.feels_like}
          wind={forecast.wind}
          humidity={forecast.main.humidity}
        />
      ))}
    </>
  );
}
