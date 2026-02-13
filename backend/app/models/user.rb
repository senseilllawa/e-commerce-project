class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # Devise modules
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  # Associations
  has_many :orders, dependent: :destroy

  # Validations
  validates :first_name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :last_name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :role, presence: true, inclusion: { in: %w[admin user] }
  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }

  # Callbacks
  before_validation :set_default_role, on: :create

  # Scopes
  scope :admins, -> { where(role: 'admin') }
  scope :regular_users, -> { where(role: 'user') }

  # Instance methods
  def admin?
    role == 'admin'
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  private

  def set_default_role
    self.role ||= 'user'
  end
end
