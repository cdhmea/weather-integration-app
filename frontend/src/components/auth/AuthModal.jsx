import { useState } from 'react'
import { loginUser, registerUser } from '../../api.js'

const AuthModal = ({ isOpen, onClose, onLoginSuccess, t }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [isLoginMode, setIsLoginMode] = useState(true)
	const [error, setError] = useState('')

	if (!isOpen) return null

	const handleSub = async e => {
		e.preventDefault()
		setError('')

		const trimmedUser = username.trim()
		const trimmedPass = password.trim()

		if (!trimmedUser || !trimmedPass) {
			setError(t.authEmptyFields)
			return
		}

		try {
			if (isLoginMode) {
				const res = await loginUser({
					username: trimmedUser,
					password: trimmedPass
				})
				onLoginSuccess(res.data.username)
				onClose()
			} else {
				await registerUser({ username: trimmedUser, password: trimmedPass })
				alert(t.authAlertSuccess)
				setIsLoginMode(true)
				setPassword('')
			}
		} catch (err) {
			console.error(err)
			setError(err.response?.data?.message || t.authServerError)
		}
	}

	const toggleMode = () => {
		setIsLoginMode(!isLoginMode)
		setError('')
		setUsername('')
		setPassword('')
	}

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<button
					onClick={onClose}
					className="modal-close"
				>
					✕
				</button>

				<h3 className="modal-title">
					{isLoginMode ? t.authLoginTitle : t.authRegisterTitle}
				</h3>

				{error && <div className="modal-error">{error}</div>}

				<form onSubmit={handleSub}>
					<div className="form-group">
						<label>{t.authLoginLabel}</label>
						<input
							type="text"
							className="modal-input"
							value={username}
							onChange={e => setUsername(e.target.value)}
							placeholder={t.authPlaceholderUser}
							required
						/>
					</div>

					<div className="form-group">
						<label>{t.authPasswordLabel}</label>
						<input
							type="password"
							className="modal-input"
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder={t.authPlaceholderPass}
							required
						/>
					</div>

					<button
						type="submit"
						className="modal-submit"
					>
						{isLoginMode ? t.authBtnLogin : t.authBtnRegister}
					</button>
				</form>

				<div className="modal-switch-container">
					<button
						onClick={toggleMode}
						className="modal-switch-btn"
					>
						{isLoginMode ? t.authSwitchToRegister : t.authSwitchToLogin}
					</button>
				</div>
			</div>
		</div>
	)
}

export default AuthModal
