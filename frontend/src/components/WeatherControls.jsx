const WeatherControls = ({ onUpdate, onClear, t }) => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				gap: '15px',
				marginBottom: '20px'
			}}
		>
			<button
				type="button"
				onClick={onUpdate}
				style={{
					background: '#5cb85c',
					color: '#fff',
					border: 'none',
					padding: '10px 20px',
					borderRadius: '5px',
					cursor: 'pointer',
					fontWeight: 'bold'
				}}
			>
				{t.updateBtn}
			</button>
			<button
				type="button"
				onClick={onClear}
				style={{
					background: '#ff4d4d',
					color: '#fff',
					border: 'none',
					padding: '10px 20px',
					borderRadius: '5px',
					cursor: 'pointer',
					fontWeight: 'bold'
				}}
			>
				{t.clearBtn}
			</button>
		</div>
	)
}

export default WeatherControls
