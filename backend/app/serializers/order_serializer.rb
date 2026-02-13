class OrderSerializer
  include JSONAPI::Serializer

  attributes :id, :amount, :created_at, :updated_at

  attribute :formatted_amount do |order|
    order.formatted_amount
  end

  attribute :items_count do |order|
    order.items_count
  end

  belongs_to :user
  has_many :order_items
end
