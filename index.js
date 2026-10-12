// require is to import functions/values from a different file
// when the require does not begin with a ./, it defaults
// to the node_modules folder
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');
// create the client for the Gemini which allows to use the models later on
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const app = express();

app.use(express.json());
app.use(cors()); // enable cross origin resources sharing

app.post('/api/gemini/chat', async function (req, res) {
    // we expect the request's body to have a key named `userMessage`
    const userMessage = req.body.userMessage;

    const prompt = "You are a helpful assistant which answers the user's question. Question: " + userMessage;

    const aiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    console.log(aiResponse.candidates[0].content);

    // candidates - the array of possible responses
    // parts - gemini will return multi-parts response
    const reply = aiResponse.candidates[0].content.parts[0].text;
    res.json({
        reply: reply
    })
})

app.post('/api/gemini/trip-advisor', async function (req, res) {
    const userMessage = req.body.userMessage;
    const lat = req.body.lat;
    const lng = req.body.lng;

    const prompt = `You are a professional travel advisor. The user is at latitude: ${lat} and longitude: ${lng}
        The user asks: ${userMessage}
        
        1. You must ue the Google Map tools to  search for addresses and description ONLY of real operating places. Only keep location results. Do not include reviews
        2. You must include every place returned by the Google Map search. Do not invent new places and do not skip any.
        3. For each place, copy its exact name, address, latitude, longitude from the Google Map results. Do not paraphrase
           the name or guess the latitude or longitude
        4. List the places in the "locations" array in the same order as the Goolge Map grounding results,
        so each location[i] matches groundingChunks[i]
        
        Respond ONLY with a raw JSON object (no markdown, no code fences) of the form:
        {
          "locations": [
             {
                "name":"Exact place name from Google Maps",
                 "lat":1.234,
                 "lng":103.456,
                 "description":"Short description from the Map results",
                 "address":"Full address from Google Maps"
             }
          ]
        }
        `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
            tools: [
                { googleMaps: {} }
            ],
            toolConfig: {
                retrievalConfig: {
                    latLng: {
                        latitude: Number(lat),
                        longitude: Number(lng)
                    }
                }
            }
        }
    })
    // ?. is null coalesce operator
    // a?.b = if a is undefined, the whole result will be null
    const groundingSupports = response.candidates[0]?.groundingMetadata?.groundingChunks;

    const cleanedGroundingSupports = [];
    for (let g of Array.from(groundingSupports)) {
        if (g.maps.uri.includes('cid')) {
            cleanedGroundingSupports.push(g);
        }
    }

    // const cleanedGroundingSupports = Array.from(groundingSupports).filter(g => g.maps.uri.includes('cid'))


    const text = response.candidates[0].content.parts[0].text;
    // uses regular expression - which are patterns in strings - to find ```json and replaces them with empty string
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // text itself stores a JSON string, so we need to convert it to a JSON object using JSON.parse
    const jsonResponse = JSON.parse(cleanedText);
    res.json({
        locations: jsonResponse,
        groundingSupport: cleanedGroundingSupports
    })
})

app.get('/health', function (req, res) {
    res.send("Working");
})

// the first parameter of app.listen is the port number
// that the server is running on
// for testing and development, usually we use port numbers above 3000
// typical for deveoplment is 3000, or 8000 etc. etc.
app.listen(3000, function (req, res) {
    console.log("Server has started")
})