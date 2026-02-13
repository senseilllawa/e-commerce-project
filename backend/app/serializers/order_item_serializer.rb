class OrderItemSerializer
  include JSONAPI::Serializer

  attributes :id, :quantity, :created_at

  attribute :subtotal do |order_item|
    order_item.subtotal
  end

  attribute :formatted_subtotal do |order_item|
    order_item.formatted_subtotal
  end

  belongs_to :item
  belongs_to :order
end
