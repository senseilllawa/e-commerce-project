module Api
  module V1
    class OrdersController < BaseController
      respond_to :json
      before_action :set_order, only: [:show]

      # GET /api/v1/orders
      def index
        @orders = current_user.orders.recent.page(params[:page]).per(params[:per_page] || 20)
        
        render json: {
          orders: defined?(OrderSerializer) ? 
                  OrderSerializer.new(@orders).serializable_hash[:data].map { |o| o[:attributes] } : 
                  @orders,
          meta: pagination_meta(@orders)
        }
      end

      # GET /api/v1/orders/:id
      def show
        if @order.user_id != current_user.id && !current_user.admin?
          render json: { error: 'Access denied' }, status: :forbidden
          return
        end

        render json: defined?(OrderSerializer) ? 
               OrderSerializer.new(@order, { include: [:order_items, 'order_items.item'] }).serializable_hash : 
               @order.as_json(include: { order_items: { include: :item } })
      end

      # POST /api/v1/orders
      def create
        order_data = { amount: params[:total_price] }
        order_data[:status] = 'pending' if Order.column_names.include?('status')

        @order = current_user.orders.build(order_data)
        
        if params[:items].present?
          params[:items].each do |cart_entry|
            item_data = cart_entry[:item]
            item = Item.find(item_data[:id])
            
            @order.order_items.build(
              item: item,
              quantity: cart_entry[:quantity],
              price: item.price 
            )
          end
        end

        @order.amount = @order.order_items.sum { |oi| (oi.price || 0) * oi.quantity }

        if @order.save
          render json: {
            message: 'Order created successfully',
            order: defined?(OrderSerializer) ? OrderSerializer.new(@order).serializable_hash : @order
          }, status: :created
        else
          render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_order
        @order = Order.find(params[:id])
      end

      def pagination_meta(object)
        {
          current_page: object.current_page,
          next_page: object.next_page,
          prev_page: object.prev_page,
          total_pages: object.total_pages,
          total_count: object.total_count
        } rescue nil
      end
    end
  end
end