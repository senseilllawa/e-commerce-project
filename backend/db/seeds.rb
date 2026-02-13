# Очищаем старые данные, чтобы не дублировались
puts "Cleaning database..."
OrderItem.destroy_all
Order.destroy_all
Item.destroy_all
User.destroy_all

# 1. Создаем Админа
admin = User.create!(
  first_name: "Admin",
  last_name: "Master",
  email: "admin@example.com",
  password: "password123",
  role: "admin"
)
puts "Admin created: admin@test.com"

# 2. Создаем обычного юзера
User.create!(
  first_name: "John",
  last_name: "Doe",
  email: "user@example.com",
  password: "password123",
  role: "user"
)
puts "User created: user@test.com"

# 3. Создаем товары
items = [
  { name: "iPhone 17 Pro", description: "Титановый корпус, чип A19 Pro", price: 1200.0 },
  { name: "MacBook Air M3", description: "13-inch, 16GB RAM, 512GB SSD", price: 1500.0 },
  { name: "AirPods Pro 2", description: "Активное шумоподавление, USB-C", price: 250.0 },
  { name: "Apple Watch Ultra 2", description: "Для экстремальных условий", price: 800.0 }
]

items.each do |item_data|
  Item.create!(item_data)
end
puts "Created #{Item.count} items."