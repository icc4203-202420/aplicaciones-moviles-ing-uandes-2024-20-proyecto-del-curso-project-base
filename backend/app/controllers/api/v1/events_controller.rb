class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  # todo es casi lo mismo que bars_controller. existen cambios de nombres de variables mas q nada!!!

  def index
    @events = Event.all
    render json: { events: @events }, status: :ok
  end

  # GET /api/v1/bars/:bar_id/events
  def bars_events_index
    @events = Event.where(bar_id: params[:bar_id])
    render json: { events: @events }, status: :ok
  end


  # GET /api/v1/events/:id
  def show
    if @event.image.attached?
      render json: @event.as_json.merge({ 
        image_url: url_for(@event.image), 
        thumbnail_url: url_for(@event.thumbnail) }),
        status: :ok
    else
      render json: { event: @event.as_json }, status: :ok
    end
  end

  # POST /api/v1/events
  def create
    @event = Event.new(event_params.except(:image_base64))
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/events/
  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/events/:id
  def destroy
    if @event.destroy
      render json: { message: 'Event deleted successfully.' }, status: :no_content
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  private

  def set_event
    @event = Event.find(params[:id])

    rescue ActiveRecord::RecordNotFound
      render json: { message: 'Event not found.' }, status: :not_found
      
  end

  def event_params
    params.permit(:name, :description, :date, :start_date, :end_date, :bar_id, :image_base64)
  end

  # sacado de BarsController
  def handle_image_attachment
    decoded_image = decode_image(event_params[:image_base64])
    @event.image.attach(io: decoded_image, filename: 'event.jpg', content_type: 'image/jpg')
    @event.thumbnail.attach(io: resize_image(image, 200, 200), filename: 'event_thumbnail.jpg', content_type: 'image')
  end
    
end