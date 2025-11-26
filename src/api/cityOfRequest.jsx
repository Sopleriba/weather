export default async function cityOfRequest(city) {
  try {
    return await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=89e57a1856bf2c6e661180d8eee2fe8e`
    );
  } catch (err) {
    console.log(err);
    return null;
  }
}
