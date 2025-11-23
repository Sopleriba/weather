import classes from "../search/search.module.css";

export default function Input({ query, onChange, hasError, ref }) {
  return (
    <input
      className={`${classes.input} ${hasError ? classes.inputError : ""}`}
      type="text"
      value={query}
      placeholder="Введи город"
      onChange={onChange}
      onClick={onChange}
      ref={ref}
    />
  );
}
