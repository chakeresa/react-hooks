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
  // status values:
  // idle: no request made yet
  // pending: request started
  // resolved: request successful
  // rejected: request failed
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: 'idle',
  })
  const {pokemon, error, status} = state

  console.log(state)

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  React.useEffect(() => {
    // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
    if (!pokemonName) {
      return null
    }

    // question for the group: why doesn't this work?
    // setState({status: 'pending', error: null, pokemon: null})
    setState({status: 'pending'})

    // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
    fetchPokemon(pokemonName)
      .then(pokemon => {
        // questions for the team:

        // initially I had the setStatus lines above the setPokemon lines
        // but that totally borked everything... why?

        // similarly to above setState issue: why doesn't this work?
        // setState({...state, status: 'resolved', pokemon})

        setState({status: 'resolved', pokemon})
      })
      .catch(error => {
        // setState({...state, status: 'rejected', error})
        setState({status: 'rejected', error})
      })

    // OR:
    // fetchPokemon(pokemonName).then(
    //   pokemon => setPokemon(pokemon),
    //   error => setError(error),
    // )

    // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
    // question for the group:
    // I get a warning when I don't include `state` in the dependency array
    // but if I do include it, my page is borked
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
