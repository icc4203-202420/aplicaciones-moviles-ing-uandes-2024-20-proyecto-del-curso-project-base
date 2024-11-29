class API::V1::AttendancesController < ApplicationController
    # include Authenticable

    respond_to :json
    before_action :set_user, except: [:show, :index]

    def userEvents
        @attendances = Attendance.where(user_id: params[:user_id])
        render json: { attendances: @attendances }, status: :ok
    end

    def show
        @attendance = Attendance.where(event_id: params[:id])
        render json: { attendance: @attendance }, status: :ok
    end

    def index
        @attendances = Attendance.where(event_id: params[:event_id])
        render json: { attendances: @attendances }, status: :ok
    end

    def create
        @attendance = @user.attendances.build(attendance_params)
        if @attendance.save
            render json: { attendance: @attendance, message: 'Attendance created successfully.' }, status: :created
        else
            render json: @attendance.errors, status: :unprocessable_entity
        end
    end

    private

    def set_user
        @user = User.find(params[:user_id])
    end

    def attendance_params
        params.require(:attendance).permit(:user_id, :event_id)
    end

    def verify_jwt_token
        authenticate_user!
        head :unauthorized unless current_user
    end
    
end