import React, { useEffect, useState } from 'react';
import './pokemon.css';

const PokemonCard = () => {
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState("all");

    const API = "https://pokeapi.co/api/v2/pokemon?limit=311";

    const fetchPokemon = async () => {
        try {
            const response = await fetch(API);
            const data = await response.json();

            const pokemonData = data.results.map(async (currPokemon) => {
                const res = await fetch(currPokemon.url);
                const currPokemonData = await res.json();

                return currPokemonData;
            })

            const detailedResponseData = await Promise.all(pokemonData);

            if (detailedResponseData && detailedResponseData?.length) {
                setPokemon(detailedResponseData);
                setLoading(false);
            }

        } catch (error) {
            setError(true);
            setLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPokemon();
    }, [])

    // Handle Select Tag functionality
    const handleSelectChange = (e) => {
        e.preventDefault();
        setFilter(e.target.value);
    }

    // Search Functionality
    const searchData = (currPokemon) => {
        return (currPokemon?.name?.toLowerCase().includes(search?.toLocaleLowerCase()));
    }

    // Filter functionality
    const filterType = (currPokemon) => {
        if(filter === "all") return currPokemon;
        return currPokemon?.types?.[0]?.type?.name === filter;
    }

    const filterPokemon = pokemon?.filter((currPokemon) => {
        return searchData(currPokemon) && filterType(currPokemon);
    })


    return (
        <>
            {
                error
                    ? <h1>Error is occurred...</h1>
                    : loading
                        ? <h1>Loading...</h1>
                        : <section className='container'>
                            <header>
                                <h1 style={{ fontSize: "4.4rem" }}>Lets Catch Pokémon</h1>
                            </header>
                            <div className='pokemon-search'>
                                <input
                                    type="text"
                                    name='text'
                                    placeholder='search Pokemon'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <div className='filter-section'>
                                    <select
                                        className='select-section'
                                        value={filter}
                                        onChange={handleSelectChange}
                                    >
                                        <option value="all">All</option>
                                        <option value="grass">Grass</option>
                                        <option value="fire">Fire</option>
                                        <option value="electric">Electric</option>
                                        <option value="ghost">Ghost</option>
                                        <option value="normal">Normal</option>
                                        <option value="bug">Bug</option>
                                        <option value="water">Water</option>
                                        <option value="poison">Poison</option>
                                        <option value="fighting">Fighting</option>
                                        <option value="psychic">Psychic</option>
                                        <option value="dragon">Dragon</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </div>

                            </div>
                            <div className='card-section'>
                                <ul className="cards">
                                    {
                                        filterPokemon.map((currPokemon) => {
                                            return (
                                                <li key={currPokemon?.id} className='pokemon-card'>
                                                    <figure>
                                                        <img
                                                            src={currPokemon?.sprites?.other?.dream_world?.front_default}
                                                            alt={currPokemon?.name}
                                                            className='pokemon-image'
                                                        />
                                                    </figure>
                                                    <h1>{(currPokemon?.name).toUpperCase()}</h1>
                                                    <div className="pokemon-info pokemon-highlight">
                                                        <p>
                                                            {
                                                                currPokemon?.types?.map((currtype) => (currtype?.type?.name)).join(", ")
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="grid-three-cols">
                                                        <p className="pokemon-info">
                                                            <span>{currPokemon?.height}</span> <br /> Height
                                                        </p>
                                                        <p className="pokemon-info">
                                                            <span>{currPokemon?.weight}</span> <br /> Weight
                                                        </p>
                                                        <p className="pokemon-info">
                                                            <span>{currPokemon?.stats?.[5]?.base_stat}</span> <br /> speed
                                                        </p>
                                                    </div>
                                                    <div className='grid-three-cols'>
                                                        <p className="pokemon-info">
                                                            <span>{currPokemon?.base_experience}</span> <br /> Experience
                                                        </p>
                                                        <p className="pokemon-info">
                                                            <span>{currPokemon?.stats?.[1]?.base_stat}</span> <br /> Attack
                                                        </p>
                                                        <p className="pokemon-info">
                                                            <span>
                                                                {currPokemon?.abilities?.[0]?.ability?.name}
                                                            </span> <br /> Abilities
                                                        </p>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </section>
            }
        </>

    )
}

export default PokemonCard;