export const checkDuplicateCity = (cities, inputVal) => {
	if (cities.length === 0) return false
	return cities.some(city => {
		if (inputVal.includes(',')) {
			const [cityName, countryCode] = inputVal
				.split(',')
				.map(s => s.trim().toLowerCase())
			if (countryCode && countryCode.length > 2)
				return city.name.toLowerCase() === cityName
			return (
				`${city.name.toLowerCase()},${city.sys.country.toLowerCase()}` ===
				inputVal.toLowerCase()
			)
		}
		return city.name.toLowerCase() === inputVal.toLowerCase()
	})
}
