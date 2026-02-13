module Api
  module V1
    module Admin
      class DashboardsController < BaseController
        before_action :authorize_admin!

        def show
          render json: {
            stats: {
              total_sales: Order.where(status: 'completed').sum(:amount).to_f,
              orders_count: Order.count,
              items_count: Item.count,
              users_count: User.count
            },
            recent_orders: Order.includes(:user).recent.limit(5).map { |order|
              {
                id: order.id,
                amount: order.amount.to_f,
                status: order.status,
                created_at: order.created_at,
                user: {
                  full_name: "#{order.user.first_name} #{order.user.last_name}",
                  email: order.user.email
                }
              }
            }
          }
        end
      end
    end
  end
end