// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)

  // idle: no request made yet
  // pending: request started
  // resolved: request successful
  // rejected: request failed
  const [status, setStatus] = React.useState('idle')

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(() => {
    // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
    if (!pokemonName) {
      return null
    }

    setStatus('pending')

    // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
    fetchPokemon(pokemonName)
      .then(pokemon => {
        // question for the team:
        // initially I had the setStatus lines above the setPokemon lines
        // but that totally borked everything... why?
        setPokemon(pokemon)
        setStatus('resolved')
      })
      .catch(error => {
        setError(error)
        setStatus('rejected')
      })

    // OR:
    // fetchPokemon(pokemonName).then(
    //   pokemon => setPokemon(pokemon),
    //   error => setError(error),
    // )

    // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'rejected') {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }
  throw new Error('how did you get here?')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
