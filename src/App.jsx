import Header from "./components/Header"
import PokeCard from "./components/PokeCard"
import SideNav from "./components/SideNav"
import { useState } from "react"

function App() {

  const [selectedPokemon, setSelectedPokemon] = useState(0)
  const [showSideMenu, setShowSideMenu] = useState(false)
 

    // To provide side nav functionality in mobile
  function handleToggleMenu(){
    setShowSideMenu(!showSideMenu)
  }

  // To close side nav when pokemon selected in mobile
  function handleCloseMenu(){
    setShowSideMenu(false)
  }

  return (
    <>
      <Header handleToggleMenu={handleToggleMenu}/>
      <SideNav 
      selectedPokemon={selectedPokemon} 
      setSelectedPokemon={setSelectedPokemon} 
      handleCloseMenu={handleCloseMenu} 
      showSideMenu={showSideMenu}/>
      <PokeCard selectedPokemon={selectedPokemon} />
    </>
  )
}

export default App
