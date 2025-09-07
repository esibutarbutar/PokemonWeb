import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function GatchaPage() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await axios.get('https://pokeapi.co/api/v2/location-area?limit=100');
      setLocations(res.data.results);
    };
    fetchLocations();
  }, []);

  const handleGatcha = async () => {
    if (!selectedLocation) return;
    console.log("📦 Selected Location:", selectedLocation);

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post('/api/gatcha', {
        locationUrl: selectedLocation,
      });
      setResult(res.data);
    } catch (err) {
      console.error('❌ Frontend Gatcha Error:', err.message);
      alert('Gatcha failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-2xl mx-auto">
      {/* Tombol Back */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Pokémon Gatcha</h1>
        <Link
          to="/"
          className="text-sm bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          ⬅ Back
        </Link>
      </div>

      {/* Select lokasi */}
      <select
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="w-full p-3 border border-blue-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select Location</option>
        {locations.map((loc) => (
          <option key={loc.name} value={loc.url}>
            {loc.name}
          </option>
        ))}
      </select>

      {/* Tombol Gatcha */}
      <button
        onClick={handleGatcha}
        className="w-full bg-blue-600 text-white py-3 rounded shadow hover:bg-blue-700 disabled:opacity-50"
        disabled={!selectedLocation || loading}
      >
        {loading ? 'Gatcha-ing...' : 'Gatcha!'}
      </button>

      {/* Hasil Gatcha */}
      {result && (
        <div className="mt-6 p-4 bg-white border border-blue-300 rounded text-center shadow-md">
          <h2 className="text-xl font-bold capitalize text-blue-700">{result.name}</h2>

          {result.sprite && (
            <img
              src={result.sprite}
              alt={result.name}
              className="mx-auto w-24 h-24 my-2"
            />
          )}

          <p className="text-gray-700">
            Gender: <span className="capitalize">{result.gender}</span>
          </p>
          <p className="text-gray-700">
            Time: <span className="capitalize">{result.period}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default GatchaPage;
