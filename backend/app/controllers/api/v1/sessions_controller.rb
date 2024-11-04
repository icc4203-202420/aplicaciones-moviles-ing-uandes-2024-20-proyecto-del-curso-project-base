class API::V1::SessionsController < Devise::SessionsController
  include ::RackSessionsFix
  respond_to :json
  # def create
  #   user = User.find_by(email: params[:email])
  #   push_token = params[:push_token]

  #   if user && user.valid_password?(params[:password])
  #     # Actualizar el push_token si se proporciona
  #     user.update(push_token: push_token) if push_token.present?

  #     # Responder con el usuario y el token JWT
  #     respond_with(user)
  #   else
  #     render json: { errors: 'Email o contraseña incorrectos' }, status: :unauthorized
  #   end
  # end

  private
  def respond_with(current_user, _opts = {})
    token = request.env['warden-jwt_auth.token'] # Devise genera el token y lo coloca en 'warden-jwt_auth.token'
    render json: {
      status: {
        code: 200,
        message: 'Logged in successfully.',
        data: {
          user: UserSerializer.new(current_user).serializable_hash[:data][:attributes],
          token: token,
          # push_token: current_user.push_token
        }
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      jwt_payload = JWT.decode(
        request.headers['Authorization'].split(' ').last,
        Rails.application.credentials.devise_jwt_secret_key,
        true,
        { algorithm: 'HS256' }
      ).first
      current_user = User.find(jwt_payload['sub'])
    end

    if current_user
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
