# require_relative '../services/push_notification_service'
class API::V1::FriendshipsController < ApplicationController
  include Authenticable

  respond_to :json
  before_action :set_user, only: [:index, :create]

  # GET /api/v1/users/:user_id/friendships
  def index
    # Obtener todas las amistades del usuario
    friendships = @user.friendships.includes(:friend)

    # Filtrar solo las amistades mutuas (donde el amigo también ha agregado al usuario)
    mutual_friendships = friendships.select do |friendship|
      friendship.friend.friendships.exists?(friend: @user)
    end

    # Mapa los datos de los amigos mutuos
    friend_data = mutual_friendships.map do |friendship|
      friendship.friend.slice(:id, :first_name, :last_name, :handle)
    end

    render json: friend_data, status: :ok
  end

  # GET /api/v1/users/:user_id/friendships/:friend_id
  def show
    friendship = @user.friendships.find_by(friend_id: params[:friend_id])

    if friendship.nil?
      render json: { error: 'Friendship not found' }, status: :not_found
    else
      render json: {
        friendship: {
          id: friendship.id,
          friend_id: friendship.friend_id,
          bar_id: friendship.bar_id,
          event_id: friendship.event_id,
        },
        friend: {
          id: friendship.friend.id,
          first_name: friendship.friend.first_name,
          last_name: friendship.friend.last_name,
          handle: friendship.friend.handle,
        }
      }, status: :ok
    end
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

    # Check for mutual friendship
    if @user.friendships.exists?(friend: @friend) && @friend.friendships.exists?(friend: @user)
      render json: { error: "You are already friends with this user" }, status: :unprocessable_entity
      return
    # Check for pending friend request
    elsif @user.friendships.exists?(friend: @friend)
      render json: { message: "Pending friend request" }, status: :ok
      return
    end

    # Create a new friendship request
    @friendship = @user.friendships.build(friendship_params)
    @friendship.bar_id = friendship_params[:bar_id] if friendship_params[:bar_id].present?
    @friendship.event_id = friendship_params[:event_id] if friendship_params[:event_id].present?

    if @friendship.save
      # Get the push tokens
      friend_push_token = @friend.push_token
      user_push_token = @user.push_token

      # Send notification to the friend
      PushNotificationService.send_notification(
        to: friend_push_token, # Token for the friend
        title: 'New Friend Request',
        body: "#{@user.first_name} #{@user.last_name} has sent you a friend request.",
        data: { friendship_id: @friendship.id }
      )

      render json: @friendship, status: :created
    else
      # Send notification to the current user about the failure
      PushNotificationService.send_notification(
        to: user_push_token, # Token for the current user
        title: 'Friend Request Failed',
        body: 'Could not send the friend request. Please try again later.',
        data: { error: @friendship.errors.full_messages }
      )

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
