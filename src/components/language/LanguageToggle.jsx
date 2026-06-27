function LanguageToggle({ lang, onLanguageChange }) {
	return (
		<div className="lang-buttons">
			<button
				type="button"
				onClick={() => onLanguageChange('ru')}
				style={{
					fontWeight: lang === 'ru' ? 'bold' : 'normal',
					marginRight: '5px',
					cursor: 'pointer'
				}}
			>
				RU
			</button>
			<button
				type="button"
				onClick={() => onLanguageChange('en')}
				style={{
					fontWeight: lang === 'en' ? 'bold' : 'normal',
					cursor: 'pointer'
				}}
			>
				EN
			</button>
		</div>
	)
}

export default LanguageToggle
