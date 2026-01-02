import abortController from "./abortController.jsx";

export default async function requestWeatherForCoord(coordinates) {
  try {
    console.log("запрос погоды по координатам");

    const response = await abortController(
      `https://api.open-meteo.com/v1/forecast?latitude=44.9521459&longitude=34.1024858&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto`,
      10000
    );
    //https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[1]}&lon=${coordinates[0]}&appid=89e57a1856bf2c6e661180d8eee2fe8e&units=metric&lang=ru
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    if (err.name === "AbortError") {
      return err;
    }
    console.error(err);
    return null;
  }
}
