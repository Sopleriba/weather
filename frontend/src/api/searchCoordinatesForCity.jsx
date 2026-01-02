import abortController from "./abortController.jsx";
import spareRequestCoordNominatium from "./spareRequestCoordProton.jsx";

export default async function searchCoordinatesForCity(city) {
  try {
    console.log("запрос координат города");

    const response = await abortController(
      `https://nominatim.openstreetmap.org/search?format=json&q=${city}&limit=1`,
      5000
    );
    if (!response.ok) {
      return spareRequestCoordNominatium(city);
    }
    const data = await response.json();

    return data;
  } catch (err) {
    return null;
  }
}
