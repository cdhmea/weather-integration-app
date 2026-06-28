import LanguageToggle from './language/LanguageToggle.jsx'

const UserPanel = ({
	currentUser,
	onLogout,
	onAuthOpen,
	lang,
	onLanguageChange,
	t
}) => {
	return (
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
							onClick={onLogout}
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
						onClick={onAuthOpen}
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
					onLanguageChange={onLanguageChange}
				/>
			</div>
		</div>
	)
}

export default UserPanel
