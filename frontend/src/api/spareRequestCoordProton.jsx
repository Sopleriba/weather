import abortController from "./abortController";

export default async function spareRequestCoordProton(city) {
  try {
    console.log("запрос координат города");

    const response = await abortController(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(city)}&limit=1`,
      5000
    );
    if (!response.ok) return null;

    return await response.json();
  } catch (err) {
    return null;
  }
}
