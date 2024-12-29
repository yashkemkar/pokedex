import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import TypeCard from "./TypeCard"
import Modal from "./Modal"

// Need the information to display on the screen once our application is fully loaded.

export default function PokeCard(props) {
    const { selectedPokemon } = props
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false) // Need a loading state so we don't send thousands of requests to fetch data
    const [skill, setSkill] = useState(null) //empty state for now
    const [loadingSkill, setLoadingSkill] = useState(false)
    const { name, height, abilities, stats, types, moves, sprites } = data || {} // the or condition just stipulates if data type is null, destructure out of empty object.

    // Need to get a filtered list of images for normal sprites, no other types of images.
    const imgList = Object.keys(sprites || {}).filter(val => {
        if (!sprites[val]) { return false }
        if (['versions', 'other'].includes(val)) { return false }
        return true
    })

    // Some strings are returning uncapitalised, so created this function to fix that.
    function capFirstLetter (str) {
        const newStr = str.charAt(0).toUpperCase() + str.slice(1)
        return newStr
    }

    async function fetchMoveData(move, moveUrl) {
        // guard clauses to prevent fetch request breaking (spam clicking, no data in cache, no url)
        if (loadingSkill || !localStorage || !moveUrl) { return }

        // check cache for moves object
        let c = {}
        if (localStorage.getItem('pokemon-moves')) {
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        // check if move is in moves object (cache)
        if (move in c) {
            setSkill(c[move])
            console.log('Found move in Cache')
            return
        }

        // if not, then attempt to fetch data from API
        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('Fetched move from API', moveData)
            const description = moveData?.flavor_text_entries.filter(
                val => {
                    return val.version_group.name = 'firered-leafgreen'
                })[0]?.flavor_text
            const skillData = {
                name: move,
                description
            }
            setSkill(skillData) // Update skill state to be the move retrieved - this will automatically open the modal as both conditions are met.

            c[move] = skillData // Save the skill in cache
            localStorage.setItem('pokemon-moves', JSON.stringify(c)) // convert from object back to JSON.
        } catch (err) {
            console.log(err.message)
        } finally {
            setLoadingSkill(false)
        }
    }

    // Whenever the selected pokemon changes, execute the function (get request) using useEffect.
    useEffect(() => {
        // 1. if loading or if localStorage database doesn't exist, exit logic. This is a guard clause to prevent spam
        if (loading || !localStorage) { return }
        // 2. check if the selected pokemon information is available in the cache
        // 2a. define the cache (as an object because pokemon api data type is object.)
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        } // localStorage is in JSON, so have to parse it into an object

        // 2b. check if the selected pokemon is in the cache, otherwise fetch from the api
        if (selectedPokemon in cache) {
            setData(cache[selectedPokemon])
            return
        }

        // 3. I passed all the cache stuff to no avail and now need to fetch the data from the api

        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix // dynamic url for fetch api
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
                console.log('Fetched data')
                // save new pokemon information to cache so I can pull from cache next time I run it
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokemon', JSON.stringify(cache)) // data is an object, so have to stringify it to save into JSON localStorage
            } catch (err) {
                console.log(err.message)
                return
            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()

    }, [selectedPokemon])

    // Just making sure that it doesn't render out any undefined values because there's no pokemon information.
    if (loading || !data) {
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }

    return (
        <div className='poke-card'>
            {/* Incorporating Modal for displaying the description of the skills/moves that are shown in the buttons */}
            {skill && (<Modal handleCloseModal={() => { setSkill(null) }}> {/*require data to render modal.*/}
                <div>
                    <h6>Name</h6>
                    <h2>{capFirstLetter(skill.name.replaceAll('-',' '))}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{capFirstLetter(skill.description)}</p>
                </div>
            </Modal>
            )}
            {/*Name section*/}
            <div>
                <h4> #{getFullPokedexNumber(selectedPokemon)} </h4>
                <h2>{capFirstLetter(name)}</h2>
            </div>

            {/*Type section*/}
            <div className='type-container'>
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    )
                })}
            </div>

            {/*Main image section*/}
            <img className='default-img' src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`$name}-large-img`} />

            {/*Small sprite images section*/}
            <div className='img-container'>
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
            </div>

            {/*Stats section*/}
            <h3>Stats</h3>
            <div className='stats-card'>
                {stats.map((statObj, statIndex) => {
                    const { stat, base_stat } = statObj
                    return (
                        <div key={statIndex} className='stat-item'>
                            <p>{stat?.name.replaceAll('-', ' ')}</p> {/* stat name*/}
                            <h4>{base_stat}</h4> {/*stat value*/}
                        </div>
                    )
                })}
            </div>

            {/*Moves section*/}
            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {moves.map((moveObj, moveIndex) => {
                    return (
                        <button className='button-card pomeon-move' key={moveIndex} onClick={() => {
                            fetchMoveData(moveObj?.move?.name, moveObj?.move?.url)
                         }}>
                            <p>{capFirstLetter(moveObj?.move?.name.replaceAll('-', ' '))}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}