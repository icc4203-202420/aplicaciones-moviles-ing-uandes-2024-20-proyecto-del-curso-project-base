class API::V1::AttendancesController < ApplicationController
  before_action :set_event, only: [:show, :create, :destroy]

  def create
    # Obtén el usuario basado en el `user_id` enviado desde el frontend
    user = User.find_by(id: params[:user_id])
    unless user
      return render json: { status: 'error', message: 'User not found' }, status: :not_found
    end

    @attendance = @event.attendances.find_or_initialize_by(user: user)

    if @attendance.update(checked_in: true)
      # Notificación para el usuario
      if user.push_token.present?
        PushNotificationService.send_notification(
          to: user.push_token,
          title: "Successfully checked in at #{@event.name}!",
          body: "",
          data: {}
        )
      end

      # Notificación para los amigos del usuario
      friends = user.friends
      friends.each do |friend|
        next unless friend.push_token.present?
        PushNotificationService.send_notification(
          to: friend.push_token,
          title: "#{user.handle} has checked in to an event!",
          body: "#{user.handle} has decided to attend the event: #{@event.name}.",
          data: { event_id: @event.id, route: "/events/#{@event.id}" }
        )
      end

      render json: { status: 'success', attendance: @attendance }, status: :ok
    else
      render json: { status: 'error', message: @attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    # Obtén el usuario basado en el `user_id` enviado desde el frontend
    user = User.find_by(id: params[:user_id])
    unless user
      return render json: { status: 'error', message: 'User not found' }, status: :not_found
    end

    @attendance = @event.attendances.find_by(user: user)
    if @attendance
      render json: { checked_in: @attendance.checked_in }, status: :ok
    else
      render json: { checked_in: false }, status: :ok
    end
  end

  def destroy
    # Obtén el usuario basado en el `user_id` enviado desde el frontend
    user = User.find_by(id: params[:user_id])
    unless user
      return render json: { status: 'error', message: 'User not found' }, status: :not_found
    end

    @attendance = @event.attendances.find_by(user: user)
    if @attendance&.destroy
      render json: { status: 'success' }, status: :ok
    else
      render json: { status: 'error', message: 'Unable to cancel attendance' }, status: :unprocessable_entity
    end
  end

  def users
    event = Event.find_by(id: params[:id])

    if event
      attendees = event.attendances.map(&:user)
      user = User.find_by(id: params[:user_id])
      unless user
        return render json: { status: 'error', message: 'User not found' }, status: :not_found
      end

      current_user_friends = user.friends.pluck(:friend_id)
      attendees_with_status = attendees.map do |attendee|
        {
          id: attendee.id,
          first_name: attendee.first_name,
          last_name: attendee.last_name,
          handle: attendee.handle,
          is_friend: current_user_friends.include?(attendee.id)
        }
      end
      render json: attendees_with_status
    else
      render json: { error: 'Event not found' }, status: :not_found
    end
  end

  private

  def set_event
    @event = Event.find(params[:id])
  end
end
