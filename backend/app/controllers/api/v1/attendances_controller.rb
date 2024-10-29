class API::V1::AttendancesController < ApplicationController
  respond_to :json

  def index
    @attendances = Attendance.all
    render json: @attendances, status: :ok
  end

  def create
    # Verifica si ya existe una asistencia para este usuario y evento
    @attendance = Attendance.find_by(user_id: attendance_params[:user_id], event_id: attendance_params[:event_id])

    if @attendance
      # Si ya existe, actualizamos el estado de 'checked_in'
      if @attendance.update(checked_in: attendance_params[:checked_in])
        render json: { message: 'Asistencia actualizada correctamente', attendance: @attendance }, status: :ok
      else
        render json: { errors: @attendance.errors.full_messages }, status: :unprocessable_entity
      end
    else
      # Si no existe, creamos una nueva asistencia
      @attendance = Attendance.new(attendance_params)
      if @attendance.save
        render json: { message: 'Asistencia confirmada', attendance: @attendance }, status: :created
      else
        render json: { errors: @attendance.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  def update
    @attendance = Attendance.find_by(id: params[:id])

    if @attendance.update(attendance_params)
      render json: { message: 'Asistencia actualizada correctamente', attendance: @attendance }, status: :ok
    else
      render json: { errors: @attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy 
    @attendance = Attendance.find_by(user_id: params[:user_id], event_id: params[:event_id])
    if @attendance
      @attendance.destroy
      render json: { message: 'Asistencia eliminada correctamente' }, status: :ok
    else
      render json: { message: 'No se encontró la asistencia' }, status: :not_found
    end
  end

  private

  def attendance_params
    params.require(:attendance).permit(:user_id, :event_id, :checked_in)
  end
end
