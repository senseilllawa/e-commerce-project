module Api
  module V1
    class BaseController < ApplicationController
      # Все API запросы требуют авторизации
      before_action :authenticate_user!
      
      # Глобальная обработка ошибки, если запись не найдена
      rescue_from ActiveRecord::RecordNotFound, with: :not_found

      private

      # Проверка прав админа (используется в ItemsController и Dashboard)
      def authorize_admin!
        unless current_user&.role == 'admin' # или current_user&.admin? если есть метод в модели
          render json: { error: 'Access denied. Admins only.' }, status: :forbidden
        end
      end

      # Универсальный метод для мета-данных пагинации
      def pagination_meta(collection)
        {
          current_page: collection.current_page,
          next_page: collection.next_page,
          prev_page: collection.prev_page,
          total_pages: collection.total_pages,
          total_count: collection.total_count
        }
      rescue NoMethodError
        # На случай, если коллекция не поддерживает пагинацию (например, массив)
        {}
      end

      def not_found
        render json: { error: 'Record not found' }, status: :not_found
      end
    end
  end
end