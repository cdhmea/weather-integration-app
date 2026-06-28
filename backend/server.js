import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import crypto from 'crypto'
import 'dotenv/config'
import fastify from 'fastify'
import { Pool } from 'pg'

const app = fastify()

app.register(fastifyCookie, {
	secret: 'weather-secret-key'
})

await app.register(cors, {
	origin: [
		'https://weather-integration-app.vercel.app',
		'https://weather-integration-app-tan.vercel.app'
	],
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: [
		'Origin',
		'X-Requested-With',
		'Accept',
		'Content-Type',
		'Authorization'
	],
	credentials: true,
	preflightContinue: false,
	optionsSuccessStatus: 204
})

const sessions = {}

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
})

app.get('/api/cities', async (req, res) => {
	try {
		const token = req.cookies.session_id

		if (!token || !sessions[token]) {
			return res.send([])
		}

		const username = sessions[token]

		const result = await pool.query(
			`SELECT c.id, c.name 
			FROM cities c 
			JOIN users u ON c.user_id = u.id 
			WHERE u.username = $1`,
			[username]
		)

		return res.send(result.rows)
	} catch (e) {
		console.error(e)
		return res.status(500).send({ message: 'Ошибка базы данных' })
	}
})

app.post('/api/cities', async (req, res) => {
	try {
		const token = req.cookies.session_id

		if (!token || !sessions[token]) {
			return res.status(401).send({ message: 'Не авторизован' })
		}

		const username = sessions[token]
		const { name } = req.body

		const userResult = await pool.query(
			'SELECT id FROM users WHERE username = $1',
			[username]
		)
		if (userResult.rows.length === 0) return res.status(404).send()

		const userId = userResult.rows[0].id

		await pool.query('INSERT INTO cities (name, user_id) VALUES ($1, $2)', [
			name,
			userId
		])

		return res.status(201).send({ message: 'Город добавлен в базу' })
	} catch (e) {
		console.error(e)
		return res.status(500).send({ message: 'Ошибка сохранения' })
	}
})

app.delete('/api/cities/:id', async (req, res) => {
	try {
		const token = req.cookies.session_id
		if (!token || !sessions[token]) return res.status(401).send()

		const { id } = req.params

		await pool.query('DELETE FROM cities WHERE id = $1', [id])
		return res.send({ message: 'Город удален' })
	} catch (e) {
		console.error(e)
		return res.status(500).send({ message: 'Ошибка удаления' })
	}
})

app.post('/api/register', async (req, res) => {
	try {
		const { username, password } = req.body

		if (!username || !password) {
			return res.status(400).send({ message: 'Заполните поля' })
		}

		const userCheck = await pool.query(
			'SELECT * FROM users WHERE username = $1',
			[username]
		)
		if (userCheck.rows.length > 0) {
			return res.status(400).send({ message: 'Логин занят' })
		}

		await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
			username,
			password
		])
		return res.send({ message: 'Успешная регистрация' })
	} catch (e) {
		console.error(e)
		return res.status(500).send({ message: 'Ошибка сервера' })
	}
})

app.post('/api/login', async (req, res) => {
	try {
		const { username, password } = req.body

		const result = await pool.query('SELECT * FROM users WHERE username = $1', [
			username
		])

		if (result.rows.length === 0 || result.rows[0].password !== password) {
			return res.status(400).send({ message: 'Неверный логин или пароль' })
		}

		const sessionToken = 'sess_' + crypto.randomBytes(16).toString('hex')
		sessions[sessionToken] = username

		res.setCookie('session_id', sessionToken, {
			path: '/',
			httpOnly: true,
			maxAge: 86400
		})

		return res.send({ username })
	} catch (e) {
		console.error(e)
		return res.status(500).send({ message: 'Ошибка авторизации' })
	}
})

app.post('/api/logout', async (req, res) => {
	const token = req.cookies.session_id
	if (token) delete sessions[token]

	res.setCookie('session_id', '', { path: '/', maxAge: 0 })
	return res.send({ message: 'Вышли' })
})

const initDb = async () => {
	try {
		await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL
      );
    `)
		console.log('Таблица готова')
	} catch (err) {
		console.error('Ошибка при инициализации бд:', err)
	}
}

await initDb()

const start = async () => {
	try {
		const currentPort = Number(process.env.PORT) || 3000
		await app.listen({ port: currentPort, host: '0.0.0.0' })
		console.log(`Бэкенд погоды запущен на порту ${currentPort}`)
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

start()
