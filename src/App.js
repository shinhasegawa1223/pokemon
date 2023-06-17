import { useEffect, useState } from "react";
import "./App.css";
import { getAllpokemon, getPokemon } from "./utils/pokemon";
import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  const [loading, setLoading] = useState(true);

  const [pokemonData, setPokemonData] = useState([]);

  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");
  useEffect(() => {
    // get all pokemon data
    const fetchPokemonData = async () => {
      let res = await getAllpokemon(initialURL);
      // geta pokemon detail
      loadPokemon(res.results);
      // console.log(res.results);
      setNextURL(res.next);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    //Promise.all loadPokemmonを全て行なっている　配列
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        // console.log(pokemon);
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  // console.log(pokemonData);
  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllpokemon(nextURL);
    console.log(data);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  const handlePrevPage = async () => {
    if (!prevURL) return;
    setLoading(true);
    let data = await getAllpokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };
  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>loading now</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>prev</button>
              <button onClick={handleNextPage}>next</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
