import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import './index.css';
import Country from './components/country.js'

const App = () => {
	// state
	const [countries, setCountries] = useState([]);
	const [weather, setWeather] = useState([]);
	const [filteredCountries, setFilteredCountries] = useState([]);

	// hooks
	const countriesHook = () => {
	  axios
	    .get('https://restcountries.eu/rest/v2/all')
	    .then(response => {
	      setCountries(response.data)
	    })
	};
	useEffect(countriesHook, []);

	useEffect(() => {
		if (filteredCountries.length === 1) {
			const capital = filteredCountries[0].capital;

			const weatherEndpoint = `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_WEATHER_API_KEY}&query=${capital}`;
			
			axios
			.get(weatherEndpoint)
			.then(response => {
			  setWeather(response.data)
			})
		}
	}, [filteredCountries, setWeather]);

	// event handling
	const onChange = event => {
		const filtered = countries.filter(
				country => country.name.toUpperCase().includes(event.target.value.toUpperCase())
			);
		setFilteredCountries(filtered);
	};

	return (
		<div>
			<span>find countries </span>
			<span><input type='text' onChange={onChange}></input></span>
			<Result filteredCountries={filteredCountries} setFilteredCountries={setFilteredCountries} weather={weather} />
		</div>
		)
};

const Result = ({filteredCountries, setFilteredCountries, weather}) => {
	if (filteredCountries.length > 10) {
		return <p>Too many matches, specify another filter</p>;
	} else if (filteredCountries.length > 1) {
		return filteredCountries.map(country => <CollapsedCountry key={country.name} country={country} setFilteredCountries={setFilteredCountries} />);
	} else if (filteredCountries.length === 1 && weather.current !== undefined) {
		return <Country country={filteredCountries[0]} weather={weather} />;
	} else {
		return <></>;
	}
};

const CollapsedCountry = ({country, setFilteredCountries}) => {
	return (
		<div>
			<span key={country.name}>{country.name}</span>
			<button onClick={() => setFilteredCountries([country])}>show</button>
		</div>
		);
};

ReactDOM.render(<App />, document.getElementById('root'));