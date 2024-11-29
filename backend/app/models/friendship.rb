class Friendship < ApplicationRecord
  belongs_to :user
  belongs_to :friend, class_name: 'User'
  belongs_to :bar, optional: true

  enum status: { pending: 'pending', accepted: 'accepted', declined: 'declined' }

  validates :user_id, uniqueness: { scope: :friend_id, message: 'Solicitud Enviada' }
end
