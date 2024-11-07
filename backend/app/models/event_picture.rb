class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user
  has_one_attached :image
  has_many :taggings
  has_many :tagged_users, through: :taggings, source: :user

  validates :image, presence: true
  validates :event, presence: true
  validates :user, presence: true

  after_commit :save_picture_to_public_directory, on: [:create]

  # def image_url
  #   image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true) : nil
  # end
  def image_url
    Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true) if image.attached?
  end
  
  # # def url
  # #   Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true) if image.attached?
  # # end

  # private

  def save_picture_to_public_directory
    return unless image.attached?

    images_dir = Rails.root.join("public", "event_images", "event_#{event.id}")
    FileUtils.mkdir_p(images_dir) unless Dir.exist?(images_dir)

    image_path = Rails.root.join("tmp", image.filename.to_s)
    File.open(image_path, 'wb') do |file|
      file.write(image.download)
    end

    FileUtils.mv(image_path, images_dir.join(image.filename.to_s))
  end
end
