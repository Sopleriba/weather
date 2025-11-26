export default async function requestWeatherForCoord(coordinates) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates[1]}&lon=${coordinates[0]}&appid=89e57a1856bf2c6e661180d8eee2fe8e&units=metric&lang=ru`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
