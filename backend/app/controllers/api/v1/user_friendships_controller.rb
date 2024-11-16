class API::V1::UserFriendshipsController < ApplicationController
  before_action :set_user, only: [:index]

  # GET /api/v1/users/:user_id/friendships
  def index
    # Fetch all friendships where the user is either the user or the friend
    friendships = Friendship.where("user_id = ? OR friend_id = ?", @user.id, @user.id)
                             .includes(:user, :friend)  # Avoid N+1 queries
    
    # Render friendships as JSON, including associated user and friend records
    render json: friendships, include: ['user', 'friend']
  end

  private

  def set_user
    @user = User.find_by(id: params[:user_id])
    if @user.nil?
      render json: { error: 'User not found' }, status: :not_found
    end
  end
end
