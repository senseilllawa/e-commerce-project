class Item < ApplicationRecord
  # Associations
  has_many :order_items, dependent: :destroy
  has_many :orders, through: :order_items

  # Validations
  validates :name, presence: true, length: { minimum: 2, maximum: 200 }
  validates :description, length: { maximum: 2000 }, allow_blank: true
  validates :price, presence: true, numericality: { greater_than: 0 }

  # Scopes
  scope :search_by_name, ->(query) { where('name ILIKE ?', "%#{query}%") if query.present? }
  scope :ordered_by_name, -> { order(name: :asc) }
  scope :ordered_by_price, ->(direction = :asc) { order(price: direction) }

  # Instance methods
  def formatted_price
    format('%.2f', price)
  end
end
