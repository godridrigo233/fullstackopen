import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    // 1. Si el input está vacío o es nulo, no hacemos petición a la API
    if (!name || name === '') {
      setCountry(null)
      return
    }

    // 2. Hacemos la petición a la API de Helsinki con el nombre del país
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        // País encontrado: guardamos los datos y encendemos la bandera 'found'
        setCountry({ found: true, data: response.data })
      })
      .catch(() => {
        // Error 404 (no existe el país): apagamos la bandera 'found'
        setCountry({ found: false })
      })
      
  }, [name]) // 🔥 CRÍTICO: El efecto SOLO se ejecuta si la variable 'name' cambia

  return country
}