import { capitalizeFirstLetter } from "../services/commonServices";
export default function Details( { pokemonDetails, onCloseClick } ){

    return (
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
                <button type="button" className="btn btn-primary" onClick={onCloseClick}>Close</button>
            </div>
        </div>
    )
}