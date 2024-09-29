class API::V1::FriendshipsController < ApplicationController
  include Authenticable

  respond_to :json
  before_action :set_user, only: [:index, :create]

  # GET /api/v1/users/:user_id/friendships
  def index
    friendships = @user.friendships.includes(:friend).map { |f| f.friend.select(:id, :first_name, :last_name, :handle) }
    render json: friendships, status: :ok
  end

  # POST /api/v1/users/:user_id/friendships
  def create
    @friend = User.find_by(id: friendship_params[:friend_id])

    if @friend.nil?
      render json: { error: 'Friend not found' }, status: :not_found
      return
    elsif @friend.id == @user.id
      render json: { error: 'You cannot be friends with yourself' }, status: :unprocessable_entity
      return
    end

    # Verificar si la amistad ya es mutua
    if @user.friendships.exists?(friend: @friend) && @friend.friendships.exists?(friend: @user)
      render json: { error: "You are already friends with this user" }, status: :unprocessable_entity
      return
    # Verificar si hay una solicitud pendiente
    elsif @user.friendships.exists?(friend: @friend)
      render json: { message: "Pending friend request" }, status: :ok
      return
    end

    # Crear una nueva solicitud de amistad
    @friendship = @user.friendships.build(friendship_params)
    @friendship.bar_id = friendship_params[:bar_id] if friendship_params[:bar_id].present?

    if @friendship.save
      render json: @friendship, status: :created
    else
      render json: { errors: @friendship.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end

  def friendship_params
    params.require(:friendship).permit(:friend_id, :bar_id)
  end
end
