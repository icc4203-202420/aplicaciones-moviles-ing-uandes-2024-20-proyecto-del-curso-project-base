class API::V1::EventPicturesController < ApplicationController
  def index
    # @event_pictures = EventPicture.all
    @event_pictures = EventPicture.all.where(event_id: params[:event_id])
    render json: { event_pictures: @event_pictures }, status: :ok
  end
end