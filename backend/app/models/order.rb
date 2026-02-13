class Order < ApplicationRecord
  # Associations
  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :items, through: :order_items

  validates :amount, presence: true
  validates :user, presence: true

  # Scopes
  scope :recent, -> { order(created_at: :desc) }

  # Instance methods

  def items_count
    order_items.sum(:quantity)
  end

  def formatted_amount
    format('%.2f', amount)
  end

  def status_text
    case status
    when 'pending' then 'В обработке'
    when 'completed' then 'Завершен'
    when 'cancelled' then 'Отменен'
    else status
    end
  end
end