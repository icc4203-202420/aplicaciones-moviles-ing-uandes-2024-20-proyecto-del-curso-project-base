class API::V1::BrandsController <ApplicationController
  def index
    @brands = Brand.all
    render json: { brands: @brands }, status: :ok
  end

  def show
    @brand = Brand.find_by(id: params[:id])
    render json: { error: 'Brand not found' }, status: :not_found if @brand.nil?
    render json: { brand: @brand.as_json }, status: :ok
  end
end