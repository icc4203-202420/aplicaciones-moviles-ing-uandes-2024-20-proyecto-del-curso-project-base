class API::V1::EventPicturesController < ApplicationController
  before_action :set_event

  def create
    # Decodificar la imagen base64
    image_data = params[:image_base64]

    if image_data.present?
      decoded_image = decode_base64_image(image_data)

      event_picture = @event.event_pictures.build(user: current_user || User.first) # Asegúrate de reemplazar esto según tu autenticación

      event_picture.image.attach(
        io: StringIO.new(decoded_image[:data]),
        filename: decoded_image[:filename],
        content_type: decoded_image[:content_type]
      )

      if event_picture.save
        render json: { message: 'Image uploaded successfully.' }, status: :created
      else
        render json: { errors: event_picture.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'No image data provided' }, status: :unprocessable_entity
    end
  end

  def index
    pictures = @event.event_pictures.map do |picture|
      {
        id: picture.id,
        url: url_for(picture.image),
        thumbnail_url: url_for(picture.image.variant(resize: "100x100"))
      }
    end
    render json: { images: pictures }, status: :ok
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
  end

  def decode_base64_image(encoded_data)
    decoded_data = Base64.decode64(encoded_data.split(",").last)
    filename = "upload-#{Time.zone.now.to_i}.jpg"
    content_type = 'image/jpeg'

    { data: decoded_data, filename: filename, content_type: content_type }
  end
end
