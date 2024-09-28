class API::V1::FriendRequestsController < ApplicationController
  before_action :set_user

  # GET /api/v1/users/:user_id/friend_requests
  def index
    @friend_requests = @user.received_friend_requests.includes(:sender) # Asegúrate de incluir el remitente
    render json: { friend_requests: @friend_requests.as_json(include: :sender) } # Asegúrate de devolver información del remitente
  end

  # POST /api/v1/users/:user_id/friend_requests/:id/accept
  def accept
    friend_request = @user.received_friend_requests.find(params[:id])
    if friend_request.accept
      render json: { message: 'Friend request accepted.' }, status: :ok
    else
      render json: { error: 'Could not accept friend request.' }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/users/:user_id/friend_requests/:id/reject
  def reject
    friend_request = @user.received_friend_requests.find(params[:id])
    if friend_request.reject
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
