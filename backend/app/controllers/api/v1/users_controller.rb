class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update]
  before_action :authenticate_user!, only: [:update_push_token] 

  def update_push_token
    if current_user.update(expo_push_token: params[:expo_push_token])
      head :ok
    else
      render json: { error: 'No se pudo actualizar el push token' }, status: :unprocessable_entity
    end
  end

  def index
    @users = User.includes(:reviews, :address).all
    render json: { users: @users }, status: :ok
  end

  def show
    render json: {
      user: @user,
      friends: @user.friends,
      inverse_friends: @user.inverse_friends
    }, status: :ok
  end


  def create
    @user = User.new(user_params)
    if @user.save
      render json: { user: @user }, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: { user: @user }, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
    render json: { error: 'Usuario no encontrado' }, status: :not_found unless @user
  end

  def user_params
    params.fetch(:user, {}).permit(
      :id, :first_name, :last_name, :email, :age, :handle, :password,
      address_attributes: [
        :id, :line1, :line2, :city, :country, :country_id,
        country_attributes: [:id, :name]
      ],
      reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
    )
  end
end
