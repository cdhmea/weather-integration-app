import { useEffect, useState } from 'react'
import { addSavedCity, checkAuth, logoutUser } from './api.js'
import AuthModal from './components/auth/AuthModal.jsx'
import { translations } from './components/language/translations.js'
import UserPanel from './components/UserPanel.jsx'
import { useWeather } from './hooks/useWeather.js'
import WeatherCard from './weather/WeatherCard.jsx'
import WeatherControls from './weather/WeatherControls.jsx'
import { checkDuplicateCity } from './weather/weatherDupblicate.js'

function App() {
	const [inputValue, setInputValue] = useState('')
	const [lang, setLang] = useState('ru')
	const [loading, setLoading] = useState(true)

	const [currentUser, setCurrentUser] = useState(null)
	const [isAuthOpen, setIsAuthOpen] = useState(false)

	const apiKey = '4d8fb5b93d4af21d66a2948710284366'
	const t = translations[lang]

	const { cities, setCities, msg, setMsg, loadCities, deleteCity } = useWeather(
		apiKey,
		currentUser
	)

	useEffect(() => {
		const initAuth = async () => {
			try {
				const res = await checkAuth()
				setCurrentUser(res.data.username)
			} catch {
				setCurrentUser(null)
			} finally {
				setLoading(false)
			}
		}
		initAuth()
	}, [])

	useEffect(() => {
		if (currentUser) {
			loadCities()
		} else {
			setCities([])
		}
	}, [currentUser, loadCities, setCities])

	const handleSubmit = async e => {
		e.preventDefault()
		if (checkDuplicateCity(cities, inputValue)) {
			setMsg(t.errDuplicate)
			setInputValue('')
			return
		}

		const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=metric`

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
					loadCities()
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

	if (loading) {
		return (
			<div className="loading-container">
				<p>Загрузка данных...</p>
			</div>
		)
	}

	const handleLogout = async () => {
		try {
			await logoutUser()
			setCurrentUser(null)
			setCities([])
		} catch (err) {
			console.error('Ошибка при выходе:', err)
		}
	}

	return (
		<>
			<UserPanel
				currentUser={currentUser}
				onLogout={handleLogout}
				onAuthOpen={() => setIsAuthOpen(true)}
				lang={lang}
				onLanguageChange={handleLanguageChange}
				t={t}
			/>

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
						<WeatherControls
							onUpdate={handleUpdateWeather}
							onClear={handleClearAll}
							t={t}
						/>
					)}
					<ul className="cities">
						{cities.map(city => (
							<WeatherCard
								key={city.id}
								city={city}
								onDelete={deleteCity}
							/>
						))}
					</ul>
				</div>
			</section>

			<footer className="page-footer">
				<div className="container">
					<small>{t.footerBase}</small>
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
