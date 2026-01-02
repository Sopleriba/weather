import classes from "./button.module.css";

export default function Button({ onClick, isActive, value }) {
  return (
    <button
      className={`${classes.button} ${isActive ? classes.active : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
