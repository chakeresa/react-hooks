// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(key, initialValue = '', {serialize = JSON.stringify, deserialize = JSON.parse} = {}) {
  const [value, setValue] = React.useState(() =>
    deserialize(window.localStorage.getItem(key)) || initialValue
  )

  const oldKeyRef = React.useRef(key)

  React.useEffect(
    () => {
      const oldKey = oldKeyRef.current

      if (key !== oldKey) {
        window.localStorage.removeItem(oldKey)
      }

      oldKeyRef.current = key
      window.localStorage.setItem(key, serialize(value))
    },
    [key, value, serialize]
  )

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
