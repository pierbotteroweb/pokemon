import { useEffect, useMemo, useRef, useState } from "react";

//SERVICES
import { fetchPokemonList, fetchPokemonDetails, fetchAllPokemonList } from "../services/pokemonService";
//COMPONENTS
import Item from "../components/Item";

//STYLING
import "./Main.scss"
import { useQuery } from "@tanstack/react-query";
import Details from "../components/Details";

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

    const handleCloseModalButton = function(){
        setShowDetails(false);

    }

    const displayedPokemons = debouncedSearch ? filteredPokemons : pokemonList;

    return (
        <div>
            {showDetails && pokemonDetails.sprites && (
                <Details pokemonDetails={pokemonDetails} onCloseClick={handleCloseModalButton} />
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

            <div className="mainListContainer">

                <ul className="mainList">
                    {displayedPokemons.length > 0 ? (
                        displayedPokemons.map((pokemon,index) => (
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
                {(isLoading && !debouncedSearch) && <p>Loading more Pokémon...</p>}

                {!debouncedSearch && <div ref={lastElementRef} style={{ height: "20px" }}></div>}

            </div>
            
        </div>
    );
}
