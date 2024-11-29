class API::V1::FriendshipsController < ApplicationController
  before_action :set_user

  # GET /api/v1/users/:user_id/friendships
  def index
    @friendships = Friendship.includes(:friend).where(user_id: @user.id)

    friends_data = @friendships.map do |friendship|
      {
        id: friendship.friend.id,
        name: "#{friendship.friend.first_name} #{friendship.friend.last_name}",
        email: friendship.friend.email,
        handle: friendship.friend.handle
      }
    end

    render json: { friends: friends_data }, status: :ok
  end

  # GET /api/v1/users/:user_id/friendships/:friend_id
  def show
    friend = User.find_by(id: params[:friend_id])

    if friend.nil?
      return render json: { error: "Friend not found" }, status: :not_found
    end

    friendship = Friendship.find_by(user_id: @user.id, friend_id: friend.id)

    if friendship
      render json: {
        is_friend: true,
        friendship: {
          friend_id: friendship.friend_id,
          event_id: friendship.event_id 
        }
      }, status: :ok
    else
      render json: { is_friend: false }, status: :ok
    end
  end

  # POST /api/v1/users/:user_id/friendships
  def create
    friend = User.find_by(id: friendship_params[:friend_id])

    # Si no existe el amigo
    if friend.nil?
      render json: { error: "Friend not found" }, status: :not_found
      return
    end

    # Si ya son amigos
    if @user.friendships.exists?(friend: friend)
      render json: { error: "Already friends" }, status: :unprocessable_entity
      return
    end

    # Si es una nueva amistad
    @friendship = @user.friendships.build(friendship_params)
  
    if @friendship.save
      notification_sent = false
      if friend.expo_push_token.present?

        notification_sent = PushNotificationService.send_notification(
          to: friend.expo_push_token,
          title: "¡Nueva amistad!",
          body: "#{@user.handle} te ha agregado como amigo.",
          data: { screen: "Home" }
        )
  
        if notification_sent
          Rails.logger.info("Notificación enviada con éxito a #{friend.handle}")
        else
          Rails.logger.error("Error al enviar la notificación a #{friend.handle}")
        end
      else
        Rails.logger.warn("El usuario #{friend.handle} no tiene expo_push_token, no se envió notificación")
      end
  
      render json: { friendship: @friendship, notification_sent: notification_sent }, status: :created
    else
      Rails.logger.error("Error al guardar la amistad: #{@friendship.errors.full_messages.join(", ")}")
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/users/:user_id/friendships/:friend_id
  def update
    friend = User.find_by(id: params[:friend_id])

    if friend.nil?
      render json: { error: "Friend not found" }, status: :not_found
      return
    end

    friendship = Friendship.find_by(user_id: @user.id, friend_id: friend.id)

    if friendship.nil?
      render json: { error: "Friendship not found" }, status: :not_found
      return
    end

    if friendship.update(friendship_params)
      render json: friendship, status: :ok
    else
      render json: friendship.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def friendship_params
    params.require(:friendship).permit(:friend_id, :bar_id, :event_id)
  end
end
