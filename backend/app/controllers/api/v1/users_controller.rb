class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update, :destroy, :friendships, :create_friendship] 
  before_action :verify_jwt_token, only: [:create, :update, :destroy]
  
  def index
    @users = User.includes(:reviews, :address).all   
  end

  # GET /api/v1/users/:id/friendships: retorna una lista de todas los user que son amigos segun el modelo Friendship
  def friendships
    @user = User.find(params[:id])
    @friends = @user.friends
    render json: { friends: @friends }, status: :ok
  end

  # POST /api/v1/users/:id/friendships: crea una nueva amistad entre dos usuarios
  def create_friendship
    @user = User.find(params[:id])
    @friend = User.find(params[:friend_id])
    @bar = Bar.find(params[:bar_id])
    @friendship = Friendship.new(user: @user, friend: @friend, bar: @bar)
    
    if @friendship.save
      render json: { message: 'Friendship created successfully.' }, status: :ok
    else
      render json: @friendship.errors, status: :unprocessable_entity
    end
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    #byebug
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end
end
