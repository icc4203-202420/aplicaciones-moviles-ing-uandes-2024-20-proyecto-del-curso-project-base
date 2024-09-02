class API::V1::EventsController < ApplicationController
    before_action :
    before_action :

    def show
        render json: @event, methods: :thumbnail_url
    end

    def create
        @event = Event.new(event_params)
        @event.user = current_user
        if @event.save
            render json: @event, status: :created
        else
            render json: @event.errors, status: :unprocessable_entity
        end
    end

    def update
        if @event.update(event_params)
            render json: @event
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
        @event = Event.find(params[:id])
    end

    def event_params
        params.require(:event).permit(:name, :description, :date, :bar)

end