import React from 'react';

const Country = ({country, weather}) => {
	const flagAlt = `flag of ${country.name}`;
	const weatherAlt = `icon for weather of ${country.capital}`;

	console.log(weather.current.weather_icons[0]);

	return (
		<>
			<h3>{country.name}</h3>
			<p>capital {country.capital}</p>
			<p>population {country.population}</p>
			<h4>languages</h4>
			<ul>{country.languages.map(language => <Language key={language.name} language={language} />)}</ul>
			<img src={country.flag} alt={flagAlt} width='100px'></img>

			<h3>Weather in {country.capital}</h3>
			<p><b>temperature:</b> {weather.current.temperature} Celsius</p>
			<img src={weather.current.weather_icons[0]} alt={weatherAlt} />
			<p><b>wind:</b> {weather.current.wind_speed} kph direction {weather.current.wind_dir}</p>
			
		</>
	);
	};

const Language = ({language}) => {
	return (<li>{language.name}</li>);
};

export default Country;