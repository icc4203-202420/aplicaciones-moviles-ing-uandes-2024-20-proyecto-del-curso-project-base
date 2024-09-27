class API::V1::EventPicturesController < ApplicationController
    
    def create
      @event_picture = EventPicture.new(event_picture_params)
      if @event_picture.save
        render json: { message: 'Foto subida con éxito' }, status: :created
      else
        render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
      end
    end
    def pictures
        event = Event.find(params[:id])
        pictures = event.event_pictures.with_attached_image
        render json: pictures.map { |picture| { id: picture.id, image_url: url_for(picture.image), description: picture.description } }
      end

    private

    def event_picture_params
      params.require(:event_picture).permit(:image, :event_id, :user_id, :description)
    end
end
