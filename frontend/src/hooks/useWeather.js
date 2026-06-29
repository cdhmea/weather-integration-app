import { useCallback, useState } from 'react'
import { addSavedCity, deleteSavedCity, getSavedCities } from '../api'

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
			console.error('Ошибка загрузки:', err)
		}
	}, [apiKey])

	const deleteCity = useCallback(
		async id => {
			if (currentUser) {
				await deleteSavedCity(id)
			}
			setCities(prev => prev.filter(c => c.id !== id))
		},
		[currentUser]
	)

	const addCity = useCallback(
		async (name, country) => {
			if (currentUser) {
				await addSavedCity({ name, country })
				await loadCities()
			} else {
				const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`
				const response = await fetch(url)
				if (response.ok) {
					const data = await response.json()
					const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.weather[0].icon}.svg`
					const newCity = {
						id: data.id,
						main: data.main,
						name: data.name,
						sys: data.sys,
						weather: data.weather,
						iconUrl
					}
					setCities(prev => [...prev, newCity])
				}
			}
		},
		[currentUser, loadCities, apiKey]
	)

	const updateWeather = useCallback(
		async t => {
			const updated = await Promise.all(
				cities.map(async city => {
					const res = await fetch(
						`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric`
					)
					if (!res.ok) return city
					const data = await res.json()
					return {
						...city,
						main: data.main,
						weather: data.weather,
						iconUrl: `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.weather[0].icon}.svg`
					}
				})
			)
			setCities(updated)
			setMsg(t.updateSuccess)
		},
		[cities, apiKey]
	)

	const clearCities = useCallback(async () => {
		if (currentUser) {
			await Promise.all(cities.map(city => deleteSavedCity(city.id)))
		}
		setCities([])
		setMsg('')
	}, [cities, currentUser])

	return {
		cities,
		setCities,
		msg,
		setMsg,
		loadCities,
		deleteCity,
		addCity,
		updateWeather,
		clearCities
	}
}
