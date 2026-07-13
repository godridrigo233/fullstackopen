import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  const countriesToShow = search === ''
    ? []
    : countries.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()))

  const activeCountry = countriesToShow.length === 1 ? countriesToShow[0] : selectedCountry

  useEffect(() => {
    if (activeCountry) {
      const [lat, lon] = activeCountry.capitalInfo.latlng || [0, 0]
      axios
        .get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(response => {
          setWeather(response.data.current_weather)
        })
        .catch(() => setWeather(null))
    } else {
      setWeather(null)
    }
  }, [activeCountry])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  return (
    <div style={{ padding: '20px' }}>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>

      {countriesToShow.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {countriesToShow.length > 1 && countriesToShow.length <= 10 && (
        <div style={{ marginTop: '10px' }}>
          {countriesToShow.map(c => (
            <div key={c.cca3} style={{ marginBottom: '5px' }}>
              {c.name.common}{' '}
              <button onClick={() => setSelectedCountry(c)}>show</button>
            </div>
          ))}
        </div>
      )}

      {activeCountry && (
        <div style={{ marginTop: '20px' }}>
          <h1>{activeCountry.name.common}</h1>
          <p>capital {activeCountry.capital?.[0]}</p>
          <p>area {activeCountry.area} km²</p>

          <h3>languages:</h3>
          <ul>
            {Object.values(activeCountry.languages || {}).map(lang => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>

          <img 
            src={activeCountry.flags.png} 
            alt={`Flag of ${activeCountry.name.common}`} 
            style={{ width: '150px', border: '1px solid #ccc', marginTop: '10px' }} 
          />

          {weather && (
            <div style={{ marginTop: '20px' }}>
              <h3>Weather in {activeCountry.capital?.[0]}</h3>
              <p>temperature {weather.temperature} °C</p>
              <p>wind {weather.windspeed} m/s</p>
            </div>
          )}
        </div>
      )}

      {countriesToShow.length === 0 && search !== '' && (
        <p>No matches found</p>
      )}
    </div>
  )
}

export default App