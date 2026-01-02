import { useRef, useState } from "react";
import Button from "../button/button.jsx";
import classes from "./search.module.css";
import { useEffect } from "react";
import SuggestionsList from "../suggestions/suggestionsList.jsx";
import Input from "../input/input.jsx";
import requestWeatherForCoord from "../../api/requestWeatherForCoord.jsx";
import searchCoordinatesForCity from "../../api/searchCoordinatesForCity.jsx";

export default function Search({ getForecast, getCity }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [coord, setCoord] = useState([]);
  // const [check_input, setCheck_input] = useState(0); //проверка, воспользовался ли ползователь подсказкой (1) или ввел запрос вручную (0)
  const [hasError, setHasError] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [responseWeather, setResponseWeather] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  const [firstSugg, setFirstSugg] = useState(null);

  const refSearch = useRef(null);
  const refSuggList = useRef(null);
  const timer = useRef();

  //проблема 1: нужно поменять апи, тк долгие запросы
  //дописать погоду в карточках
  //сделать красивее подсказки
  //сделать фильтр подсказок, поменять апи погоды, data[0].geometry is undefined при вводе горпода вручную
  //сделать загрузку визуально, и оповещать пользователя что нет ответа
  //доделать иконки и запрос погоды
  useEffect(() => {
    function suggNavigation(event) {
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          if (activeSuggestion === null && query.length >= 3) {
            console.log("вызов функции onClickSearchButt", coord, query);

            onClickSearchButt(coord, query);
          } else if (activeSuggestion !== null && suggestions.length > 0) {
            const selected = suggestions[activeSuggestion];
            setQuery(selected.properties.city);
            setCoord(selected.geometry.coordinates);
            console.log(
              "вызов функции onClickSearchButt",
              selected.geometry.coordinates,
              selected.properties.city
            );

            onClickSearchButt(
              selected.geometry.coordinates,
              selected.properties.city
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
    // setCheck_input(0);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      handleChange(value);
    }, 400);
  }

  const handleChange = async (value) => {
    // const input = document.querySelector(`.${classes.input}`);
    //1fb2727bbe5541fd88190ad54394b76e
    //
    if (value.length > 2) {
      try {
        // const response = await fetch(
        //   `https://photon.komoot.io/api/?q=${encodeURIComponent(
        //     value
        //   )}&lang=default&limit=10&osm_tag=place:city`
        // );
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            value
          )}&type=city&limit=10&lang=ru&apiKey=1fb2727bbe5541fd88190ad54394b76e`
        );

        const responseCoordinates = await response.json();

        const data = [];
        const check = new Set();

        for (const feature of responseCoordinates.features) {
          const city = feature.properties.city;

          const country = feature.properties.country;
          const key = `${city}-${country}`;

          if (!check.has(key)) {
            check.add(key);
            data.push(feature);
          }
        }
        if (data.length > 0) {
          console.log("data: ", data);

          setSuggestions(data);

          console.log("первая посказка:", data[0].properties.city);
          setFirstSugg(data[0].properties.city);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Ошибка при выполнии запроса подсказок:", err);
        return null;
      }
    } else {
      setSuggestions([]);
    }
  };

  async function onClickSearchButt(coordinates, city) {
    setErrorName("");
    setHasError(false);
    setSuggestions([]);

    // console.log("check_input: ", check_input);
    console.log("coord: ", coordinates);

    if (coordinates.length == 2) {
      try {
        console.log("запрос погоды");
        const data = await requestWeatherForCoord(coordinates);
        if (data) {
          // const filteredWeather = data.map(() => {

          // })

          setResponseWeather(data);
          getForecast(data);

          getCity(city);
          setCoord([]);

          console.log("responseWeather: ", data);
        } else {
          console.error("ошибка запроса погоды");
          setErrorName("Не удалось найти погоду в этом городе");
          setHasError(true);
          return null;
        }
      } catch (err) {
        console.error("ошибка запроса погоды: ", err);
        setHasError(true);
        setErrorName("Не удалось найти погоду в этом городе");
        return null;
      }
    } else if (coordinates.length != 2) {
      try {
        const data = await searchCoordinatesForCity(city);
        console.log("data: ", data);

        if (!data || data.length === 0) {
          setHasError(true);
          setErrorName(
            "Город не найден, попробуйте воспрользоваться подсказками"
          );
          return;
        }

        if (data) {
          // const responseCityOfRequest = await cityOfRequest(city);

          // if (!responseCityOfRequest) {
          //   setErrorName("ошибка при запросе города");
          //   setHasError(true);
          //   return;
          // }
          // console.log("123", responseCityOfRequest[0].local_names.ru);

          getCity(data[0].name);

          console.log("координаты ", data);
          console.log("координаты lon ", data[0].lon);

          const lonLat = [data[0].lon, data[0].lat]; //первое lon, второе lat
          console.log("coord: ", lonLat);
          const weatherData = await requestWeatherForCoord(lonLat);
          console.log("responseWeather: ", weatherData);

          if (weatherData) {
            console.log("погода получена");

            // setResponseWeather(weatherData);
            getForecast(weatherData);
            setCoord([]);
          } else {
            setErrorName("Не удалось найти погоду в этом городе");
            setHasError(true);
            return null;
          }
        } else {
          console.log("координаты не найдены");
          setErrorName(
            `Не удалось найти город, возможно вы имели ввиду ${firstSugg}`
          );
          setHasError(true);
          setSuggestions([]);
        }
      } catch (err) {
        console.error("ошибка поиска города: ", err);
        setErrorName(
          `Не удалось найти город, возможно вы имели ввиду ${firstSugg}`
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
          onClick={() => {
            onClickSearchButt(coord, query),
              console.log(
                "вызов onclicksearchbutton coord: query: ",
                coord,
                query
              );
          }}
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
