import { useState } from 'react'
import LanguageToggle from './components/language/LanguageToggle.jsx'
import { translations } from './components/language/translations.js'
import WeatherCard from './components/WeatherCard'

function App() {
	const [inputValue, setInputValue] = useState('')
	const [cities, setCities] = useState([])
	const [msg, setMsg] = useState('')
	const [lang, setLang] = useState('ru')

	const apiKey = '4d8fb5b93d4af21d66a2948710284366'

	const t = translations[lang]

	const handleSubmit = async e => {
		e.preventDefault()

		let inputVal = inputValue

		if (cities.length > 0) {
			const filteredArray = cities.filter(city => {
				if (inputVal.includes(',')) {
					if (inputVal.split(',')[1].length > 2) {
						const shortInputVal = inputVal.split(',')[0]
						return city.name.toLowerCase() === shortInputVal.toLowerCase()
					} else {
						const content = `${city.name.toLowerCase()},${city.sys.country.toLowerCase()}`
						return content === inputVal.toLowerCase()
					}
				} else {
					const content = city.name.toLowerCase()
					return content === inputVal.toLowerCase()
				}
			})

			if (filteredArray.length > 0) {
				setMsg(t.errDuplicate)
				setInputValue('')
				return
			}
		}

		const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`

		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error('City not found')
			}

			const data = await response.json()
			const { main, name, sys, weather, id } = data
			const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]['icon']}.svg`

			setCities(prevCities => [
				...prevCities,
				{ id, main, name, sys, weather, iconUrl }
			])
			setMsg('')
		} catch {
			setMsg(t.errNotFound)
		}

		setInputValue('')
	}

	const handleLanguageChange = newLang => {
		setLang(newLang)
		setMsg('')
	}

	const handleClearAll = () => {
		setCities([])
		setMsg('')
	}

	return (
		<>
			<div className="api">
				<div
					className="container"
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<span>
						{t.banner}{' '}
						<a
							target="_blank"
							href="https://home.openweathermap.org/users/sign_up"
						>
							{t.link}
						</a>
					</span>

					<LanguageToggle
						lang={lang}
						onLanguageChange={handleLanguageChange}
					/>
				</div>
			</div>

			<section className="top-banner">
				<div className="container">
					<h1 className="heading">{t.heading}</h1>
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							placeholder={t.placeholder}
							autoFocus
							value={inputValue}
							onChange={e => setInputValue(e.target.value)}
						/>
						<button type="submit">{t.button}</button>
						<span className="msg">{msg}</span>
					</form>
				</div>
			</section>

			<section className="ajax-section">
				<div className="container">
					{cities.length > 0 && (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								marginBottom: '20px'
							}}
						>
							<button
								type="button"
								onClick={handleClearAll}
								style={{
									background: '#ff4d4d',
									color: '#fff',
									border: 'none',
									padding: '10px 20px',
									borderRadius: '5px',
									cursor: 'pointer',
									fontWeight: 'bold'
								}}
							>
								{t.clearBtn}
							</button>
						</div>
					)}
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
						{t.footer} <span>&hearts;</span> {t.by}{' '}
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
