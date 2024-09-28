class API::V1::EventPicturesController < ApplicationController
    def create
        @event_picture = EventPicture.new(event_picture_params)
        
        if @event_picture.save
          render json: @event_picture, status: :created
        else
          render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
    
      private
      def event_picture_params
        params.require(:event_picture).permit(:image, :event_id, :user_id)
      end      
end
