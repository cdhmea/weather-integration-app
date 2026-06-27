function LanguageToggle({ lang, onLanguageChange }) {
	return (
		<div
			className="lang-toggle"
			style={{ color: '#fff' }}
		>
			<button
				onClick={() => onLanguageChange('ru')}
				style={{
					fontWeight: lang === 'ru' ? 'bold' : 'normal',
					color: '#fff',
					background: 'none',
					border: 'none',
					cursor: 'pointer'
				}}
			>
				RU
			</button>
			<span style={{ color: '#fff' }}> | </span>
			<button
				onClick={() => onLanguageChange('en')}
				style={{
					fontWeight: lang === 'en' ? 'bold' : 'normal',
					color: '#fff',
					background: 'none',
					border: 'none',
					cursor: 'pointer'
				}}
			>
				EN
			</button>
		</div>
	)
}

export default LanguageToggle
