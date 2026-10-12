

const API_BASE_URL = "https://urban-giggle-97w6rv7qj45g2pwjq-3000.app.github.dev";

async function recommend(lat, lng, query) {
    const response = await axios.post(`${API_BASE_URL}/api/gemini/trip-advisor`, {
        userMessage: query,
        lat: lat,
        lng: lng
    });
    return {
        locations: response.data.locations,
        groundingSupports: response.data.groundingSupport
    }
}