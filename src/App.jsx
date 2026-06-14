import { useState } from 'react'
import WeatherCard from './components/WeatherCard'

function App() {
	const [inputValue, setInputValue] = useState('')
	const [cities, setCities] = useState([])
	const [msg, setMsg] = useState('')

	const apiKey = '4d8fb5b93d4af21d66a2948710284366'

	const handleSubmit = e => {
		e.preventDefault()

		let inputVal = inputValue

		if (cities.length > 0) {
			const filteredArray = cities.filter(city => {
				let content = ''
				//athens,gr
				if (inputVal.includes(',')) {
					//athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
					if (inputVal.split(',')[1].length > 2) {
						inputVal = inputVal.split(',')[0]
						content = city.name.toLowerCase()
					} else {
						content = `${city.name.toLowerCase()},${city.sys.country.toLowerCase()}`
					}
				} else {
					//athens
					content = city.name.toLowerCase()
				}
				return content === inputVal.toLowerCase()
			})

			if (filteredArray.length > 0) {
				setMsg(
					`You already know the weather for ${filteredArray[0].name} ...otherwise be more specific by providing the country code as well 😉`
				)
				setInputValue('')
				return
			}
		}

		//ajax here
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`

		fetch(url)
			.then(response => response.json())
			.then(data => {
				const { main, name, sys, weather, id } = data
				const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]['icon']}.svg`

				setCities(prevCities => [
					...prevCities,
					{ id, main, name, sys, weather, iconUrl }
				])
				setMsg('')
			})
			.catch(() => {
				setMsg('Please search for a valid city 😩')
			})

		setInputValue('')
	}

	return (
		<>
			<div class="api">
				<div class="container">
					🌞 This demo needs an OpenWeather API key to work.{' '}
					<a
						target="_blank"
						href="https://home.openweathermap.org/users/sign_up"
					>
						Get yours here for free!
					</a>
				</div>
			</div>
			<section className="top-banner">
				<div className="container">
					<h1 className="heading">Simple Weather App</h1>
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							placeholder="Search for a city"
							autoFocus
							value={inputValue}
							onChange={e => setInputValue(e.target.value)}
						/>
						<button type="submit">SUBMIT</button>
						<span className="msg">{msg}</span>
					</form>
				</div>
			</section>

			<section className="ajax-section">
				<div className="container">
					<ul className="cities">
						{cities.map(city => (
							<WeatherCard
								key={city.id}
								city={city}
							/>
						))}
					</ul>
				</div>
			</section>

			<footer className="page-footer">
				<div className="container">
					<small>
						Made with <span>&hearts;</span> by{' '}
						<a
							href="http://georgemartsoukos.com/"
							target="_blank"
							rel="noreferrer"
						>
							George Martsoukos
						</a>
					</small>
				</div>
			</footer>
		</>
	)
}

export default App
