import Button from "../button/button";
import classes from "./TabsSection.module.css";
import { useState } from "react";

export default function TabsSection({ onSelectButton }) {
  const [activeType, setActiveType] = useState(1);

  function handleClick(type) {
    setActiveType(type);
  }

  return (
    <section className={classes.contSelectBtns}>
      <Button
        isActive={activeType == 1}
        onClick={() => (onSelectButton(1), handleClick(1))}
        value="1 день"
      ></Button>
      <Button
        isActive={activeType == 3}
        onClick={() => (onSelectButton(3), handleClick(3))}
        value="3 дня"
      ></Button>
      <Button
        isActive={activeType == 5}
        onClick={() => (onSelectButton(5), handleClick(5))}
        value="5 дней"
      ></Button>
    </section>
  );
}
