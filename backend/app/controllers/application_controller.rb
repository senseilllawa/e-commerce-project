class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  
  # Добавь этот блок:
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    # Разрешаем дополнительные поля для регистрации (sign_up)
    devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :role])
    # Если будешь обновлять профиль, разреши их и для account_update
    devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name, :role])
  end
end