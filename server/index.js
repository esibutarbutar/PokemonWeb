const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Gatcha Endpoint
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

app.post('/api/gatcha', async (req, res) => {
  const { locationUrl } = req.body;
  const hour = new Date().getHours();
  const period = hour >= 6 && hour < 18 ? 'day' : 'night';
  const gender = Math.random() < 0.75 ? 'female' : 'male';

  try {
    const { data } = await axios.get(locationUrl, { httpsAgent: agent });
    const list = data.pokemon_encounters;

    if (!list || list.length === 0) {
      return res.status(404).json({ message: "No Pokémon found" });
    }

    const chosen = list[Math.floor(Math.random() * list.length)].pokemon;
    const pokeDetail = await axios.get(chosen.url, { httpsAgent: agent });
    const sprite = pokeDetail.data.sprites.front_default;

    return res.json({ name: chosen.name, gender, period, sprite });
  } catch (e) {
    console.error("❌ Server Error:", e.message);
    return res.status(500).json({ message: "Failed to fetch Pokémon", error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
