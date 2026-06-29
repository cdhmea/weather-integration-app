import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true
})

export async function getSavedCities() {
	return await api.get('/api/cities')
}

export async function addSavedCity(cityData) {
	return await api.post('/api/cities', cityData)
}
export async function deleteSavedCity(cityId) {
	return await api.delete(`/api/cities/${cityId}`)
}

export async function registerUser(userData) {
	return await api.post('/api/register', userData)
}

export async function loginUser(userData) {
	return await api.post('/api/login', userData)
}

export async function logoutUser() {
	return await api.post('/api/logout')
}

export async function checkAuth() {
	return await api.get('/api/check-auth')
}
