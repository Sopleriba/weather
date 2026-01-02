export default async function abortController(url, timeout) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    return response;
  } catch (err) {
    
    clearTimeout(timer);
    throw err;
  }
}
