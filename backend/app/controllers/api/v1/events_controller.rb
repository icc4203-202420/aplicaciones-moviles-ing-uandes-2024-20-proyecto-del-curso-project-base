class API::V1::EventsController < ApplicationController
  include ImageProcessing
  # include Authenticable

  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy]
  before_action :set_bar, only: [:index, :create] # Añadi
  # before_action :verify_jwt_token, only: [:create, :update, :destroy]

  def index
    if @bar
      @events = @bar.events
    else
      @events = Event.includes(:bar).all # Incluye los bares para evitar consultas adicionales
    end
    render json: @events.as_json(include: :bar), status: :ok # Incluye el bar en la respuesta JSON
  end

  def show
    images = @event.images.map do |image|
      {
        url: url_for(image),
        thumbnail_url: url_for(image.variant(resize_to_limit: [200, nil]).processed)
      }
    end
  
    # If there are no images, set it to null or an empty array
    images = images.presence || nil  # Change nil to [] if you want an empty array instead
  
    render json: {
      event: @event.as_json.merge({ images: images })
    }, status: :ok
  end
  
  

  def create
    @event = @bar.events.build(event_params.except(:image_base64)) # modificado
    handle_image_attachment if event_params[:image_base64]

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end
  
  def update
    handle_image_attachment if event_params[:image_base64]

    if @event.update(event_params.except(:image_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @event.destroy
      render json: { message: 'Event successfully deleted.' }, status: :no_content
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end  

  def attendees
    @event = Event.find(params[:id])
    @attendees = @event.users.distinct.joins(:attendances).where('attendances.checked_in = ?', true)
    render json: @attendees.as_json(only: [:id, :first_name, :last_name]), status: :ok
  end

  private

  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found unless @event
  end

  def set_bar
    @bar = Bar.find_by(id: params[:bar_id]) if params[:bar_id]
    render json: { error: 'Bar not found' }, status: :not_found if params[:bar_id] && !@bar
  end

  def event_params
    params.require(:event).permit(
      :name, :latitude, :longitude, images_base64: [], 
      address_attributes: [:user_id, :line1, :line2, :city, country_attributes: [:name]]
    )
  end
  

  def handle_image_attachment
    event_params[:images_base64].each do |image_base64|
      decoded_image = decode_image(image_base64)
      @event.images.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
    end
  end
end
  
