import TabsSection from "../TabsSection/TabsSection.jsx";
import { useState } from "react";
import classes from "../forecast/forecast.module.css";
import { useEffect } from "react";
import WeatherCard from "../weatherCard/weatherCard.jsx";

export default function Forecast({ forecastData, cityData }) {
  const [infoForCards, setInfoForCards] = useState(
    forecastData.list.slice(0, 8)
  );

  useEffect(() => {
    if (forecastData && forecastData.list) {
      setInfoForCards(forecastData.list.slice(0, 8));
    }
  }, [forecastData]);

  function onSelectButton(days = 1) {
    if (!forecastData || !forecastData.list) return;
    switch (days) {
      case 3:
        setInfoForCards(forecastData.list.slice(0, 24));
        break;
      case 5:
        setInfoForCards(forecastData.list.slice(0, 40));

        break;
      default:
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
      <TabsSection onSelectButton={onSelectButton} />
      {infoForCards.map((forecast, index) => (
        <WeatherCard
          index={index}
          key={index}
          data={forecast.dt_txt}
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
