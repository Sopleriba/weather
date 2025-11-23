import { useState } from "react";
import "./App.css";
import Search from "./components/search/search.jsx";
import WeatherIcon from "./components/weatherCard/weatherIcon.jsx";
import WeatherCard from "./components/weatherCard/weatherCard.jsx";
import Forecast from "./components/forecast/forecast.jsx";

function App() {
  const [forecastData, setForecastData] = useState();
  const [city, setCity] = useState();

  function getForecast(data) {
    setForecastData(data);
  }
  function getCity1(city) {
    const City = city.charAt(0).toUpperCase() + city.slice(1);
    setCity(City);
  }

  return (
    <>
      <div id="main_block">
        <h1 id="main_inscription">Weather</h1>
        <Search getForecast={getForecast} getCity={getCity1} />
        {forecastData ? (
          <Forecast forecastData={forecastData} cityData={city} />
        ) : null}
      </div>

    </>
  );
}

export default App;
