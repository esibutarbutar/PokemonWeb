import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function SearchPage() {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50');
      const results = res.data.results;

      const details = await Promise.all(
        results.map((p) => axios.get(p.url).then((r) => r.data))
      );
      setPokemons(details);
      setFilteredPokemons(details);
    };

    fetchPokemons();
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);

    const filtered = pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(keyword)
    );
    setFilteredPokemons(filtered);
  };

  return (
    <div className="min-h-screen p-6 w-full max-w-7xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 drop-shadow">Pokémon</h1>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search your favorite Pokémon..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full max-w-md p-3 border-2 border-blue-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center placeholder:text-gray-400 bg-white"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 justify-items-center">
        {filteredPokemons.map((pokemon) => (
          <Link to={`/pokemon/${pokemon.name}`} className="w-full max-w-[180px]">
            <div
              key={pokemon.id}
              className="bg-blue-50 border border-blue-300 p-4 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 flex flex-col items-center"
            >

              <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-20 h-20" />
              <h2 className="text-blue-700 font-semibold mt-2 capitalize text-lg">{pokemon.name}</h2>
              <div className="flex flex-wrap justify-center mt-2 gap-1">
                {pokemon.types.map((t) => (
                  <span key={t.type.name} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>

        ))}
      </div>

      {filteredPokemons.length === 0 && (
        <p className="text-center mt-12 text-blue-500 font-medium">No Pokémon found.</p>
      )}
    </div>
  );
}

export default SearchPage;
