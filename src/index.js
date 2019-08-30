import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';

const Weather = ({ country, weather }) => {

    if (weather.length === 0) {
        return (
            <div>

            </div>
        )
    } else {
        let IMG_URL = "https://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png"
        console.log(IMG_URL)
        return (
            <div>
                <h2>Weather in {country.capital}</h2>

                <div className="Headline">temperature: </div> {weather.main.temp}
                <br />
                <img src={IMG_URL} alt="Icon of weather"/>
                <br />
                <div className="Headline">Wind: </div> {weather.wind.speed} m/s direction {weather.wind.deg} deg 
            </div>
        )
    }
}

const Result = ({ country }) => {
    const [weather, setWeather] = useState([])
    let url = "http://api.openweathermap.org/data/2.5/weather?q=" + country.capital + "," + country.alpha2Code + "&units=metric&appid=e5a8feebdc44050a1aaec2b8cd07bf25"
    useEffect(() => {
        axios
            .get(url)
            .then(response => {
                setWeather(response.data)
            })
        // eslint-disable-next-line
    }, [])
    console.log("weather", weather)
    return (
        <div>
            <h1>{country.name}</h1>
            <br />
            <div>capital {country.capital}</div>
            <div>population {country.population}</div>
            <h2>languages</h2>
            <ul>
                {country.languages.map((language, i) => <li key={i}>{language.name}</li>)}
            </ul>
            <img src={country.flag} alt="This is a flag" height="62" width="82" />
            <Weather country={country} weather={weather} />
        </div>
    )
}


const App = () => {
    const [countries, setCountries] = useState([])
    const [results, setResults] = useState([])
    const handleSearch = (event) => {
        const result = countries.filter(country => country.name.toLowerCase().includes(event.target.value.toLowerCase()))
        if (event.target.value.length === 0) {
            setResults([])
        } else {
            setResults(result)
        }
    }
    const handleClick = (country) => {
        console.log("Handleclick  kuuntelija")
        setResults(country)
    }
    const rows = () => results.map((country, i) => <div key={i}>{country.name} <button onClick={() => handleClick(country)}>show</button></div>)
    const result = (result) => {
        const isArray = result instanceof Array
        console.log("Onko array? ", isArray)
        if (result.length === 1) {
            return (
                <Result country={result[0]} />
            )
        } if (isArray === false) {
            return (
                <Result country={result} />
            )
        } if(result.length > 10) {
            return (
                <div>
                    Too many matches, specify another filter
                </div>
            )
        }else {
            return (
                <div>
                    {rows()}
                </div>
            )
        }
    }
    useEffect(() => {
        axios.get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                console.log("promise fullfilled")
                setCountries(response.data)
            })
    }, [])
    return (
        <div>
            find countries<input onChange={handleSearch} />
            {result(results)}
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));

