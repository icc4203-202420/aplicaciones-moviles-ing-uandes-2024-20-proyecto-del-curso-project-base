class API::V1::FriendshipsController < ApplicationController
  # include Authenticable
  respond_to :json
  # before_action :verify_jwt_token, only: [:create, :destroy]

  def index
    if params[:status] == 'pending' && params[:user_id].present?
      @friendships = Friendship.where(friend_id: params[:user_id], status: 'pending').includes(:user)
    else 
      @friendships = Friendship.all 
    end

    render json: @friendships.as_json(include: { user: { only: [:id, :first_name, :last_name, :handle] } }), status: :ok
  end

  def create
    @friendship = Friendship.new(friendship_params.merge(status: 'pending'))

    if @friendship.save
      render json: { friendship: @friendship, message: 'Friendship created successfully.' }, status: :ok
    else
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

  def accept
    @friendship = Friendship.find(params[:id])
  
    ActiveRecord::Base.transaction do
      # Actualiza la solicitud existente a aceptada
      @friendship.update!(status: 'accepted')
  
      # Crea la relación de amistad inversa si no existe
      Friendship.find_or_create_by!(
        user_id: @friendship.friend_id, 
        friend_id: @friendship.user_id,
        status: 'accepted'
      )
    end
  
    render json: { message: 'Solicitud de amistad aceptada.' }, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def decline
    @friendship = Friendship.find(params[:id])

    if @friendship.destroy
      render json: {message: 'Amistad Rechazada'}, status: :ok
    else
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @friendship = Friendship.find_by(id: params[:id])

    if @friendship.destroy
      render json: { message: 'Friendship successfully deleted.' }, status: :no_content
    else
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

  private

  def friendship_params
    params.require(:friendship).permit(:user_id, :friend_id)
  end
end
