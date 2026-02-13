class ItemSerializer
  include JSONAPI::Serializer

  attributes :id, :name, :description, :price, :created_at, :updated_at

  attribute :formatted_price do |item|
    item.formatted_price
  end
end
