class API::V1::EventsController < ApplicationController
    include ImageProcessing
    include Authenticable
    include Rails.application.routes.url_helpers
    respond_to :json
    before_action :set_bar, only: [:index, :create]
    before_action :set_event, only: [:show, :update, :destroy, :attendees]
    before_action :verify_jwt_token, only: [:create, :update, :destroy]

    def check_in
      event = Event.find(params[:id])

      # Buscar si ya existe una relación de asistencia para este evento y usuario
      attendance = Attendance.find_or_initialize_by(user: current_user, event: event)

      if attendance.checked_in
        render json: { message: "You have already checked in to this event." }, status: :unprocessable_entity
      else
        # Marcar el check-in como completado
        # attendance.check_in
        attendance.update(checked_in: true)
        render json: { message: "Check-in successful." }, status: :ok
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Event not found." }, status: :not_found
    end

    def attendees
      attendees = @event.users.select(:id, :first_name, :last_name, :handle)
      render json: { attendees: attendees }, status: :ok
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Event not found' }, status: :not_found
    end

    def index
      # set_bar
      if @bar
        @events = @bar.events
        if @events.empty?
          render json: { message: "No events available" }, status: :ok
        else
          # render json: @events
          render json: { events: @events }, status: :ok
        end
      else
        @events = Event.all
        if @events.empty?
          render json: { message: "No events available" }, status: :ok
        else
          render json: { events: @events }, status: :ok
        end
      end

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
              }
            },
            methods: [:tagged_users, :image_url],
          }
        }
      )
      
      event_data[:video_url_path] = @event.video_url_path
      
      # Ensure flyer and thumbnail attachments exist before calling url_for
      # if @event.flyer.attached?
      #   event_data[:flyer_url] = url_for(@event.flyer)
      # end
    
      # if @event.thumbnail.attached?
      #   event_data[:thumbnail_url] = url_for(@event.thumbnail)
      # end
    
      render json: event_data, status: :ok
    end    
    
    def create
      @event = @bar.events.build(event_params)
      if @event.save
        render json: @event, status: :created, location: api_v1_event_url(@event)
      else
        render json: @event.errors, status: :unprocessable_entity
      end
    end

    def update
      if @event.update(event_params)
        render json: @event, status: :ok
      else
        render json: @event.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @event.destroy
      head :no_content
    end

    def pictures
      event = Event.find(params[:id])
      if event.event_pictures.any?
        pictures_data = event.event_pictures.map do |event_picture|
          if event_picture.image.attached?
            {
              id: event_picture.id,
              image_url: url_for(event_picture.image),
              description: event_picture.description
            }
          end
        end.compact

        render json: pictures_data
      else
        render json: { message: "No pictures found for this event." }, status: :not_found
      end
    end


    private

    def set_event
      @event = Event.find_by(id: params[:id])
      render json: { error: "Event not found" }, status: :not_found unless @event
    end

    def set_bar
      @bar = Bar.find(params[:bar_id]) if params[:bar_id]
    end

    def event_params
      params.require(:event).permit(:name, :description, :date, :flyer)
    end

    def verify_jwt_token
      authenticate_user!
      head :unauthorized unless current_user
    end
    # def verify_jwt_token
    #   token = request.headers['Authorization']&.split(' ')&.last
    #   Rails.logger.debug("Received token: #{token}")
    #   return head :unauthorized unless token

    #   begin
    #     decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
    #     user_id = decoded_token['user_id']
    #     @current_user = User.find(user_id)
    #     Rails.logger.debug("Authenticated user ID: #{user_id}")
    #   rescue JWT::DecodeError, ActiveRecord::RecordNotFound
    #     Rails.logger.debug("JWT decoding error or user not found")
    #     head :unauthorized
    #   end
    # end

    def current_user
      @current_user
    end

    def bar_json(bar)
      {
        id: bar.id,
        name: bar.name,
        event_count: bar.events.count # Aquí se incluye el número de eventos
      }
    end
  end
