import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [abilityEffect, setAbilityEffect] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        setPokemon(res.data);
      } catch (err) {
        console.error('Failed to fetch Pokémon data:', err);
      }
    };
    fetchData();
  }, [name]);

  const fetchAbilityEffect = async (abilityName) => {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/ability/${abilityName}`);
      const effect = res.data.effect_entries.find((entry) => entry.language.name === 'en');
      setAbilityEffect({
        name: abilityName,
        effect: effect?.effect || 'No effect description found.',
      });
    } catch (err) {
      setAbilityEffect({
        name: abilityName,
        effect: 'Failed to load effect.',
      });
    }
  };

  if (!pokemon) return <p className="text-center mt-10 text-blue-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-10 max-w-4xl mx-auto">
      <Link to="/" className="text-blue-600 underline mb-4 inline-block">&larr; Back to Home</Link>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col items-center">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} className="w-32 h-32" />
          <h1 className="text-3xl font-bold text-blue-700 capitalize mt-4">{pokemon.name}</h1>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold text-blue-600 mb-2">Types</h2>
            <ul className="list-disc list-inside text-gray-700">
              {pokemon.types.map((t) => (
                <li key={t.type.name} className="capitalize">{t.type.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-blue-600 mb-2">Forms</h2>
            <ul className="list-disc list-inside text-gray-700">
              {pokemon.forms.map((f) => (
                <li key={f.name} className="capitalize">{f.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-blue-600 mb-2">Abilities</h2>
            <ul className="list-disc list-inside text-gray-700">
              {pokemon.abilities.map((a) => (
                <li key={a.ability.name}>
                  <button
                    className="capitalize text-blue-500 hover:underline"
                    onClick={() => fetchAbilityEffect(a.ability.name)}
                  >
                    {a.ability.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-blue-600 mb-2">Stats</h2>
            <ul className="list-disc list-inside text-gray-700">
              {pokemon.stats.map((s) => (
                <li key={s.stat.name} className="capitalize">
                  {s.stat.name}: {s.base_stat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {abilityEffect && (
          <div className="mt-8 p-4 bg-blue-100 border border-blue-300 rounded shadow">
            <h3 className="text-lg font-bold text-blue-700 capitalize mb-2">
              Ability: {abilityEffect.name}
            </h3>
            <p className="text-sm text-gray-800">{abilityEffect.effect}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PokemonDetail;
