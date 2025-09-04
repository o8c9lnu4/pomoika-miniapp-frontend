# 🚀 Деплой Mini App на Netlify

## 1. Создайте новый репозиторий на GitHub

1. Зайдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Название: `pomoika-miniapp-frontend`
4. Сделайте публичным
5. **НЕ** добавляйте README, .gitignore, лицензию
6. Нажмите "Create repository"

## 2. Загрузите код в GitHub

```bash
# В папке frontend-only выполните:
git remote add origin https://github.com/ВАШ_USERNAME/pomoika-miniapp-frontend.git
git branch -M main
git push -u origin main
```

## 3. Деплой на Netlify

1. Зайдите на [netlify.com](https://netlify.com)
2. "New site from Git"
3. Выберите GitHub → `pomoika-miniapp-frontend`
4. Настройки:
   - **Publish directory**: `.` (корень)
   - **Build command**: `echo 'Static site - no build needed'`
5. Нажмите "Deploy site"
6. Получите URL: `https://pomoika-miniapp-frontend.netlify.app`

## 4. Обновите конфиги

1. В `config.js` укажите URL вашего Render API:
   ```js
   API_BASE: 'https://pomoika-api.onrender.com'
   ```

2. В BotFather:
   - Menu Button → Web App URL: `https://pomoika-miniapp-frontend.netlify.app/`

3. В `.env` (для бота):
   ```env
   WEBAPP_URL=https://pomoika-miniapp-frontend.netlify.app/
   ```

## 5. Проверка

- Откройте бота → /start → "Открыть Mini App"
- Mini App должен загрузить каталог
- Добавьте товары в корзину → оформите заказ

## Структура проекта

```
├── index.html      # Mini App
├── styles.css      # Стили (фиолетово-чёрная тема)
├── main.js         # JavaScript (корзина, поиск)
├── config.js       # API конфигурация
├── _redirects      # Netlify редиректы
├── netlify.toml    # Конфиг Netlify
└── README.md       # Описание
```

Готово! 🎉
