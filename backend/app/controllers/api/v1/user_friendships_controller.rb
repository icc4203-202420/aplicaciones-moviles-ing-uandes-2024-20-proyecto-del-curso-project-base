class API::V1::UserFriendshipsController < ApplicationController
  before_action :set_user, only: [:index]

  # GET /api/v1/users/:user_id/friends
  def index
    # Combine friends (initiated) and inverse_friends (received)
    @friends = @user.friends + @user.inverse_friends

    # Remove duplicates in case of bidirectional friendships
    @friends = @friends.uniq

    render json: @friends, status: :ok
  end

  private

  def set_user
    @user = User.find_by(id: params[:user_id])
    if @user.nil?
      render json: { error: 'User not found' }, status: :not_found
    end
  end
end
