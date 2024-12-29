import { first151Pokemon, getFullPokedexNumber } from "../utils"
// Create side navigation that has all the pokemon listed, along with a search functionality to quickly find a specific pokemon.
export default function SideNav(props) {

    const { selectedPokemon, setSelectedPokemon } = props

    return (
        <nav>
            <div className={'header'}>
                <h1 className='text-gradient'>Pokédex</h1>
            </div>
            <input />
            {/* Cycle through the whole dictionary to find each pokemon and their corresponding 'identification number' within the pokedex.*/}
            {first151Pokemon.map((pokemon, pokemonIndex) => {
                return (
                    <button onClick={() => {
                        setSelectedPokemon(pokemonIndex)
                    }} key={pokemonIndex} className={'nav-card ' + (pokemonIndex === selectedPokemon ? ' nav-card-selected' : ' ')}>
                        <p>{getFullPokedexNumber(pokemonIndex)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}