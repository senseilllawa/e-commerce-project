Rails.application.routes.draw do
  # Devise routes для аутентификации (JWT/Sessions)
  devise_for :users, path: 'users', path_names: {
    sign_in: 'sign_in',
    sign_out: 'sign_out',
    registration: 'sign_up'
  }, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  # Основные API роуты
  namespace :api do
    namespace :v1 do
      # Управление профилем текущего пользователя
      resource :profile, only: [:show, :update]

      # Управление товарами (публичный просмотр + админские действия)
      resources :items

      # Заказы обычного пользователя (его личная история и создание)
      resources :orders, only: [:index, :show, :create]

      # --- Админская панель ---
      namespace :admin do
        # Статистика продаж и общие показатели
        resource :dashboard, only: [:show]
        
        # Управление пользователями (роли, пароли, удаление)
        resources :users, only: [:index, :show, :update, :destroy]
        
        # Глобальное управление заказами всех пользователей (смена статусов)
        resources :orders, only: [:index, :show, :update]
      end
    end
  end

  # Health check для проверки работоспособности сервера
  get 'health', to: proc { [200, {}, ['OK']] }
end
