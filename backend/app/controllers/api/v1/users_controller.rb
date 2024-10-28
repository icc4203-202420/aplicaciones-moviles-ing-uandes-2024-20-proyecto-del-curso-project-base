class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update]  
  
  def index
    @users = User.includes(:reviews, :address).all   
    render json: @users, status: :ok
  end

  def show
  
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    #byebug
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def search
    if params[:handle].present?
      search_handle = params[:handle].strip
      # Modificación para buscar sin necesidad de @ en el handle
      @users = User.where("handle LIKE ?", "%#{search_handle}%")
      
      render json: @users, status: :ok
    else
      render json: { error: 'Handle parameter is missing' }, status: :unprocessable_entity
    end
  end
  
  
  def friends
    @user = User.find(params[:id])
    @friends = @user.friends
    render json: @friends, status: :ok
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end
end