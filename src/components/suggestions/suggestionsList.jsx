import classes from "./suggestionsList.module.css";
import { useState } from "react";
import { useEffect } from "react";

export default function SuggestionsList({
  suggestions,
  setQuery,
  setCoord,
  setSuggestions,
  setActiveSuggestion,
  ref,
  activeLi,
  onSelectSuggestion,
}) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <ul
      className={`${classes.ulSearch} ${classes.suggestions} ${
        suggestions.length > 0 ? classes.visible : ""
      }`}
      ref={ref}
    >
      {suggestions.map((city, index) => (
        <li
          className={`${classes.search_li} ${
            activeLi === index ? classes.active : ""
          }`}
          key={index}
          onClick={() => {
            setActiveSuggestion(null);
            () => onSelectSuggestion(city);
            setQuery(city.properties.name);
            setSuggestions([]);
            setCoord(city.geometry.coordinates);
          }}
        >
          {city.properties.name}, {city.properties.country}
        </li>
      ))}
    </ul>
  );
}
