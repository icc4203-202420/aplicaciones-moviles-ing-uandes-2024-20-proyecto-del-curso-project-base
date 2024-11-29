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
      flyer_urls = @event.flyer.map { |flyer| url_for(flyer) }
      thumbnail_urls = @event.flyer.map { |flyer| url_for(flyer.variant(resize_to_limit: [200, nil]).processed) }
      
      render json: { 
        event: @event.as_json.merge({ 
          flyer_urls: flyer_urls,
          thumbnail_urls: thumbnail_urls 
        }) 
      }, status: :ok
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
  # def update
  #   handle_image_attachment if event_params[:image_base64]

  #   if @event.update(event_params.except(:image_base64))
  #     render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
  #   else
  #     render json: @event.errors, status: :unprocessable_entity
  #   end
  # end
  # def update
  def update
    handle_image_attachment if event_params[:image_base64].present?
  
    if @event.update(event_params.except(:image_base64))
      flyer_urls = @event.flyer.map { |flyer| url_for(flyer) }
      thumbnail_urls = @event.flyer.map { |flyer| url_for(flyer.variant(resize_to_limit: [200, nil]).processed) }
      
      render json: { 
        event: @event.as_json.merge({ 
          flyer_urls: flyer_urls, 
          thumbnail_urls: thumbnail_urls 
        }) 
      }, status: :ok
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
      image_base64: [])
  end

  def handle_image_attachment
    event_params[:image_base64].each do |base64_image|
      decoded_image = decode_image(base64_image)
      @event.flyer.attach(
        io: decoded_image[:io], 
        filename: decoded_image[:filename], 
        content_type: decoded_image[:content_type]
      )

      EventPicture.create!(
        event: @event,
        user: current_user,
        description: "@#{current_user.handle} uploaded an image for event #{@event.name}"
      )
    end
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end
end
