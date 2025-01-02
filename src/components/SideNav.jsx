import { first151Pokemon, getFullPokedexNumber } from "../utils"
import { useState} from "react"
// Create side navigation that has all the pokemon listed, along with a search functionality to quickly find a specific pokemon.
export default function SideNav(props) {

    const { selectedPokemon, setSelectedPokemon, showSideMenu,  handleCloseMenu } = props

    const [searchValue, setSearchValue] = useState('')
    
    const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
        // if full pokedex number includes the current search value, return true
        if (getFullPokedexNumber(eleIndex).includes(searchValue)) {
            return true
        }
        // if pokemon name includes the current search value, return true
        if (ele.toLowerCase().includes(searchValue.toLowerCase())) { return true }
        // otherwise, exclude value from the array
        return false
    })

    return (
        <nav className={' '+(showSideMenu ? ' open' : '')}>
            <div className={'header '+ (showSideMenu ? ' open' : '')}>
                <button onClick={handleCloseMenu} className='open-nav-button'>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className='text-gradient'>Pokédex</h1>
            </div>
            <input autoFocus placeholder='E.g. 001 or Bulba...' value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }} />
            {/* Cycle through the whole dictionary to find each pokemon and their corresponding 'identification number' within the pokedex.*/}
            {filteredPokemon.map((pokemon, pokemonIndex) => {
                const truePokedexNumber = first151Pokemon.indexOf(pokemon)

                return (
                    <button onClick={() => {
                        setSelectedPokemon(truePokedexNumber)
                        handleCloseMenu()
                    }} key={pokemonIndex} className={'nav-card ' + (pokemonIndex === selectedPokemon ? ' nav-card-selected' : ' ')}>
                        <p>{getFullPokedexNumber(truePokedexNumber)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}