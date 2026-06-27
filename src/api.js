import axios from 'axios'

axios.defaults.withCredentials = true

export async function getSavedCities() {
	return await axios.get('/api/cities')
}

export async function addSavedCity(cityData) {
	return await axios.post('/api/cities', cityData)
}
export async function deleteSavedCity(cityId) {
	return await axios.delete(`/api/cities/${cityId}`)
}

export async function registerUser(userData) {
	return await axios.post('/api/register', userData)
}

export async function loginUser(userData) {
	return await axios.post('/api/login', userData)
}

export async function logoutUser() {
	return await axios.post('/api/logout')
}
