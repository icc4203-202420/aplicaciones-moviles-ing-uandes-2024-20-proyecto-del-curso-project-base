class ApplicationController < ActionController::API
  before_action :authenticate_user!

  before_action :configure_permitted_parameters, if: :devise_controller?
  protected
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name avatar])
    devise_parameter_sanitizer.permit(:account_update, keys: %i[name avatar])
  end

  private

  def authenticate_user!
    if current_user.nil?
      render json: { error: 'You need to log in' }, status: :unauthorized
    end
  end

end
