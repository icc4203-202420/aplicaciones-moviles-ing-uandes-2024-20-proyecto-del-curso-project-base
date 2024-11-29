class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_active_storage_host
  # Método para obtener el usuario actual a partir del token de autenticación
  protected
  # def current_user
  #   token = request.headers['Authorization']&.split(' ')&.last
  #   @current_user ||= User.find_by(authentication_token: token) if token
  # end

  # Método para autenticar al usuario antes de ciertas acciones
  # def authenticate_user!
  #   render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user
  # end

  # Configurar parámetros permitidos para Devise
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:email, :password, :password_confirmation])
  end
  private

    def set_active_storage_host
      ActiveStorage::Current.url_options = { host: request.base_url }
    end
end
