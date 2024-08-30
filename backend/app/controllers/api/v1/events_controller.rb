class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  # GET bars/:bar_id/events
  def barIndex
    bar = Bar.find(params[:bar_id])
    @events = Event.where(bar_id: bar.id)
    render json: { events: @events }, status: :ok
  end

  # GET /events
  def index
    @events = Event.all
    render json: { events: @events }, status: :ok
  end

  # GET /events/:id
  def show
    if @event.flyer.attached?
      render json: @event.as_json.merge({ 
        flyer_url: url_for(@event.flyer), 
        thumbnail_url: url_for(@event.thumbnail)}),
        status: :ok
    else
      render json: { event: @event.as_json }, status: :ok
    end 
  end

  # POST /events
  def create
    @event = Event.new(event_params.except(:image_base64))
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /events/:id
  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # DELETE /events/:id
  def destroy
    @event.destroy
    head :no_content
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
    @event.flyer.attach(io: decoded_image[:io], 
      filename: decoded_image[:filename], 
      content_type: decoded_image[:content_type])
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end
end
