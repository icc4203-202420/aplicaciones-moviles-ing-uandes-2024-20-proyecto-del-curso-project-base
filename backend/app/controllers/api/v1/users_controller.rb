class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]
  before_action :authenticate_user!, only: [:update, :friendships, :create_friendship]

  def index
    @users = User.includes(:reviews, :address).all
    render json: { users: @users }, status: :ok
  end

  def show
    render json: { user: @user }, status: :ok
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
      render :show, status: :ok, location: api_v1_user_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def friendships
    friends = @user.friendships.includes(:friend)
    render json: { friendships: friends.map { |f| f.friend.as_json } }, status: :ok
  end

  def create_friendship
    friend = User.find(params[:friend_id])
    friendship = @user.friendships.build(friend: friend)
    
    if friendship.save
      render json: { message: 'Friendship created successfully.' }, status: :created
    else
      render json: friendship.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end

  def user_params
    params.require(:user).permit(
      :id, :first_name, :last_name, :email, :age,
      { 
        address_attributes: [
          :id, :line1, :line2, :city, :country, :country_id, 
          country_attributes: [:id, :name]
        ],
        reviews_attributes: [
          :id, :text, :rating, :beer_id, :_destroy
        ]
      }
    )
  end
end
