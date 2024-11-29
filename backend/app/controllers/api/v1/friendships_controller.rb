class API::V1::FriendshipsController < ApplicationController
  include Authenticable

  respond_to :json
  before_action :verify_jwt_token, :set_user

  # GET /users/:user_id/friendships
  def index
    @friendships = Friendship.where(user_id: @user.id)
    render json: { friendships: @friendships }, status: :ok
  end

  # POST /users/:user_id/friendships
  def create
    @friendship = @user.friendships.build(friendship_params)
    if @friendship.save
      render json: { friendship: @friendship, message: 'Friendship created successfully.' }, status: :created
    else
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def friendship_params
    params.require(:friendship).permit(:friend_id, :bar_id)
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end  
end