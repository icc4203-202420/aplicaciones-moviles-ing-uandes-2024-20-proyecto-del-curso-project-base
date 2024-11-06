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

  def url
    picture.attached? ? Rails.application.routes.url_helpers.rails_blob_url(picture, only_path: true) : nil
  end

  private
  def save_picture_to_public_directory
    return unless picture.attached?

    images_dir = Rails.root.join("public", "event_images", "event_#{event.id}")

    FileUtils.mkdir_p(images_dir) unless Dir.exist?(images_dir)

    picture_path = Rails.root.join("tmp", picture.filename.to_s)
    File.open(picture_path, 'wb') do |file|
      file.write(picture.download)
    end

    FileUtils.mv(picture_path, images_dir.join(picture.filename.to_s))
  end
end
