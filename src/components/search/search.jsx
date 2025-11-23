import { useRef, useState } from "react";
import Button from "../button/button.jsx";
import classes from "./search.module.css";
import { useEffect } from "react";
import SuggestionsList from "../suggestions/suggestionsList.jsx";
import Input from "../input/input.jsx";

export default function Search({ getForecast, getCity }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [coord, setCoord] = useState([]);
  const [check_input, setCheck_input] = useState(0); //проверка, воспользовался ли ползователь подсказкой (1) или ввел запрос вручную (0)
  const [hasError, setHasError] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [responseWeather, setResponseWeather] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  const refSearch = useRef(null);
  const refSuggList = useRef(null);
  const timer = useRef();

  //проблема 1: нужно отменять первый запрос если уже начал выполнятся второй, либо поменять как-то апи, тк долгие запросы
  //проблема 2: че-то странное происходит если по разному делать запрос, типо через энтер, мышкой, таб и тд
  //дописать погоду в карточках
  //вывод начала нового дня не работает
  //сделать красивее подсказки

  //навигация по подсказкам, и выполнение поиска при нажатии enter
  useEffect(() => {
    function suggNavigation(event) {
      if (suggestions.length === 0) return;
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          if (activeSuggestion === null && query.length >= 2) {
            onClickSearchButt(coord, query);
          } else if (activeSuggestion !== null && suggestions.length > 0) {
            const selected = suggestions[activeSuggestion];
            setQuery(selected.properties.name);
            setCoord(selected.geometry.coordinates);
            onClickSearchButt(
              selected.geometry.coordinates,
              selected.properties.name
            );
          }
          break;
        case "Tab":
          if (activeSuggestion === null) {
            setActiveSuggestion(0);
          } else {
            event.preventDefault();
            setActiveSuggestion((prev) =>
              prev < suggestions.length - 1 ? prev + 1 : 0
            );
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          setActiveSuggestion((prev) =>
            prev === 0 ? suggestions.length - 1 : prev - 1
          );
          break;

        case "ArrowDown":
          event.preventDefault();
          setActiveSuggestion((prev) =>
            prev === suggestions.length - 1 ? 0 : prev + 1
          );
          break;

        default:
          break;
      }
    }

    document.addEventListener("keydown", suggNavigation);
    return () => document.removeEventListener("keydown", suggNavigation);
  }, [suggestions, activeSuggestion, coord, query]);

  //отслеживание кликов вне поиска
  useEffect(() => {
    function clickOutsideSearch(event) {
      if (
        refSearch.current &&
        refSuggList.current &&
        !refSearch.current.contains(event.target) &&
        !refSuggList.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", clickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", clickOutsideSearch);
    };
  }, []);

  function handleChangeDedouns(e) {
    const value = e.target.value;
    setHasError(false);
    setQuery(value);
    setCheck_input(0);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      handleChange(value);
    }, 400);
  }

  const handleChange = async (value) => {
    // const input = document.querySelector(`.${classes.input}`);

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
          setSuggestions(data || []);
          console.log(data[0].properties.name);
        }
      } catch (err) {
        console.error("Ошибка при выполнии запроса подсказок:", err);
        return null;
      }
    } else {
      setSuggestions([]);
    }
  };
  async function requestWeatherForCoord(coordinates) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[1]}&lon=${coordinates[0]}&appid=89e57a1856bf2c6e661180d8eee2fe8e&units=metric&lang=ru`
      );
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  async function searchCoordinatesForCity(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=89e57a1856bf2c6e661180d8eee2fe8e`
      );
      if (!response.ok) return null;
      return await response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function onClickSearchButt(coordinates, city) {
    setErrorName("");
    setHasError(false);
    setSuggestions([]);

    console.log("check_input: ", check_input);
    console.log("coond: ", coordinates);

    if (coordinates.length == 2) {
      try {
        console.log("запрос погоды");
        const data = await requestWeatherForCoord(coordinates);

        setResponseWeather(data);
        getForecast(data);
        getCity(city);
        setCoord([]);

        console.log("responseWeather: ", data);
      } catch (err) {
        console.error("ошибка запроса погоды: ", err);
        setHasError(true);
        setErrorName("Не удалось найти погоду в этом городе");
        return null;
      }
    } else if (coordinates.length != 2) {
      try {
        const data = await searchCoordinatesForCity(city);
        if (!data || data.length === 0) {
          setHasError(true);
          setErrorName("Город не найден");
          return;
        }

        if (data.length > 0) {
          const latLon = [data[0].lon, data[0].lat];

          console.log("coord: ", latLon);

          const weatherData = await requestWeatherForCoord(latLon);

          setResponseWeather(weatherData);
          getForecast(weatherData);
          getCity(city);
          setCoord([]);
          console.log("responseWeather: ", weatherData);
        } else {
          console.log("координаты не найдены");
          setErrorName(
            "Город не найден, попробуйте воспользоваться подсказками"
          );
          setHasError(true);
          setSuggestions([]);
        }
      } catch (err) {
        console.error("ошибка поиска города: ", err);
        setErrorName(
          "Не удалось найти город, попробуйте воспользоваться подсказками"
        );
        setHasError(true);
      }
    }
  }

  return (
    <section className={classes.search_and_sugg_section}>
      <div className={classes.search_block}>
        <Input
          query={query}
          onChange={handleChangeDedouns}
          hasError={hasError}
          ref={refSearch}
        ></Input>
        <Button
          value="Найти"
          onClick={() => onClickSearchButt(coord, query)}
        ></Button>
      </div>
      {hasError ? <p className={classes.errorMessage}>{errorName}</p> : null}

      <SuggestionsList
        ref={refSuggList}
        suggestions={suggestions}
        setQuery={setQuery}
        setCoord={setCoord}
        setSuggestions={setSuggestions}
        setActiveSuggestion={setActiveSuggestion}
        activeLi={activeSuggestion}
      />
    </section>
  );
}
