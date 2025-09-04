# Pomoika Mini App Frontend

Этот репозиторий содержит только фронтенд для Telegram Mini App.

## Деплой на Netlify

1. Подключите этот репозиторий к Netlify
2. Настройки:
   - **Publish directory**: `.` (корень)
   - **Build command**: `echo 'Static site - no build needed'`
3. В `config.js` укажите URL вашего backend API

## Структура

```
├── index.html      # Главная страница
├── styles.css      # Стили
├── main.js         # JavaScript логика
├── config.js       # Конфигурация API
├── _redirects      # Netlify редиректы
└── netlify.toml    # Конфиг Netlify
```
