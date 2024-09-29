class API::V1::FriendRequestsController < ApplicationController
  before_action :set_user

  # GET /api/v1/users/:user_id/friend_requests
  def index
    @friend_requests = @user.inverse_friendships.includes(:user)
    render json: { friend_requests: @friend_requests.as_json(include: { user: { only: [:id, :first_name, :last_name, :handle] } }) }
  end

  # POST /api/v1/users/:user_id/friend_requests/:id/accept
  def accept
    friend_request = @user.inverse_friendships.find(params[:id])

    if friend_request
      # Crear la relación de amistad mutua (si no existe)
      existing_friendship = Friendship.find_by(user_id: @user.id, friend_id: friend_request.user_id)
      reverse_friendship = Friendship.find_by(user_id: friend_request.user_id, friend_id: @user.id)

      if existing_friendship.nil? && reverse_friendship.nil?
        # Crear ambas relaciones si ninguna existe
        Friendship.create(user_id: @user.id, friend_id: friend_request.user_id)
        Friendship.create(user_id: friend_request.user_id, friend_id: @user.id)
        render json: { message: 'Friend request accepted and friendship created.' }, status: :ok
      else
        # Si ya existe la amistad, no crear duplicados
        render json: { message: 'Friendship already exists.' }, status: :ok
      end
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
