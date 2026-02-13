module Api
  module V1
    module Admin
      class OrdersController < BaseController
        before_action :authorize_admin!
        before_action :set_order, only: [:update, :show]

        # GET /api/v1/admin/orders
        def index
          # Загрузка всех заказов с данными юзеров, чтобы не было N+1
          @orders = Order.includes(:user).recent.page(params[:page]).per(params[:per_page] || 20)
          
          render json: {
            orders: @orders.as_json(include: { user: { only: [:first_name, :last_name, :email] } }),
            meta: pagination_meta(@orders)
          }
        end

        # PATCH/PUT /api/v1/admin/orders/:id
        def update
          if @order.update(order_params)
            render json: { message: 'Статус заказа обновлен', order: @order }
          else
            render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def show
          render json: @order.as_json(include: [:user, { order_items: { include: :item } }])
        end

        private

        def set_order
          @order = Order.find(params[:id])
        end

        def order_params
          params.require(:order).permit(:status)
        end
      end
    end
  end
end