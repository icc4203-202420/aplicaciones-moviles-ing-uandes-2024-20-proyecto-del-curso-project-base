class API::V1::BarsBeersController < ApplicationController
    # include Authenticable
  
    respond_to :json
    before_action :set_beer, only: [:indexBeers]

    def index 
        @bars_beers = BarsBeer.all
        render json: { bars_beers: @bars_beers }, status: :ok
    end
  
    def indexBeers
      @bars_beers = BarsBeer.where(beer_id: @beer.id)
      render json: { bars_beers: @bars_beers }, status: :ok
    end
  
    private
  
    def set_beer
      @beer = Beer.find(params[:beer_id])
    end
  
  end