function WeatherCard({ city }) {
	return (
		<li className="city">
			<h2
				className="city-name"
				data-name={`${city.name},${city.sys.country}`}
			>
				<span>{city.name}</span>
				<sup>{city.sys.country}</sup>
			</h2>
			<div className="city-temp">
				{Math.round(city.main.temp)}
				<sup>°C</sup>
			</div>
			<figure>
				<img
					className="city-icon"
					src={city.iconUrl}
					alt={city.weather[0]['description']}
				/>
				<figcaption>{city.weather[0]['description']}</figcaption>
			</figure>
		</li>
	)
}

export default WeatherCard
