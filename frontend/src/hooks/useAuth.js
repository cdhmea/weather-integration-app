import { useEffect, useState } from 'react'
import { checkAuth, logoutUser } from '../api.js'

export const useAuth = () => {
	const [currentUser, setCurrentUser] = useState(null)
	const [loading, setLoading] = useState(true)

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

	const logout = async () => {
		await logoutUser()
		setCurrentUser(null)
	}

	return { currentUser, setCurrentUser, loading, logout }
}
