import { useCallback, useState } from 'react'
import { deleteSavedCity, getSavedCities } from '../api'

export const useWeather = (apiKey, currentUser) => {
	const [cities, setCities] = useState([])
	const [msg, setMsg] = useState('')

	const loadCities = useCallback(async () => {
		try {
			const res = await getSavedCities()
			if (!res.data) return

			const promises = res.data.map(async dbCity => {
				const url = `https://api.openweathermap.org/data/2.5/weather?q=${dbCity.name}&appid=${apiKey}&units=metric`
				const response = await fetch(url)
				if (!response.ok) return null

				const data = await response.json()
				const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.weather[0].icon}.svg`

				return {
					id: dbCity.id,
					main: data.main,
					name: data.name,
					sys: data.sys,
					weather: data.weather,
					iconUrl
				}
			})

			const weatherCities = await Promise.all(promises)
			setCities(weatherCities.filter(Boolean))
		} catch (err) {
			console.error('Ошибка загрузки городов:', err)
		}
	}, [apiKey])

	const deleteCity = useCallback(
		async id => {
			try {
				if (currentUser) {
					await deleteSavedCity(id)
				}
				setCities(prev => prev.filter(c => c.id !== id))
			} catch (err) {
				console.error('Ошибка удаления:', err)
			}
		},
		[currentUser]
	)

	return { cities, setCities, msg, setMsg, loadCities, deleteCity }
}
