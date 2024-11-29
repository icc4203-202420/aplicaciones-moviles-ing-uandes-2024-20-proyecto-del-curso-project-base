class API::V1::BreweriesController <ApplicationController
  def index
    @breweries = Brewery.all
    render json: { breweries: @breweries }, status: :ok
  end

  def show
    @brewery = Brewery.find_by(id: params[:id])
    render json: { error: 'Brewery not found' }, status: :not_found if @brewery.nil?
    render json: { brewery: @brewery.as_json }, status: :ok
  end
end