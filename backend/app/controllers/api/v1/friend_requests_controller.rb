class API::V1::FriendRequestsController < ApplicationController
  before_action :set_user

  # GET /api/v1/users/:user_id/friend_requests
  def index
    # Usamos inverse_friendships para obtener las solicitudes de amistad recibidas
    @friend_requests = @user.inverse_friendships.includes(:user) # 'user' es el remitente
    render json: { friend_requests: @friend_requests.as_json(include: { user: { only: [:id, :first_name, :last_name, :handle] } }) }
  end

  # POST /api/v1/users/:user_id/friend_requests/:id/accept
  def accept
    friend_request = @user.inverse_friendships.find(params[:id])
    if friend_request.update(accepted: true)  # Asumiendo que tienes un campo 'accepted'
      render json: { message: 'Friend request accepted.' }, status: :ok
    else
      render json: { error: 'Could not accept friend request.' }, status: :unprocessable_entity
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
    @user = User.find(params[:user_id]) # Busca el usuario por ID
  end
end
