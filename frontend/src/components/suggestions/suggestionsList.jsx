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
  const filteredSuggestions = suggestions.filter(
    (city) => city.properties.city
  );

  if (!filteredSuggestions || filteredSuggestions.length === 0) return null;

  return (
    <ul
      className={`${classes.ulSearch} ${classes.suggestions} ${
        filteredSuggestions.length > 0 ? classes.visible : ""
      }`}
      ref={ref}
    >
      {filteredSuggestions.map((city, index) => (
        <li
          className={`${classes.search_li} ${
            activeLi === index ? classes.active : ""
          }`}
          key={index}
          onClick={() => {
            setActiveSuggestion(null);
            () => onSelectSuggestion(city);
            setQuery(city.properties.city);
            setSuggestions([]);
            setCoord(city.geometry.coordinates);
          }}
        >
          {city.properties.city}, {city.properties.country}
        </li>
      ))}
    </ul>
  );
}
