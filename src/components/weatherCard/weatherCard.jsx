import classes from "./weatherCard.module.css";
import WeatherIcon from "./weatherIcon";
import { useState } from "react";

export default function WeatherCard({
  time,
  city,
  code,
  description,
  temp,
  feels,
  wind,
  humidity,
}) {
  function WhatTimeOfDay(dataTime) {
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
  const dataTime = time.slice(5, 16);
  const dataTimeFormatted = `${dataTime[3]}${dataTime[4]}-${dataTime[0]}${
    dataTime[1]
  } ${dataTime.slice(-5)}`;

  const feelsLike = feels.toFixed(0);
  const temperature = temp.toFixed(0);
  const descriptionToUpp =
    description.charAt(0).toUpperCase() + description.slice(1);
  const timeOfDay = WhatTimeOfDay(dataTime);
  return (
    <section className={`${classes.card} ${classes[timeOfDay]}`}>
      <div className={classes.headerOfCard}>
        <h3>{dataTimeFormatted}</h3>{" "}
        <h3 className={classes.cityName}>{city}</h3>
      </div>
      <div className={classes.infoOfCard}>
        <div className={classes.blockWeather}>
          <WeatherIcon className={classes.icon} code={code} />
          {descriptionToUpp}
        </div>
        <div className={classes.temp}>{`${temperature}°`}</div>
        <div className={classes.detalesWeather}>
          <p className={classes.feelsLike}>
            Ощущается как:{" "}
            <span style={{ marginLeft: "5px" }}>{feelsLike}</span>
          </p>
          <p></p>
          <p></p>
        </div>
      </div>
    </section>
  );
}
