# config/initializers/devise.rb

# Принудительно загружаем наш кастомный Responder из папки lib
require_relative '../../lib/api_responder'

Devise.setup do |config|
  # Электронная почта, которая будет отображаться как отправитель
  config.mailer_sender = 'noreply@ecommerce.com'
  
  # Используем ActiveRecord для работы с базой
  require 'devise/orm/active_record'

  # Настройки безопасности и форматирования ключей
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth, :params_auth]
  config.stretches = Rails.env.test? ? 1 : 12
  config.reconfirmable = false
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete

  # Указываем наш ApiResponder (теперь он точно будет виден)
  config.responder = ApiResponder

  # Настройка JWT для авторизации (нужна для React Native)
  config.jwt do |jwt|
    # Берем секретный ключ из .env или используем стандартный ключ приложения
    jwt.secret = ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.secret_key_base
    
    # Маршруты, для которых генерируется и удаляется токен
    jwt.dispatch_requests = [
      ['POST', %r{^/users/sign_in$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/users/sign_out$}]
    ]
    # Время жизни токена — 1 день
    jwt.expiration_time = 1.day.to_i
  end

  # Для API-приложения отключаем навигационные форматы (редиректы и т.д.)
  config.navigational_formats = []
end