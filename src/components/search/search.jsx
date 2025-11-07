import { useState } from "react";
import Button from "../button/button.jsx";
import classes from "./search.module.css";
import { useEffect } from "react";
import SuggestionsList from "../suggestions/suggestionsList.jsx";
import Input from "../input/input.jsx";
import TabsSection from "../TabsSection/TabsSection.jsx";

export default function Search({ getForecast, getCity }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [coord, setCoord] = useState([]);
  const [check_input, setCheck_input] = useState(0);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [isRsponsed, setIsRsponsed] = useState(false);

  useEffect(() => {
    const clickEnter = (event) => {
      if (event.key === "Enter") {
        console.log("query: ", query);

        onClickSearchButt(coord, query);
      }
    };

    document.addEventListener("keydown", clickEnter);

    return () => {
      document.removeEventListener("keydown", clickEnter);
    };
  }, [coord, query]);

  const handleChange = async (e) => {
    const value = e.target.value;
    const input = document.querySelector(`.${classes.input}`);
    setHasError(false);
    setQuery(value);
    setCheck_input(0);

    if (value.length > 1) {
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(
            value
          )}&lang=default&limit=10&osm_tag=place:city`
        );

        const response_json = await response.json();

        const data = [];
        const check = new Set();

        for (const feature of response_json.features) {
          const city = feature.properties.name;
          const country = feature.properties.country;
          const key = `${city}-${country}`;

          if (!check.has(key)) {
            check.add(key);
            data.push(feature);
          }
        }
        if (data.length > 0) {
        }
        setSuggestions(data || []);
      } catch (err) {
        console.error("Ошибка при выполнии запроса подсказок:", err);
      }
    } else {
      setSuggestions([]);
    }
  };
  async function requestWeatherForCoord(coordinates) {
    try {
      return await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[1]}&lon=${coordinates[0]}&appid=89e57a1856bf2c6e661180d8eee2fe8e&units=metric&lang=ru`
      );
    } catch (err) {
      console.error(err);
    }
  }
  async function searchCoordinatesForCity(city) {
    try {
      return await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=89e57a1856bf2c6e661180d8eee2fe8e`
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function onClickSearchButt(coordinates, city) {
    setErrorName("");
    setHasError(false);
    setSuggestions([]);
    // setSearchTriggered(true)

    console.log("check_input: ", check_input);

    if (check_input == 1 && coordinates.length == 2) {
      try {
        console.log("запрос погоды");

        const response_weather = await requestWeatherForCoord(coordinates);

        const data = await response_weather.json();
        getForecast(data);
        console.log("data: ", data);
      } catch (err) {
        console.error("ошибка запроса погоды: ", err);
        setHasError(true);
        setErrorName("Не удалось найти погоду в этом городе");
      }
    } else if (check_input == 0 || coordinates.length != 2) {
      const response = await searchCoordinatesForCity(city);
      const data = await response.json();
      console.log("data: ", data);

      if (data.length > 0) {
        const coord = [];
        coord.push(data[0].lon);
        coord.push(data[0].lat);
        console.log("coord: ", coord);
        const response_weather = await (
          await requestWeatherForCoord(coord)
        ).json();
        console.log("response_weather: ", response_weather);
        getForecast(response_weather);
        getCity(query);
        console.log(response_weather.list[0].weather[0].description);
      } else {
        console.log("координаты не найдены");
        setErrorName("Город не найден");
        setHasError(true);
        setSuggestions([]);
      }
    }
  }

  return (
    <div>
      <section className={classes.search_and_sugg_section}>
        <div className={classes.search_block}>
          <Input
            query={query}
            onChange={handleChange}
            hasError={hasError}
          ></Input>
          <Button
            value="Найти"
            onClick={() => onClickSearchButt(coord, query)}
          ></Button>
        </div>
        {hasError ? <p className={classes.errorMessage}>{errorName}</p> : null}

        <SuggestionsList
          suggestions={suggestions}
          setQuery={setQuery}
          setCoord={setCoord}
          setSuggestions={setSuggestions}
          setCheck_input={setCheck_input}
        />
      </section>
    </div>
  );
}
