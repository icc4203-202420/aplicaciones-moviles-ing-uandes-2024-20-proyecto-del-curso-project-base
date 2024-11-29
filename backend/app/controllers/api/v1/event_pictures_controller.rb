class API::V1::EventPicturesController < ApplicationController
  def create
    @event_picture = EventPicture.new(event_picture_params)

    if @event_picture.save
      notify_tagged_friends(@event_picture) if @event_picture.tagged_friends.present?
      render json: { message: 'Picture uploaded successfully', event_picture: @event_picture }, status: :created
    else
      render json: { errors: @event_picture.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def event_picture_params
    params.require(:event_picture).permit(:event_id, :user_id, :description, :picture, tagged_friends: [])
  end

  def notify_tagged_friends(event_picture)
    friend_ids = event_picture.tagged_friends
    friends = User.where(id: friend_ids)

    friends.each do |friend|
      notification_sent = false

      if friend.expo_push_token.present?
        notification_sent = PushNotificationService.send_notification(
          to: friend.expo_push_token,
          title: "¡Has sido etiquetado en una foto!",
          body: "#{event_picture.user.handle} te ha etiquetado en una foto.",
          data: { screen: "EventsShow", event_id: event_picture.event_id }
        )

        if notification_sent
          Rails.logger.info("Notificación enviada con éxito a #{friend.handle}")
        else
          Rails.logger.error("Error al enviar la notificación a #{friend.handle}")
        end
      else
        Rails.logger.warn("El usuario #{friend.handle} no tiene expo_push_token, no se envió notificación")
      end
    end
  end
end
