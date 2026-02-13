# 🛍️ Интернет-магазин - Полная документация

## Описание проекта

Полнофункциональный интернет-магазин с backend на **Rails 7.1** и мобильным приложением на **React Native Expo**.

### Технологический стек

**Backend:**
- Ruby on Rails 7.1
- PostgreSQL 14
- Devise + JWT для аутентификации
- JSONAPI Serializer
- Kaminari для пагинации
- Rack-CORS для Cross-Origin запросов

**Mobile:**
- React Native (Expo SDK 54)
- React Navigation 6.1
- Axios для HTTP запросов
- AsyncStorage для локального хранилища
- Expo Vector Icons

---

## 📋 Содержание

1. [Функциональные возможности](#функциональные-возможности)
2. [Архитектура](#архитектура)
3. [База данных](#база-данных)
4. [API Endpoints](#api-endpoints)
5. [Установка и запуск](#установка-и-запуск)
6. [Использование](#использование)
7. [Роли и права доступа](#роли-и-права-доступа)
8. [Безопасность](#безопасность)
9. [Тестирование](#тестирование)

---

## Функциональные возможности

### ✅ Реализованные функции

#### Аутентификация и авторизация
- [x] Регистрация новых пользователей
- [x] Вход в систему с email и паролем
- [x] Выход из системы
- [x] JWT токены для сессий
- [x] Автоматическое обновление токенов
- [x] Защита от несанкционированного доступа
- [x] Роли пользователей (admin/user)

#### Управление профилем
- [x] Просмотр своего профиля
- [x] Редактирование имени и фамилии
- [x] Изменение email
- [x] Смена пароля
- [x] Валидация всех полей
- [x] Требование текущего пароля для критичных изменений

#### Каталог товаров
- [x] Просмотр списка всех товаров
- [x] Детальная информация о товаре
- [x] Поиск товаров по названию (case-insensitive)
- [x] Пагинация результатов
- [x] Сортировка по названию и цене
- [x] Отображение цены и описания
- [x] Pull-to-refresh для обновления списка

#### Корзина покупок
- [x] Добавление товаров в корзину
- [x] Изменение количества товаров
- [x] Удаление товаров из корзины
- [x] Подсчет общей суммы
- [x] Отображение количества товаров (badge)
- [x] Сохранение корзины локально
- [x] Очистка корзины после оформления

#### Заказы
- [x] Создание заказа из корзины
- [x] Автоматический расчет суммы заказа
- [x] Просмотр истории заказов
- [x] Детальная информация о заказе
- [x] Список товаров в заказе
- [x] Отображение количества и цен
- [x] Подсчет общего количества товаров
- [x] Сортировка по дате (новые первые)

#### Административная панель
- [x] Управление пользователями (CRUD)
  - [x] Просмотр списка всех пользователей
  - [x] Редактирование данных пользователей
  - [x] Изменение ролей (admin ↔ user)
  - [x] Удаление пользователей
  - [x] Защита от самоудаления
  
- [x] Управление товарами (CRUD)
  - [x] Просмотр списка товаров
  - [x] Создание новых товаров
  - [x] Редактирование существующих
  - [x] Удаление товаров
  - [x] Валидация данных

- [x] Просмотр всех заказов
  - [x] Доступ к заказам всех пользователей
  - [x] Фильтрация и поиск

#### Интерфейс и UX
- [x] Адаптивный дизайн
- [x] Навигация между экранами
- [x] Tab navigation для основных разделов
- [x] Stack navigation для детальных экранов
- [x] Индикаторы загрузки
- [x] Обработка ошибок с понятными сообщениями
- [x] Pull-to-refresh
- [x] Пустые состояния (Empty states)
- [x] Иконки для навигации

- [x] Интеллектуальный Дашборд (Analytics)
  - [x] Расчет общей суммы чистых продаж (только заказы в статусе 'completed')
  - [x] Счетчик общего количества заказов, товаров и пользователей
  - [x] Список последних 5 заказов с быстрой навигацией
- [x] Управление заказами (Order Management)
  - [x] Глобальный просмотр всех заказов системы
  - [x] Система смены статусов (pending, processing, shipped, completed, cancelled)
  - [x] Мгновенное обновление финансовой статистики при завершении заказа

---

## Архитектура

### Backend Architecture

```
┌─────────────────────────────────────────────┐
│           React Native Mobile App            │
│                  (Expo)                      │
└────────────────┬────────────────────────────┘
                 │
                 │ HTTPS/HTTP
                 │ JSON API
                 │ JWT Authentication
                 │
┌────────────────▼────────────────────────────┐
│              Rails API Backend               │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │        Controllers Layer             │  │
│  │  - AuthenticationController          │  │
│  │  - ItemsController                   │  │
│  │  - OrdersController                  │  │
│  │  - UsersController (Admin)           │  │
│  │  - ProfileController                 │  │
│  └──────────────┬───────────────────────┘  │
│                 │                            │
│  ┌──────────────▼───────────────────────┐  │
│  │         Business Logic Layer         │  │
│  │  - User Model (Devise)               │  │
│  │  - Item Model                        │  │
│  │  - Order Model                       │  │
│  │  - OrderItem Model                   │  │
│  └──────────────┬───────────────────────┘  │
│                 │                            │
│  ┌──────────────▼───────────────────────┐  │
│  │         Serialization Layer          │  │
│  │  - JSONAPI::Serializer               │  │
│  │  - Custom formatters                 │  │
│  └──────────────┬───────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │
┌─────────────────▼──────────────────────────┐
│           PostgreSQL Database              │
│  - users                                   │
│  - items                                   │
│  - orders                                  │
│  - order_items                             │
└────────────────────────────────────────────┘
```

### Mobile App Architecture

```
┌──────────────────────────────────────────────┐
│              App.js (Entry Point)            │
│  - AuthProvider wrapper                      │
│  - CartProvider wrapper                      │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│           Navigation Layer                   │
│  - Stack Navigator (Auth/Main)               │
│  - Tab Navigator (User/Admin)                │
└────────────────┬─────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼────┐  ┌───▼────┐  ┌───▼────┐
│ Auth   │  │  User  │  │ Admin  │
│ Screens│  │ Screens│  │ Screens│
└───┬────┘  └───┬────┘  └───┬────┘
    │           │            │
    └───────────┼────────────┘
                │
┌───────────────▼──────────────────────────────┐
│           Context Layer (State)              │
│  - AuthContext (user, auth status)           │
│  - CartContext (cart items, operations)      │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│              API Layer                       │
│  - axios client with interceptors            │
│  - auth.js (login, signup, logout)           │
│  - items.js (CRUD operations)                │
│  - orders.js (create, list, details)         │
│  - users.js (profile, admin operations)      │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│          Local Storage                       │
│  - AsyncStorage (JWT token, user data)       │
│  - Cart persistence                          │
└──────────────────────────────────────────────┘
```

---

## База данных

### ER-диаграмма

Полная ER-диаграмма с описанием всех таблиц, связей, индексов и ограничений находится в файле:
**[DATABASE_ER_DIAGRAM.md](DATABASE_ER_DIAGRAM.md)**

### Краткая схема

```sql
-- Пользователи
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  encrypted_password VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'user',
  jti VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Товары
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Заказы
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Детали заказов
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES items(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  UNIQUE(order_id, item_id)
);
```

### Связи

- **users → orders** (One-to-Many): Один пользователь имеет много заказов
- **orders → order_items** (One-to-Many): Один заказ содержит много позиций
- **items → order_items** (One-to-Many): Один товар может быть в разных заказах

---

## API Endpoints

Полная спецификация API со всеми параметрами, примерами запросов и ответов находится в файле:
**[API_SPECIFICATION.md](API_SPECIFICATION.md)**

### Краткий список endpoints

#### Аутентификация
```
POST   /users/sign_up         Регистрация
POST   /users/sign_in         Вход
DELETE /users/sign_out        Выход
```

#### Профиль
```
GET    /api/v1/profile        Получить профиль
PUT    /api/v1/profile        Обновить профиль
```

#### Товары
```
GET    /api/v1/items          Список товаров
GET    /api/v1/items/:id      Детали товара
POST   /api/v1/items          Создать (admin)
PUT    /api/v1/items/:id      Обновить (admin)
DELETE /api/v1/items/:id      Удалить (admin)
```

#### Заказы
```
GET    /api/v1/orders         Мои заказы
GET    /api/v1/orders/:id     Детали заказа
POST   /api/v1/orders         Создать заказ
```

#### Пользователи (Admin)
```
GET    /api/v1/users          Список пользователей
GET    /api/v1/users/:id      Детали пользователя
PUT    /api/v1/users/:id      Обновить пользователя
DELETE /api/v1/users/:id      Удалить пользователя
```

---

## Установка и запуск

### Требования

- **Ubuntu 20.04+** или WSL2
- **Ruby 3.2+**
- **Rails 7.1+**
- **PostgreSQL 14+**
- **Node.js 18+**
- **npm или yarn**

### Backend

```bash
cd backend

# Установка зависимостей
bundle install

# Настройка окружения
cp .env.example .env

# Генерация секретного ключа
rails secret
# Добавьте в .env: DEVISE_JWT_SECRET_KEY=<сгенерированный ключ>

# Создание и настройка базы данных
rails db:create
rails db:migrate
rails db:seed

# Запуск сервера
rails server -p 3000
```

Backend будет доступен на `http://localhost:3000`

### Mobile

```bash
cd mobile

# Установка зависимостей
npm install

# Настройка API
# Откройте src/api/config.js и измените baseURL на ваш IP

# Запуск приложения
npm start

# После запуска Metro Bundler:
# - Установите Expo Go на телефон
# - Отсканируйте QR код
```

### Узнать свой IP

```bash
# Linux/Ubuntu
ip addr show | grep inet

# Найдите строку типа:
# inet 192.168.1.100/24

# В config.js используйте:
baseURL: 'http://192.168.1.100:3000'
```

**ВАЖНО:** Телефон и компьютер должны быть в одной WiFi сети!

---

## Использование

### Тестовые аккаунты

После выполнения `rails db:seed`:

**Администратор:**
```
Email: admin@example.com
Password: password123
Права: Полный доступ ко всем функциям
```

**Обычный пользователь:**
```
Email: user@example.com
Password: password123
Права: Покупки, управление профилем
```

### Сценарий использования

#### Для обычного пользователя:

1. **Регистрация/Вход**
   - Откройте приложение
   - Зарегистрируйтесь или войдите

2. **Просмотр товаров**
   - На главном экране отображаются все товары
   - Используйте поиск для фильтрации

3. **Добавление в корзину**
   - Нажмите на иконку корзины у товара
   - Или откройте детали и добавьте там

4. **Оформление заказа**
   - Перейдите в корзину (вкладка Cart)
   - Проверьте товары и сумму
   - Нажмите "Оформить заказ"

5. **Просмотр заказов**
   - Вкладка "Orders"
   - Нажмите на заказ для деталей

6. **Управление профилем**
   - Вкладка "Profile"
   - Редактируйте данные
   - Смените пароль при необходимости

#### Для администратора:

1. **Управление товарами**
   - Вкладка "Manage Items"
   - Создавайте, редактируйте, удаляйте товары

2. **Управление пользователями**
   - Вкладка "Manage Users"
   - Просматривайте список
   - Меняйте роли
   - Удаляйте пользователей

3. **Просмотр заказов**
   - Доступ ко всем заказам
   - Просмотр деталей любого заказа

---

## Роли и права доступа

### User (обычный пользователь)

**Разрешено:**
- ✅ Просмотр товаров
- ✅ Поиск товаров
- ✅ Добавление в корзину
- ✅ Создание заказов
- ✅ Просмотр своих заказов
- ✅ Редактирование своего профиля
- ✅ Смена своего пароля

**Запрещено:**
- ❌ Управление товарами
- ❌ Управление пользователями
- ❌ Просмотр чужих заказов
- ❌ Изменение ролей

### Admin (администратор)

**Все права User +**
- ✅ Создание товаров
- ✅ Редактирование товаров
- ✅ Удаление товаров
- ✅ Просмотр всех пользователей
- ✅ Редактирование пользователей
- ✅ Изменение ролей
- ✅ Удаление пользователей
- ✅ Просмотр всех заказов

**Ограничения:**
- ❌ Нельзя удалить самого себя

---

## Безопасность

### Реализованные меры

1. **Аутентификация**
   - Пароли хешируются с помощью bcrypt
   - Минимальная длина пароля: 6 символов
   - JWT токены с ограниченным сроком действия (1 день)
   - Автоматическая ревокация токенов при выходе

2. **Авторизация**
   - Проверка прав на уровне контроллеров
   - Middleware для защиты admin endpoints
   - Пользователи видят только свои данные
   - Admin имеет доступ ко всему

3. **Валидация данных**
   - Валидация на уровне моделей
   - Проверка форматов (email, цена и т.д.)
   - Защита от SQL injection
   - Sanitization входных данных

4. **API Security**
   - CORS настроен (в продакшене ограничить origins)
   - HTTPS рекомендуется для продакшена
   - Rate limiting (рекомендуется добавить)

5. **Защита от распространенных атак**
   - CSRF protection (встроено в Rails)
   - XSS protection
   - SQL Injection protection (ActiveRecord)
   - Mass assignment protection (strong parameters)

---

## Тестирование

### Ручное тестирование

#### Регистрация нового пользователя
```bash
curl -X POST http://localhost:3000/users/sign_up \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "first_name": "Test",
      "last_name": "User",
      "email": "user@example.com",
      "password": "password123",
      "password_confirmation": "password123"
    }
  }'
```

#### Вход
```bash
curl -X POST http://localhost:3000/users/sign_in \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "email": "user@example.com",
      "password": "password123"
    }
  }'
```

#### Получение товаров
```bash
curl -X GET http://localhost:3000/api/v1/items \
  -H "Authorization: Bearer <your_token>"
```

#### Создание заказа
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cart_items": [
      {"item_id": 1, "quantity": 2}
    ]
  }'
```

### Проверка health
```bash
curl http://localhost:3000/health
# Ответ: OK
```

---

## Структура проекта

```
ecommerce-project-expo/
│
├── backend/                          # Rails API
│   ├── app/
│   │   ├── controllers/
│   │   │   ├── api/v1/              # API контроллеры
│   │   │   │   ├── base_controller.rb
│   │   │   │   ├── items_controller.rb
│   │   │   │   ├── orders_controller.rb
│   │   │   │   ├── profile_controller.rb
│   │   │   │   └── users_controller.rb
│   │   │   ├── users/               # Devise контроллеры
│   │   │   │   ├── registrations_controller.rb
│   │   │   │   └── sessions_controller.rb
│   │   │   └── application_controller.rb
│   │   │
│   │   ├── models/
│   │   │   ├── user.rb              # Модель пользователя (Devise)
│   │   │   ├── item.rb              # Модель товара
│   │   │   ├── order.rb             # Модель заказа
│   │   │   └── order_item.rb        # Модель позиции заказа
│   │   │
│   │   └── serializers/
│   │       ├── user_serializer.rb
│   │       ├── item_serializer.rb
│   │       ├── order_serializer.rb
│   │       └── order_item_serializer.rb
│   │
│   ├── config/
│   │   ├── initializers/
│   │   │   ├── cors.rb              # CORS настройки
│   │   │   └── devise.rb            # Devise + JWT
│   │   ├── database.yml             # Настройки БД
│   │   └── routes.rb                # Маршруты
│   │
│   ├── db/
│   │   ├── migrate/                 # Миграции
│   │   └── seeds.rb                 # Тестовые данные
│   │
│   ├── Gemfile                      # Зависимости Ruby
│   └── README.md
│
├── mobile/                           # React Native (Expo)
│   ├── src/
│   │   ├── api/                     # API клиенты
│   │   │   ├── config.js            # Настройки API
│   │   │   ├── client.js            # Axios instance
│   │   │   ├── auth.js              # Аутентификация
│   │   │   ├── items.js             # Товары
│   │   │   ├── orders.js            # Заказы
│   │   │   └── users.js             # Пользователи
│   │   │
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.js       # Аутентификация
│   │   │   └── CartContext.js       # Корзина
│   │   │
│   │   ├── navigation/              # Навигация
│   │   │   └── AppNavigator.js      # Главный навигатор
│   │   │
│   │   └── screens/                 # Экраны
│   │       ├── Auth/                # Вход/Регистрация
│   │       │   ├── LoginScreen.js
│   │       │   └── RegisterScreen.js
│   │       ├── Home/                # Главная
│   │       │   ├── HomeScreen.js
│   │       │   └── ItemDetailsScreen.js
│   │       ├── Cart/                # Корзина
│   │       │   └── CartScreen.js
│   │       ├── Orders/              # Заказы
│   │       │   └── OrdersScreen.js
│   │       │ 
│   │       ├── Profile/             # Профиль
│   │       │   └── ProfileScreen.js
│   │       └── Admin/               # Админка
│   │           ├── AdminHomeScreen.js
│   │           ├── ManageUsersScreen.js
│   │           ├── ManageItemsScreen.js
│   │           ├── EditUserScreen.js
│   │           ├── EditItemScreen.js
│   │           └── ManageOrdersScreen.js
│   ├── App.js                       # Точка входа
│   ├── app.json                     # Конфигурация Expo
│   ├── package.json                 # Зависимости npm
│   └── README.md
│
├── DATABASE_ER_DIAGRAM.md           # ER-диаграмма БД
├── API_SPECIFICATION.md             # Спецификация API
└── README.md                        # Этот файл
```

---

## Дополнительные материалы

### Документация

- **[DATABASE_ER_DIAGRAM.md](DATABASE_ER_DIAGRAM.md)** - Полная ER-диаграмма базы данных
- **[API_SPECIFICATION.md](API_SPECIFICATION.md)** - Детальная спецификация API
- **backend/README.md** - Документация backend
- **mobile/README.md** - Документация mobile приложения

### Внешние ресурсы

- [Ruby on Rails Guides](https://guides.rubyonrails.org/)
- [Devise Documentation](https://github.com/heartcombo/devise)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)

---

## Известные ограничения

1. **CORS** - В продакшене нужно ограничить allowed origins
2. **Rate Limiting** - Не реализовано, рекомендуется добавить
3. **Email подтверждение** - Не реализовано (можно добавить через Devise)
4. **Восстановление пароля** - Базовая функциональность Devise, UI не реализован
5. **Push уведомления** - Не реализованы
6. **Оплата** - Не интегрирована (это MVP)
7. **Изображения товаров** - Не реализованы (можно добавить через ActiveStorage)

---

## Будущие улучшения

### Backend
- [ ] Загрузка изображений товаров (ActiveStorage)
- [ ] Категории товаров
- [ ] Фильтрация по категориям и цене
- [ ] Отзывы и рейтинги
- [ ] История изменений заказов
- [ ] Email уведомления
- [ ] Экспорт данных (CSV, PDF)
- [ ] API версионирование
- [ ] GraphQL endpoint
- [ ] WebSocket для real-time обновлений

### Mobile
- [ ] Избранное (Wishlist)
- [ ] История просмотров
- [ ] Рекомендации товаров
- [ ] Sharing товаров
- [ ] Dark mode
- [ ] Локализация (i18n)
- [ ] Offline режим
- [ ] Push уведомления
- [ ] Биометрическая аутентификация
- [ ] Deep linking

### DevOps
- [ ] Docker контейнеризация
- [ ] CI/CD pipeline
- [ ] Automated testing
- [ ] Production deployment guide
- [ ] Monitoring и logging
- [ ] Backup стратегия

---

**Версия:** 1.0.0  
**Последнее обновление:** 13 февраля 2026  
**Статус:** MVP
