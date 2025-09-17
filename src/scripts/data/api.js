import CONFIG from "../config";

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/`,
};

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
  return await fetchResponse.json();
}
