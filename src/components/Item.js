import { useEffect, useState } from "react"
import { fetchPokemonDetails } from "../services/pokemonService"
import './Item.scss'

export default function Item({name}){

    const [pokemonData, setPokemonData] = useState({name:"",image:""})

    useEffect(()=>{
        const fetchDetails = async function(){
            try{
                const data = await fetchPokemonDetails(name)
                setPokemonData(previousState =>({...previousState, 
                                   name:data.forms[0].name, 
                                   image:data.sprites["front_default"]
                                }))
            } catch(error) {
                console.error("Error fetching Pokemon data: ", error)
            }
        }

        fetchDetails()
    },[name])


    return (
        <div className="card overviewItem">
            {pokemonData.image && <img className="card-image-top" src={pokemonData.image} alt="..." />}
            <div className="card-body">
                <h5 className="card-title">{pokemonData.name || "Loading..." }</h5>
            </div>
        </div>
        
    )


}