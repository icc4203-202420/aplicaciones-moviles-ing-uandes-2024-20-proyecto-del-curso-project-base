class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user, optional: true

  has_one_attached :image
end
