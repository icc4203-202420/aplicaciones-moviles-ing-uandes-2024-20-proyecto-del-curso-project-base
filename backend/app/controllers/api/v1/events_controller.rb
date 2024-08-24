class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable

  before_action :set_event, only: [:show, :update, :destroy]

  def show
    if @event.image.attached?
      render json: @event.as_json.merge({
        image_url: url_for(@event.image),
        thumbnail_url: url_for(@event.thumbnail)}),
        status: :ok
    else
      render json: { event: @event.as_json }, status: :ok
    end
  end

  def create

  end

  def update

  end

  def destroy
    @event.destroy
  end

  private

  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found if @event.nil?
  end

  def event_params
    params.require(:event).permit(:name, :description,
      :date, :bar_id, :start_date, :end_date,
      :image_base64)
  end

  def handle_image_attachment
    decoded_image = decode_image(event_params[:image_base64])
    @event.image.attach(io: decoded_image[:io],
      filename: decoded_image[:filename],
      content_type: decoded_image[:content_type])
  end

end
