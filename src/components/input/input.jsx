import classes from "../search/search.module.css";

export default function Input({ query, onChange, hasError }) {
  return (
    <input
      className={`${classes.input} ${hasError ? classes.inputError : ""}`}
      type="text"
      value={query}
      placeholder="Введи город"
      onChange={onChange}
    />
  );
}
