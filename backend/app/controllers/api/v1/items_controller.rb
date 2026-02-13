module Api
  module V1
    class ItemsController < BaseController
      before_action :set_item, only: [:show, :update, :destroy]
      before_action :authorize_admin!, only: [:create, :update, :destroy]

      # GET /api/v1/items
      def index
        @items = Item.all
        @items = @items.search_by_name(params[:search]) if params[:search].present?
        @items = @items.respond_to?(:ordered_by_name) ? @items.ordered_by_name : @items.order(:name)
        @items = @items.page(params[:page]).per(params[:per_page] || 20)
        
        render json: {
          items: defined?(ItemSerializer) ? 
                 ItemSerializer.new(@items).serializable_hash[:data].map { |i| i[:attributes] } : 
                 @items,
          meta: pagination_meta(@items)
        }
      end

      # GET /api/v1/items/:id
      def show
        if defined?(ItemSerializer)
          render json: ItemSerializer.new(@item).serializable_hash[:data][:attributes]
        else
          render json: @item
        end
      end

      # POST /api/v1/items
      def create
        @item = Item.new(item_params)
        
        if @item.save
          render json: {
            message: 'Item created successfully',
            item: defined?(ItemSerializer) ? 
                  ItemSerializer.new(@item).serializable_hash[:data][:attributes] : 
                  @item
          }, status: :created
        else
          render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT/PATCH /api/v1/items/:id
      def update
        if @item.update(item_params)
          render json: {
            message: 'Item updated successfully',
            item: defined?(ItemSerializer) ? 
                  ItemSerializer.new(@item).serializable_hash[:data][:attributes] : 
                  @item
          }
        else
          render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/items/:id
      def destroy
        if @item.destroy
          render json: { message: 'Item deleted successfully' }
        else
          render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_item
        @item = Item.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Item not found' }, status: :not_found
      end

      def item_params
        params.require(:item).permit(:name, :description, :price)
      end
    end
  end
end