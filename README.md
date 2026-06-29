[![Maintainability](https://qlty.sh/gh/cdhmea/projects/weather-integration-app/maintainability.svg)](https://qlty.sh/gh/cdhmea/projects/weather-integration-app)

# Weather Integration App

Это приложение для отслеживания погоды в реальном времени. Оно позволяет
пользователям искать информацию о погоде в выбранных городах и сохранять их в
личный список. Авторизованные пользователи могут сохранять свои предпочтения в
базе данных PostgreSQL, что обеспечивает доступ к списку городов с любого
устройства.

### Стек проекта

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Fastify
- **Database:** PostgreSQL

### Ссылка на деплой

###### https://weather-integration-app-tan.vercel.app/

### Demo Credentials

Для тестирования функционала авторизации вы можете использовать следующие
данные:

- **Username:** `maksim`
- **Password:** `123`

### Демонстрация функционала приложения

[Видео](docs/demo.mp4)

## Техническая документация

- [Диаграмма вариантов использования (Use Case)](docs/use-case.png)
- [Схема базы данных (ERD)](docs/erd.png)

---

### Инструкция по запуску

#### 1. Конфигурация базы данных

Для работы приложения необходим локально установленный PostgreSQL.

1. Создайте базу данных с названием `weather_db` через pgAdmin или терминал.
2. В папке `backend` создайте файл `.env`, используя пример из `env.example`:

```
cd backend
cp env.example .env
```

3. Откройте файл .env и укажите данные вашего локального PostgreSQL:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=ваш_пароль
DB_NAME=weather_db
```

#### 2. Запуск сервака

```
cd backend
npm install
node server.js
```

#### 3. Запуск фронта

```
cd frontend
npm install
npm run dev
```
