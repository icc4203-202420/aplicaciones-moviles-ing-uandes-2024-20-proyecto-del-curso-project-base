class API::V1::EventPicturesController < ApplicationController
  before_action :set_event_picture, only: [:tag_user]
  before_action :verify_jwt_token, only: [:create, :tag_user] # Asegúrate de que el usuario esté autenticado

  def create
    @event_picture = EventPicture.new(event_picture_params)

    if @event_picture.save
      render json: @event_picture, status: :created
    else
      render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Nueva acción para etiquetar usuarios en una imagen
  def tag_user
    event_picture = EventPicture.find_by(id: params[:id], event_id: params[:event_id])
    user = User.find_by(id: params[:user_id])
  
    if event_picture && user
      tagging = Tagging.create(user: user, event_picture: event_picture)
  
      if tagging.persisted?
        render json: { message: 'User tagged successfully' }, status: :ok
      else
        render json: { error: 'Failed to tag user' }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Invalid event picture or user' }, status: :not_found
    end
  end
  

  private

  def event_picture_params
    params.require(:event_picture).permit(:image, :event_id, :user_id)
  end

  def set_event_picture
    @event_picture = EventPicture.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Event picture not found." }, status: :not_found
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end
end
