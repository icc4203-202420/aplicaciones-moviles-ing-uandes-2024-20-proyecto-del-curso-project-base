class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user
  has_one_attached :image
  has_many :taggings
  has_many :tagged_users, through: :taggings, source: :user


  validates :image, presence: true
  validates :event, presence: true
  validates :user, presence: true
end
