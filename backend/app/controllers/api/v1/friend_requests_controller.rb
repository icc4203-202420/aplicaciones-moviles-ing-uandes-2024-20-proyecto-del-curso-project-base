class API::V1::FriendRequestsController < ApplicationController
  before_action :set_user

  # GET /api/v1/users/:user_id/friend_requests
  def index
    # Obtener las solicitudes de amistad inversas
    @friend_requests = @user.inverse_friendships.includes(:user)
    Rails.logger.debug "Friend requests inverse: #{@friend_requests.inspect}"

    # Filtrar solicitudes de amistad donde se cumpla la condición deseada
    @friend_requests = @friend_requests.select do |request|
      existing_friendship = Friendship.exists?(user_id: @user.id, friend_id: request.user_id)
      reverse_friendship = Friendship.exists?(user_id: request.user_id, friend_id: @user.id)

      Rails.logger.debug "Checking request from user #{request.user_id}: Existing: #{existing_friendship}, Reverse: #{reverse_friendship}"

      # Solo mostrar si existe una amistad y la otra no
      (existing_friendship && !reverse_friendship) || (!existing_friendship && reverse_friendship)
    end

    Rails.logger.debug "Filtered friend requests: #{@friend_requests.inspect}"

    render json: { friend_requests: @friend_requests.as_json(include: { user: { only: [:id, :first_name, :last_name, :handle] } }) }
  end

  # POST /api/v1/users/:user_id/friend_requests/:id/accept
  def accept
    friend_request = @user.inverse_friendships.find_by(id: params[:id])

    if friend_request
      Rails.logger.debug "Friend request found: #{friend_request.inspect}"

      # Verificar si ya existe la relación de amistad
      existing_friendship = Friendship.find_by(user_id: @user.id, friend_id: friend_request.user_id)
      reverse_friendship = Friendship.find_by(user_id: friend_request.user_id, friend_id: @user.id)

      Rails.logger.debug "Existing friendship: #{existing_friendship.inspect}"
      Rails.logger.debug "Reverse friendship: #{reverse_friendship.inspect}"

      if existing_friendship.nil?
        Friendship.create(user_id: @user.id, friend_id: friend_request.user_id)
        Rails.logger.debug "Created friendship for user: #{@user.id} with friend: #{friend_request.user_id}"
      end

      if reverse_friendship.nil?
        Friendship.create(user_id: friend_request.user_id, friend_id: @user.id)
        Rails.logger.debug "Created reverse friendship for user: #{friend_request.user_id} with friend: #{@user.id}"
      end

      # Eliminar la solicitud de amistad después de aceptar
      # friend_request.destroy
      render json: { message: 'Friend request accepted' }, status: :ok
    else
      render json: { error: 'Could not find friend request.' }, status: :not_found
    end
  end

  # DELETE /api/v1/users/:user_id/friend_requests/:id/reject
  def reject
    friend_request = @user.inverse_friendships.find(params[:id])

    if friend_request.destroy
      render json: { message: 'Friend request rejected.' }, status: :ok
    else
      render json: { error: 'Could not reject friend request.' }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end
end
