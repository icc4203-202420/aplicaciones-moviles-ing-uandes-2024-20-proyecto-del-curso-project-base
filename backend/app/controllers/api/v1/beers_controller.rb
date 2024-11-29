class API::V1::BeersController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_beer, only: [:show, :update, :destroy]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  # GET /beers
  def index
    @beers = Beer.includes(:brand).all
    render json: { 
      beers: @beers.as_json(include: { brand: { only: [:name] } })
    }, status: :ok
  end

  def show
    @beer = Beer.includes(:brand, :bars, :reviews).find(params[:id])
  
    brewery = @beer.brand.brewery
  
    beer_data = @beer.as_json(only: [:id, :name, :beer_type, :style, :hop, :yeast, :malts, :ibu, :alcohol, :blg, :avg_rating], 
      include: {
        brand: { only: [:name] },
        bars: { only: [:id, :name, address: [:line1, :line2, :city]] }
      })
  
    beer_data[:brewery] = { name: brewery.name } if brewery.present?
  
    # Add reviews data
    beer_data[:reviews] = @beer.reviews.includes(:user).map do |review|
      {
        id: review.id,
        rating: review.rating,
        text: review.text,
        user: {
          id: review.user.id,
          name: "#{review.user.first_name} #{review.user.last_name}",
          handle: review.user.handle
        }
      }
    end
  
    # Add current user's review if it exists
    if current_user
      current_user_review = @beer.reviews.find_by(user: current_user)
      beer_data[:current_user_review] = current_user_review.as_json(only: [:id, :rating, :text]) if current_user_review
    end
  
    if @beer.image.attached?
      beer_data.merge!({
        image_url: url_for(@beer.image),
        thumbnail_url: url_for(@beer.thumbnail)
      })
    end
  
    render json: { beer: beer_data }, status: :ok
  end
  
  
  

  # POST /beers
  def create
    @beer = Beer.new(beer_params.except(:image_base64))
    handle_image_attachment if beer_params[:image_base64]

    if @beer.save
      render json: { beer: @beer, message: 'Beer created successfully.' }, status: :created
    else
      render json: @beer.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /beers/:id
  def update
    handle_image_attachment if beer_params[:image_base64]

    if @beer.update(beer_params.except(:image_base64))
      render json: { beer: @beer, message: 'Beer updated successfully.' }, status: :ok
    else
      render json: @beer.errors, status: :unprocessable_entity
    end
  end

  # DELETE /beers/:id
  def destroy
    @beer.destroy
    head :no_content
  end

  private

  def set_beer
    @beer = Beer.find_by(id: params[:id])
    render json: { error: 'Beer not found' }, status: :not_found if @beer.nil?
  end  

  def beer_params
    params.require(:beer).permit(:name, :beer_type, 
      :style, :hop, :yeast, :malts, 
      :ibu, :alcohol, :blg, :brand_id, :avg_rating,
      :image_base64)
  end

  def handle_image_attachment
    decoded_image = decode_image(beer_params[:image_base64])
    @beer.image.attach(io: decoded_image[:io], 
      filename: decoded_image[:filename], 
      content_type: decoded_image[:content_type])
  end 
  
  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end  
end