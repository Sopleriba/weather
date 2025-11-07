import classes from "./suggestionsList.module.css";

export default function SuggestionsList({
  suggestions,
  setQuery,
  setCoord,
  setSuggestions,
  setCheck_input,
}) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <ul
      className={`${classes.ulSearch} ${classes.suggestions} ${
        suggestions.length > 0 ? classes.visible : ""
      }`}
    >
      {suggestions.map((city, index) => (
        <li
          className={classes.search_li}
          key={index}
          onClick={() => {
            setCheck_input(1);

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
