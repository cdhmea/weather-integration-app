import { useEffect, useState } from 'react'
import AuthModal from './components/auth/AuthModal.jsx'
import { translations } from './components/language/translations.js'
import UserPanel from './components/UserPanel.jsx'
import WeatherCard from './components/weather/WeatherCard.jsx'
import WeatherControls from './components/weather/WeatherControls.jsx'
import { checkDuplicateCity } from './components/weather/weatherDupblicate.js'
import { useAuth } from './hooks/useAuth.js'
import { useWeather } from './hooks/useWeather.js'

function App() {
	const [inputValue, setInputValue] = useState('')
	const [lang, setLang] = useState(() => {
		return localStorage.getItem('app_lang') || 'ru'
	})
	const { currentUser, setCurrentUser, loading, logout } = useAuth()
	const [isAuthOpen, setIsAuthOpen] = useState(false)

	const apiKey = '28056ed67ae39cd8e99b0c0eecf00f05'
	const t = translations[lang]

	const {
		cities,
		msg,
		setMsg,
		loadCities,
		deleteCity,
		addCity,
		updateWeather,
		clearCities
	} = useWeather(apiKey, currentUser)

	useEffect(() => {
		if (currentUser) {
			loadCities()
		} else {
			clearCities()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser])

	const handleSubmit = async e => {
		e.preventDefault()

		if (checkDuplicateCity(cities, inputValue)) {
			setMsg(t.errDuplicate)
		} else {
			await addCity(inputValue, t)
		}
		setInputValue('')
	}

	useEffect(() => {
		localStorage.setItem('app_lang', lang)
	}, [lang])

	if (loading) {
		return (
			<div className="loading-container">
				<p>Загрузка данных...</p>
			</div>
		)
	}

	return (
		<>
			<UserPanel
				currentUser={currentUser}
				onLogout={logout}
				onAuthOpen={() => setIsAuthOpen(true)}
				lang={lang}
				onLanguageChange={setLang}
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
							onUpdate={() => updateWeather(t)}
							onClear={clearCities}
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
				onLoginSuccess={setCurrentUser}
				t={t}
			/>
		</>
	)
}

export default App
