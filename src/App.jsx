import { useEffect, useState } from 'react'
import { addSavedCity, getSavedCities } from './api.js'
import AuthModal from './components/auth/AuthModal.jsx'
import LanguageToggle from './components/language/LanguageToggle.jsx'
import { translations } from './components/language/translations.js'
import WeatherCard from './components/WeatherCard'

function App() {
	const [inputValue, setInputValue] = useState('')
	const [cities, setCities] = useState([])
	const [msg, setMsg] = useState('')
	const [lang, setLang] = useState('ru')

	const [currentUser, setCurrentUser] = useState(null)
	const [isAuthOpen, setIsAuthOpen] = useState(false)

	const apiKey = '4d8fb5b93d4af21d66a2948710284366'
	const t = translations[lang]

	useEffect(() => {
		if (!currentUser) return

		const loadDbCities = async () => {
			try {
				const res = await getSavedCities()
				if (res.data && res.data.length > 0) {
					const promises = res.data.map(async dbCity => {
						const url = `https://api.openweathermap.org/data/2.5/weather?q=${dbCity.name}&appid=${apiKey}&units=metric`
						const response = await fetch(url)
						if (!response.ok) return null
						const data = await response.json()
						const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.weather[0]['icon']}.svg`
						return {
							id: dbCity.id,
							main: data.main,
							name: dbCity.name,
							sys: data.sys,
							weather: data.weather,
							iconUrl
						}
					})
					const weatherCities = await Promise.all(promises)
					setCities(weatherCities.filter(Boolean))
				}
			} catch (err) {
				console.error(err)
			}
		}
		loadDbCities()
	}, [currentUser])

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

			if (currentUser) {
				try {
					await addSavedCity({ name, country: sys.country })
				} catch (dbErr) {
					console.error('Ошибка сохранения в БД', dbErr)
				}
			}

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

	const handleUpdateWeather = async () => {
		if (cities.length === 0) return

		try {
			const updatePromises = cities.map(async city => {
				const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric`
				const response = await fetch(url)

				if (!response.ok) return city

				const data = await response.json()
				const { main, weather } = data
				const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]['icon']}.svg`

				return { ...city, main, weather, iconUrl }
			})

			const updatedCities = await Promise.all(updatePromises)
			setCities(updatedCities)
			setMsg(t.updateSuccess)
		} catch {
			setMsg(t.updateError)
		}
	}

	return (
		<>
			<div className="user-panel">
				<div
					className="container"
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
						gap: '15px',
						padding: '10px 0'
					}}
				>
					{currentUser ? (
						<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
							<span style={{ fontWeight: 'bold', color: '#5cb85c' }}>
								👤 {currentUser}
							</span>
							<button
								onClick={() => {
									setCurrentUser(null)
									setCities([])
								}}
								style={{
									background: '#ff4d4d',
									color: '#fff',
									border: 'none',
									padding: '5px 10px',
									borderRadius: '4px',
									cursor: 'pointer'
								}}
							>
								{t.authBtnLogout}
							</button>
						</div>
					) : (
						<button
							onClick={() => setIsAuthOpen(true)}
							style={{
								background: '#337ab7',
								color: '#fff',
								border: 'none',
								padding: '5px 12px',
								borderRadius: '4px',
								cursor: 'pointer',
								fontWeight: 'bold'
							}}
						>
							{t.authBtnLogin}
						</button>
					)}
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
								gap: '15px',
								marginBottom: '20px'
							}}
						>
							<button
								type="button"
								onClick={handleUpdateWeather}
								style={{
									background: '#5cb85c',
									color: '#fff',
									border: 'none',
									padding: '10px 20px',
									borderRadius: '5px',
									cursor: 'pointer',
									fontWeight: 'bold'
								}}
							>
								{t.updateBtn}
							</button>
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

			<AuthModal
				isOpen={isAuthOpen}
				onClose={() => setIsAuthOpen(false)}
				onLoginSuccess={username => setCurrentUser(username)}
				t={t}
			/>
		</>
	)
}

export default App
