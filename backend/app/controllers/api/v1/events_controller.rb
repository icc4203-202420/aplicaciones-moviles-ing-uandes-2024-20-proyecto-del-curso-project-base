class API::V1::EventsController < ApplicationController
    respond_to :json
    before_action :set_bar, only: [:index, :create]
    before_action :set_event, only: [:show, :update, :destroy]
    before_action :verify_jwt_token, only: [:create, :update, :destroy]
  
    def index
      if params[:bar_id]
        @events = @bar.events
      else
        @events = Event.all
      end
      render json: { events: @events }, status: :ok
    end
  
    def show
      if @event
        render json: { event: @event }, status: :ok
      else
        render json: { error: "Event not found" }, status: :not_found
      end
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
  end