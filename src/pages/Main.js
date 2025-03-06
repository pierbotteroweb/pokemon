import { useEffect, useMemo, useRef, useState } from "react";

//SERVICES
import { fetchPokemonList, fetchPokemonDetails, fetchAllPokemonList } from "../services/pokemonService";
import { capitalizeFirstLetter } from "../services/commonServices";

//COMPONENTS
import Item from "../components/Item";

//STYLING
import "./Main.scss"
import { useQuery } from "@tanstack/react-query";

export default function Main() {
    
    // LIST OF POKEMONS
    const [pokemonList, setPokemonList] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    
    // DETAILS OF SELECTED POKEMON
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [pokemonDetails, setPokemonDetails] = useState({});
    
    // PAGINATION STATES
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    // SEARCH
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => { // TO GET LITS OF POKEMONS
        const fetchList = async () => {
            if (isLoading || !hasMore) return;
            setIsLoading(true);
            try {
                const list = await fetchPokemonList(page);
                
                if (!list || !list.results) {
                    console.error("Invalid API response", list);
                    setHasMore(false);
                    return;
                }
                setPokemonList((prev) => {
                    const newPokemons = list.results.filter(pokemon => 
                        !prev.some(existing => existing.name === pokemon.name)
                    );
                    return [...prev, ...newPokemons];
                });

                setHasMore(!!list.next);
            } catch (error) {
                console.error("Error fetching Pokemon list:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchList();
    }, [page, isLoading, hasMore]);

    useEffect(() => { // TO GET DETAILED INFO ABOUT THE SELECTED POKEMON BEING DISPLAYED ON THE MODAL
        if (showDetails && selectedPokemon) {
            const fetchDetails = async () => {
                try {
                    const details = await fetchPokemonDetails(selectedPokemon.name);
                    setPokemonDetails(details);
                } catch (err) {
                    console.error("Error fetching Pokemon details:", err);
                }
            };
            fetchDetails();
        } else {
            setPokemonDetails({});
        }
    }, [showDetails, selectedPokemon]);

    const lastElementRef = useRef(null);

    useEffect(() => { // TO CONTROL SCROLLABLE PAGINATION
        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 20);
                }
            },
            { threshold: 1 }
        );

        if (lastElementRef.current) observer.current.observe(lastElementRef.current);

        return () => {
            if (lastElementRef.current) observer.current.unobserve(lastElementRef.current);
        };
    }, [pokemonList]);
    
    useEffect(() => { // TO HANDLE FILTER LIST INPUT
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data: allPokemonData, isLoading: isSearching } = useQuery({
        queryKey: ["allPokemons"],
        queryFn: async () => {
            const response = await fetchAllPokemonList();
            const data = await response.json();
            return data.results || [];
        },
        staleTime: Infinity,
    });

    const filteredPokemons = useMemo(() => {
        if (debouncedSearch.length < 3) return [];
        return allPokemonData?.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [debouncedSearch, allPokemonData]);

    return (
        <div>
            {showDetails && pokemonDetails.sprites && (
                <div className="modalContainer">
                    <div className="modalDetails">
                        <h1>{capitalizeFirstLetter(pokemonDetails.name)}</h1>
                        <img src={pokemonDetails.sprites.other['official-artwork'].front_default} width="200" alt={pokemonDetails.name} />
                        <div className="details">
                            <div>
                                <h2>Moves</h2>
                                <ul style={{listStyleType: "none", padding:0}} >
                                    {pokemonDetails.moves.slice(0, 5).map((move, index) => (
                                        <li key={index}>{move.move.name}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h2>Abilities</h2>
                                <ul style={{listStyleType: "none", padding:0}} >
                                    {pokemonDetails.abilities.map((ability, index) => (
                                        <li key={index}>{ability.ability.name}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h2>Forms</h2>
                                <ul style={{listStyleType: "none", padding:0}} >
                                    {pokemonDetails.forms.map((form, index) => (
                                        <li key={index}>{form.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => setShowDetails(false)}>Close</button>
                    </div>
                </div>
            )}

            <div className="card, filterInput">
                 <div className="card-header">
                     Find Your Pokemon
                 </div>
                 <div className="card-body">

                    <input
                        type="text"
                        placeholder="Search Pokémon..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="searchInput , form-control"
                    />

                 </div>

            </div>

            { !debouncedSearch ? (

                <div className="mainListContainer">

                    <ul className="mainList">
                        {pokemonList.length > 0 ? (
                            pokemonList.map((pokemon,index) => (
                                <li key={pokemon.name+index}
                                    className="listDetail" 
                                    onClick={() => {
                                    setSelectedPokemon(pokemon);
                                    setShowDetails(true);
                                }}>
                                    <Item name={pokemon.name} />
                                </li>
                            ))
                        ) : (
                            <p>Loading...</p>
                        )}
                    </ul>
                    {isLoading && <p>Loading more Pokémon...</p>}

                    <div ref={lastElementRef} style={{ height: "20px" }}></div>
                </div>

                ) : (

                    <div className="mainListContainer">

                        <ul className="mainList">
                            {filteredPokemons && filteredPokemons.length > 0 ? (
                                filteredPokemons.map((pokemon,index) => (
                                    <li key={pokemon.name+index}
                                        className="listDetail" 
                                        onClick={() => {
                                        setSelectedPokemon(pokemon);
                                        setShowDetails(true);
                                    }}>
                                        <Item name={pokemon.name} />
                                    </li>
                                ))
                            ) : (
                                <p>Loading...</p>
                            )}
                        </ul>
                    </div>

                ) }
        </div>
    );
}
