module Authenticable
  extend ActiveSupport::Concern

  included do
    before_action :verify_jwt_token
  end

  private

  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    Rails.logger.info("Received Token: #{token}") # Debug token parsing

    begin
      # Attempt decoding the JWT
      decoded_token = JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key, true, { algorithm: 'HS256' })
      Rails.logger.info("Decoded Token Payload: #{decoded_token.inspect}")

      # Look for the user
      @current_user = User.find(decoded_token[0]['sub'])
      Rails.logger.info("Authenticated User: #{@current_user.inspect}")
    rescue JWT::DecodeError => e
      Rails.logger.error("JWT Decode Error: #{e.message}")
      head :unauthorized
    rescue ActiveRecord::RecordNotFound
      Rails.logger.error("User Not Found for Token")
      head :unauthorized
    end
  end


  def current_user
    @current_user
  end


  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end
end
