import classes from "./weatherCard.module.css";
import WeatherIcon from "./weatherIcon";
import { useState } from "react";

export default function WeatherCard({
  date,
  index,
  city,
  code,
  description,
  temp,
  feels,
  wind,
  humidity,
}) {
  const dataTime = date.slice(5, 16);
  const dataTimeFormatted = `${dataTime[3]}${dataTime[4]}-${dataTime[0]}${
    dataTime[1]
  } ${dataTime.slice(-5)}`;

  const feelsLike = feels.toFixed(0);
  const temperature = temp.toFixed(0);
  const descriptionToUpp =
    description.charAt(0).toUpperCase() + description.slice(1);
  const timeOfDay = whatTimeOfDay(dataTime);
  function getWIndDirection(wind) {
    wind = ((wind % 360) + 360) % 360;

    switch (true) {
      case wind >= 337.5 || wind < 22.5:
        return "В →";
      case wind >= 22.5 && wind < 67.5:
        return "СВ ↗";
      case wind >= 67.5 && wind < 112.5:
        return "С ↑";
      case wind >= 112.5 && wind < 157.5:
        return "СЗ ↖";
      case wind >= 157.5 && wind < 202.5:
        return "З ←";
      case wind >= 202.5 && wind < 247.5:
        return "ЮЗ ↙";
      case wind >= 247.5 && wind < 292.5:
        return "Ю ↓";
      case wind >= 292.5 && wind < 337.5:
        return "ЮВ ↘";
      default:
        return "?";
    }
  }

  function whatTimeOfDay(dataTime) {
    switch (dataTime.slice(-5, -3)) {
      case "00":
      case "03":
        return "morning";
      case "06":
      case "09":
        return "day";
      case "12":
      case "15":
        return "evening";
      case "18":
      case "21":
        return "night";
      default:
        return "day";
    }
  }
  function whichDayOfWeek(day) {
    const date = new Date(day); // формат 2025-11-19
    const weekdays = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];
    return weekdays[date.getDay()];
  }

  return (
    <>
      {dataTime.slice(-5, -3) == "00" || index === 0 ? (
        <h2 className={classes.headerOfDay}>
          {whichDayOfWeek(date.slice(0, 10))}
        </h2>
      ) : null}
      <section className={`${classes.card} ${classes[timeOfDay]}`}>
        <div className={classes.headerOfCard}>
          <h3>{dataTimeFormatted}</h3>{" "}
          <h3 className={classes.cityName}>{city}</h3>
        </div>
        <div className={classes.infoOfCard}>
          <div className={classes.blockWeather}>
            <WeatherIcon
              className={classes.icon}
              code={code}
              isDay={
                parseInt(date.slice(-5, -3), 10) >= 6 &&
                parseInt(date.slice(-5, -3), 10) < 21
                  ? 1
                  : 0
              }
            />
            {descriptionToUpp}
          </div>
          <div className={classes.temp}>{`${temperature}°`}</div>
          <div className={classes.detalesWeather}>
            <p className={classes.feelsLike}>
              Ощущается как:{" "}
              <span style={{ marginLeft: "5px" }}>{feelsLike}°</span>
            </p>
            <p>Скорость ветра: {wind[0].toFixed(0)}км/ч</p>
            <p>Направление: {getWIndDirection(wind[1])}</p>
            <p style={{ marginBottom: "0" }}>Влажность: {humidity}%</p>
          </div>
        </div>
      </section>
    </>
  );
}
