import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import SearchBar from './SearchBar'
import PkmnData from './PkmnData'
import Pagination from './Pagination'

const formatPokemonData = (pkmn) => ({
  name: pkmn.name,
  id: pkmn.id,
  image:
    pkmn.sprites?.other?.dream_world?.front_default ||
    pkmn.sprites?.other?.["official-artwork"]?.front_default ||
    pkmn.sprites?.front_default ||
    null,
  types: pkmn.types.map(t => t.type.name),
  height: pkmn.height,
  weight: pkmn.weight,
  abilities: pkmn.abilities.map(a => a.ability.name),
  stats: {
    hp: pkmn.stats['0'].base_stat,
    atk: pkmn.stats['1'].base_stat,
    def: pkmn.stats['2'].base_stat,
    spe_atk: pkmn.stats['3'].base_stat,
    spe_def: pkmn.stats['4'].base_stat,
    spd: pkmn.stats['5'].base_stat,
  },
  cry: pkmn.cries.latest,
})

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [currentId, setCurrentId] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const MAX_ID = 1025

  const cache = useRef({})

  const abortControllerRef = useRef(null)

  const fetchPokemon = useCallback(async (query) => {
    const cacheKey = String(query).toLowerCase()

    if (cache.current[cacheKey]) {
      setPokemon(cache.current[cacheKey])
      setCurrentId(cache.current[cacheKey].id)
      setLoading(false)
      setError(null)
      return
    }

    if (abortControllerRef.current) abortControllerRef.current.abort()
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query}`, { 
        signal: abortControllerRef.current.signal 
      })
      
      const pkmn = res.data
      const formattedData = formatPokemonData(pkmn)

      cache.current[formattedData.name.toLowerCase()] = formattedData
      cache.current[formattedData.id] = formattedData
      
      setPokemon(formattedData)
      setCurrentId(formattedData.id)
      setLoading(false)

    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return

      if (err.response && err.response.status === 404) {
        setError('404 Pokémon not found! 🚧')
      } else {
        setError('400 Failed to fetch Pokémon. 🚫')
      }
      
      setPokemon(null)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPokemon(1)
    
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort() }
  }, [fetchPokemon])

  const handleSearch = useCallback((query) => {
    const idOrName = /^\d+$/.test(query) ? parseInt(query, 10) : query.toLowerCase()

    fetchPokemon(idOrName)
  }, [fetchPokemon])

  const goToPrev = useCallback(() => { 
    if (currentId > 1) fetchPokemon(currentId - 1) 
  }, [currentId, fetchPokemon])

  const goToNext = useCallback(() => { 
    if (currentId < MAX_ID) fetchPokemon(currentId + 1) 
  }, [currentId, fetchPokemon])

  return (
    <>
      <SearchBar onSearch={handleSearch} loading={loading} />
      
      { loading && <p className="loading">Loading... ⏳</p> }
      { error && <p className="error">{error}</p> }
      { !loading && !error && !pokemon && <p>No Pokémon found.</p> }
      
      {!loading && !error && pokemon && (
        <>
          <PkmnData pokemon={pokemon} />

          <Pagination
            gotoPrevPage={currentId > 1 ? goToPrev : null}

            gotoNextPage={currentId < MAX_ID ? goToNext : null}
          />
        </>
      )}
    </>
  )
}

export default App