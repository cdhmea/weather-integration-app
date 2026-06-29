function WeatherCard({ city, onDelete }) {
	return (
		<li
			className="city"
			style={{ position: 'relative' }}
		>
			<button
				onClick={() => onDelete(city.id)}
				style={{
					position: 'absolute',
					top: '5px',
					right: '5px',
					background: 'transparent',
					border: 'none',
					cursor: 'pointer',
					fontSize: '18px',
					color: '#ff4d4d'
				}}
			>
				&times;
			</button>

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
