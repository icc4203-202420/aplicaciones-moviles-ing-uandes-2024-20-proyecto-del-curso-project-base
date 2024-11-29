class API::V1::BarsController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_bar, only: [:show, :update, :destroy]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  def index
    if params[:query].present?
      bars = Bar.joins(:address)
                .where('bars.name ILIKE ? OR addresses.city ILIKE ? OR addresses.country ILIKE ? OR addresses.line1 ILIKE ? OR addresses.line2 ILIKE ?',
                       "%#{params[:query]}%",
                       "%#{params[:query]}%",
                       "%#{params[:query]}%",
                       "%#{params[:query]}%")
    else
      bars = Bar.all
    end
    bars_with_event_count = bars.map do |bar|
      bar.as_json.merge(event_count: bar.event_count)
    end

    render json: { bars: bars_with_event_count }, status: :ok
  end

  # def show
  #   if @bar.image.attached?
  #     render json: @bar.as_json.merge({
  #       image_url: url_for(@bar.image),
  #       thumbnail_url: url_for(@bar.thumbnail),
  #       event_count: @bar.event_count  # Incluye el conteo de eventos
  #     }), status: :ok
  #   else
  #     render json: @bar.as_json.merge(event_count: @bar.event_count), status: :ok
  #   end
  # end
  def show
    events = @bar.events.map do |event|
      {
        name: event.name,
        description: event.description,
        start_date: event.start_date,
        end_date: event.end_date
      }
    end

    bar_details = @bar.as_json(include: { address: { only: [:line1, :line2, :city, :country] } })
                      .merge({
                        event_count: @bar.event_count,
                        events: events,
                        beers: @bar.beers.as_json
                      })

    render json: bar_details, status: :ok
  end

  def events
    bar = Bar.find(params[:id])
    events = bar.events.select(:id, :name, :start_date, :end_date)
    render json: { events: events }
  end

  def create
    @bar = Bar.new(bar_params.except(:image_base64))
    handle_image_attachment if bar_params[:image_base64]

    if @bar.save
      render json: { bar: @bar, message: 'Bar created successfully.' }, status: :ok
    else
      render json: @bar.errors, status: :unprocessable_entity
    end
  end

  def update
    handle_image_attachment if bar_params[:image_base64]

    if @bar.update(bar_params.except(:image_base64))
      render json: { bar: @bar, message: 'Bar updated successfully.' }, status: :ok
    else
      render json: @bar.errors, status: :unprocessable_entity
    end
  end

  # Método para eliminar un bar existente
  def destroy
    if @bar.destroy
      render json: { message: 'Bar successfully deleted.' }, status: :no_content
    else
      render json: @bar.errors, status: :unprocessable_entity
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_bar
    @bar = Bar.find_by(id: params[:id])
    render json: { error: 'Bar not found' }, status: :not_found unless @bar
  end

  def bar_params
    params.require(:bar).permit(
      :name, :latitude, :longitude, :image_base64, :address_id,
      address_attributes: [:user_id, :line1, :line2, :city, country_attributes: [:name]]
    )
  end

  def handle_image_attachment
    decoded_image = decode_image(bar_params[:image_base64])
    @bar.image.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
  end
end
