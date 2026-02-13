class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :item

  validates :quantity, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :price, presence: true 
  validates :item, :order, presence: true
  validates :item_id, uniqueness: { scope: :order_id, message: "already added to this order" }

  def subtotal
    (price || item.price) * quantity
  end

  def formatted_subtotal
    format('%.2f', subtotal)
  end
end