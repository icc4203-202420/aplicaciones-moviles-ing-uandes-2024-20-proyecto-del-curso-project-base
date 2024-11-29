class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  def index
    bar_id = params[:bar_id]
    @events = Event.includes(:bar).where(bar_id: bar_id)
    render json: @events.as_json(include: { bar: { only: :name } }), status: :ok
  end

  def all_events
    @events = Event.all
    render json: @events.as_json(include: { bar: { only: :name } }), status: :ok
  end

  def show
    event_data = @event.as_json(
      include: {
        bar: {
          only: :name,
          include: {
            address: {
              only: [:line1, :line2, :city]
            }
          }
        },
        users: { only: [:id, :first_name, :last_name, :email, :handle] },
        event_pictures: {
          only: [:id, :description],
          include: {
            user: {
              only: [:id, :first_name, :last_name]
            },
            picture: {
              only: [:id, :description, :user_id],
              methods: :url
            }
          },
          methods: :tagged_friends
        }
      }
    )

    if @event.flyer.attached?
      event_data.merge!(
        flyer_url: url_for(@event.flyer),
        thumbnail_url: url_for(@event.thumbnail)
      )
    end

    render json: event_data, status: :ok
  end



  def create
    @event = Event.new(event_params.except(:flyer_base64)) # Cambiado a flyer_base64
    handle_flyer_attachment if event_params[:flyer_base64] # Cambiado a flyer_base64

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
    handle_flyer_attachment if event_params[:flyer_base64] # Cambiado a flyer_base64

    if @event.update(event_params.except(:flyer_base64)) # Cambiado a flyer_base64
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

  private

  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found unless @event
  end

  def event_params
    params.require(:event).permit(
      :name, :description, :date, :bar_id, :start_date, :end_date, :flyer_base64 # Cambiado a flyer_base64
    )
  end

  def handle_flyer_attachment
    decoded_flyer = decode_image(event_params[:flyer_base64]) # Cambiado a flyer_base64
    @event.flyer.attach(io: decoded_flyer[:io], filename: decoded_flyer[:filename], content_type: decoded_flyer[:content_type]) # Cambiado a flyer
  end
end
